// ============================================================
// Base API client — handles JWT auth (HttpOnly cookie + Bearer)
// ============================================================
import type { StandardResponse } from "@/types/api.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
}

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/v1/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.data?.access_token) {
      setAccessToken(data.data.access_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = options;

  // Build URL with query params
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    ...rest,
    headers,
    credentials: "include", // send HttpOnly cookies
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  };

  let response = await fetch(url.toString(), config);

  // Auto-refresh on 401
  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      response = await fetch(url.toString(), { ...config, headers });
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(
      (errorBody as StandardResponse<unknown>).error ||
        (errorBody as StandardResponse<unknown>).message ||
        `Error ${response.status}`
    );
    (error as any).status = response.status;
    (error as any).data = errorBody;
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  const json: StandardResponse<T> = await response.json();
  return json.data;
}

// Convenience methods
export const api = {
  get: <T>(path: string, params?: RequestOptions["params"]) =>
    apiClient<T>(path, { method: "GET", params }),

  post: <T>(path: string, body?: unknown, params?: RequestOptions["params"]) =>
    apiClient<T>(path, { method: "POST", body, params }),

  put: <T>(path: string, body?: unknown) =>
    apiClient<T>(path, { method: "PUT", body }),

  patch: <T>(path: string, body?: unknown) =>
    apiClient<T>(path, { method: "PATCH", body }),

  delete: <T>(path: string) =>
    apiClient<T>(path, { method: "DELETE" }),
};
