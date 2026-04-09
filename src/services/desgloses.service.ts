import { api } from "./api";
import type {
  DesgloseLinea,
  DesgloseLineaCreate,
  DesgloseLineaUpdate,
} from "@/types/api.types";

export const desglosesService = {
  list: (params?: { registro_financiero_id?: string; categoria?: string }) =>
    api.get<DesgloseLinea[]>("/api/v1/desgloses", params),

  create: (body: DesgloseLineaCreate) =>
    api.post<DesgloseLinea>("/api/v1/desgloses", body),

  update: (id: string, body: DesgloseLineaUpdate) =>
    api.put<DesgloseLinea>(`/api/v1/desgloses/${id}`, body),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/v1/desgloses/${id}`),
};
