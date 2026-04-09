import { api } from "./api";
import type {
  User,
  UserCreate,
  UserUpdate,
  PaginatedResponse,
} from "@/types/api.types";

export const usersService = {
  list: (params?: { search?: string; page?: number; size?: number }) =>
    api.get<PaginatedResponse<User>>("/api/v1/users", params),

  getById: (id: string) =>
    api.get<User>(`/api/v1/users/${id}`),

  create: (body: UserCreate) =>
    api.post<User>("/api/v1/users", body),

  update: (id: string, body: UserUpdate) =>
    api.put<User>(`/api/v1/users/${id}`, body),

  toggleActive: (id: string) =>
    api.patch<User>(`/api/v1/users/${id}/toggle-active`),

  updateSucursales: (id: string, sucursal_ids: string[]) =>
    api.put<User>(`/api/v1/users/${id}/sucursales`, { sucursal_ids }),

  updatePassword: (id: string, password: string) =>
    api.put<{ message: string }>(`/api/v1/users/${id}/password`, { password }),
};
