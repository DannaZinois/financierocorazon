import { api } from "./api";
import type {
  RegistroFinanciero,
  RegistroFinancieroCreate,
  RegistroFinancieroUpdate,
} from "@/types/api.types";

export const finanzasService = {
  list: (params?: { sucursal_id?: string; mes?: number; año?: number; estatus?: string }) =>
    api.get<RegistroFinanciero[]>("/api/v1/finanzas", params),

  getById: (id: string) =>
    api.get<RegistroFinanciero>(`/api/v1/finanzas/${id}`),

  create: (body: RegistroFinancieroCreate) =>
    api.post<RegistroFinanciero>("/api/v1/finanzas", body),

  update: (id: string, body: RegistroFinancieroUpdate) =>
    api.put<RegistroFinanciero>(`/api/v1/finanzas/${id}`, body),

  publicar: (id: string) =>
    api.post<RegistroFinanciero>(`/api/v1/finanzas/${id}/publicar`),

  exportPdf: async (id: string): Promise<Blob> => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const response = await fetch(`${API_BASE_URL}/api/v1/finanzas/${id}/export-pdf`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error(`Export failed: ${response.status}`);
    return response.blob();
  },
};
