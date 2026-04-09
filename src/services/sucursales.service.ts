import { api } from "./api";
import type {
  Sucursal,
  SucursalCreate,
  SucursalUpdate,
} from "@/types/api.types";

export const sucursalesService = {
  list: (params?: { cadena_id?: string; localizacion?: string; is_active?: boolean }) =>
    api.get<Sucursal[]>("/api/v1/sucursales", params),

  getById: (id: string) =>
    api.get<Sucursal>(`/api/v1/sucursales/${id}`),

  create: (body: SucursalCreate) =>
    api.post<Sucursal>("/api/v1/sucursales", body),

  update: (id: string, body: SucursalUpdate) =>
    api.put<Sucursal>(`/api/v1/sucursales/${id}`, body),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/v1/sucursales/${id}`),
};
