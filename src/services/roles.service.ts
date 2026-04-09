import { api } from "./api";
import type {
  Role,
  RoleCreate,
  RoleUpdate,
  Permission,
} from "@/types/api.types";

export const rolesService = {
  list: () =>
    api.get<Role[]>("/api/v1/roles"),

  getById: (id: string) =>
    api.get<Role>(`/api/v1/roles/${id}`),

  create: (body: RoleCreate) =>
    api.post<Role>("/api/v1/roles", body),

  update: (id: string, body: RoleUpdate) =>
    api.put<Role>(`/api/v1/roles/${id}`, body),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/v1/roles/${id}`),
};

export const permissionsService = {
  list: () =>
    api.get<Permission[]>("/api/v1/permissions"),
};
