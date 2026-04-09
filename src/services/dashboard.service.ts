import { api } from "./api";
import type {
  DashboardKPI,
  DashboardTrendPoint,
  DashboardFilters,
  ComparativoSucursal,
} from "@/types/api.types";

export const dashboardService = {
  getKpis: (filters?: DashboardFilters) =>
    api.get<DashboardKPI>("/api/v1/dashboard/kpis", filters as Record<string, string>),

  getTrends: (filters?: DashboardFilters) =>
    api.get<DashboardTrendPoint[]>("/api/v1/dashboard/trends", filters as Record<string, string>),

  getComparativo: (params?: { cadena_id?: string; año?: number }) =>
    api.get<ComparativoSucursal[]>("/api/v1/dashboard/comparativo", params),
};
