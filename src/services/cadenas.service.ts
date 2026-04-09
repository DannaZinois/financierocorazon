import { api } from "./api";
import type {
  Cadena,
  CadenaCreate,
  CadenaUpdate,
} from "@/types/api.types";

export const cadenasService = {
  list: (params?: { is_active?: boolean }) =>
    api.get<Cadena[]>("/api/v1/cadenas", params),

  getById: (id: string) =>
    api.get<Cadena>(`/api/v1/cadenas/${id}`),

  create: (body: CadenaCreate) =>
    api.post<Cadena>("/api/v1/cadenas", body),

  update: (id: string, body: CadenaUpdate) =>
    api.put<Cadena>(`/api/v1/cadenas/${id}`, body),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/v1/cadenas/${id}`),
};
