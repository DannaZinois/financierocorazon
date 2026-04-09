import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { cadenasService } from "@/services/cadenas.service";
import { sucursalesService } from "@/services/sucursales.service";
import { finanzasService } from "@/services/finanzas.service";
import { dashboardService } from "@/services/dashboard.service";
import { desglosesService } from "@/services/desgloses.service";
import { rolesService } from "@/services/roles.service";
import type { DashboardFilters } from "@/types/api.types";

// ── Users ──
export const useUsers = (params?: { search?: string; page?: number; size?: number }) =>
  useQuery({
    queryKey: ["users", params],
    queryFn: () => usersService.list(params),
  });

export const useToggleUserActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.toggleActive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useUpdateUserPassword = () =>
  useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      usersService.updatePassword(id, password),
  });

export const useUpdateUserSucursales = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, sucursal_ids }: { id: string; sucursal_ids: string[] }) =>
      usersService.updateSucursales(id, sucursal_ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

// ── Cadenas ──
export const useCadenas = (params?: { is_active?: boolean }) =>
  useQuery({
    queryKey: ["cadenas", params],
    queryFn: () => cadenasService.list(params),
  });

// ── Sucursales ──
export const useSucursales = (params?: { cadena_id?: string; localizacion?: string; is_active?: boolean }) =>
  useQuery({
    queryKey: ["sucursales", params],
    queryFn: () => sucursalesService.list(params),
  });

// ── Roles ──
export const useRoles = () =>
  useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesService.list(),
  });

// ── Finanzas ──
export const useFinanzas = (params?: { sucursal_id?: string; mes?: number; año?: number; estatus?: string }) =>
  useQuery({
    queryKey: ["finanzas", params],
    queryFn: () => finanzasService.list(params),
  });

export const usePublicarFinanza = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => finanzasService.publicar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["finanzas"] }),
  });
};

// ── Desgloses ──
export const useDesgloses = (params?: { registro_financiero_id?: string; categoria?: string }) =>
  useQuery({
    queryKey: ["desgloses", params],
    queryFn: () => desglosesService.list(params),
    enabled: !!params?.registro_financiero_id,
  });

export const useCreateDesglose = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: desglosesService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["desgloses"] }),
  });
};

export const useUpdateDesglose = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof desglosesService.update>[1] }) =>
      desglosesService.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["desgloses"] }),
  });
};

export const useDeleteDesglose = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desglosesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["desgloses"] }),
  });
};

// ── Dashboard ──
export const useDashboardKpis = (filters?: DashboardFilters) =>
  useQuery({
    queryKey: ["dashboard", "kpis", filters],
    queryFn: () => dashboardService.getKpis(filters),
  });

export const useDashboardTrends = (filters?: DashboardFilters) =>
  useQuery({
    queryKey: ["dashboard", "trends", filters],
    queryFn: () => dashboardService.getTrends(filters),
  });

export const useDashboardComparativo = (params?: { cadena_id?: string; año?: number }) =>
  useQuery({
    queryKey: ["dashboard", "comparativo", params],
    queryFn: () => dashboardService.getComparativo(params),
  });
