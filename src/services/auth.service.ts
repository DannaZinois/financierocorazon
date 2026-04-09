import { api, setAccessToken } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthTokens> => {
    const data = await api.post<AuthTokens>("/auth/v1/login", payload);
    setAccessToken(data.access_token);
    return data;
  },

  refresh: async (): Promise<AuthTokens> => {
    const data = await api.post<AuthTokens>("/auth/v1/refresh");
    setAccessToken(data.access_token);
    return data;
  },

  logout: async (): Promise<void> => {
    setAccessToken(null);
    // Backend clears HttpOnly cookie
  },
};
