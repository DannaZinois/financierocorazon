// ============================================================
// TypeScript interfaces matching backend Pydantic DTOs
// ============================================================

// --- Shared ---
export interface StandardResponse<T> {
  message: string;
  data: T;
  error: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// --- Permissions ---
export interface Permission {
  id: string;
  code: string;
  description: string | null;
}

// --- Roles ---
export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
}

export interface RoleCreate {
  name: string;
  description?: string | null;
  permission_ids?: string[];
}

export interface RoleUpdate {
  name?: string | null;
  description?: string | null;
  permission_ids?: string[] | null;
}

// --- Sucursales ---
export interface Sucursal {
  id: string;
  cadena_id: string;
  cadena_name: string;
  name: string;
  localizacion: string;
  is_active: boolean;
  created_at: string;
}

export interface SucursalCreate {
  cadena_id: string;
  name: string;
  localizacion: string;
}

export interface SucursalUpdate {
  name?: string | null;
  localizacion?: string | null;
  is_active?: boolean | null;
}

// --- Users ---
export interface User {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  roles: Role[];
  sucursales: Sucursal[];
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role_ids: string[];
  sucursal_ids?: string[];
}

export interface UserUpdate {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  is_active?: boolean | null;
  role_ids?: string[] | null;
  sucursal_ids?: string[] | null;
}

// --- Cadenas ---
export interface Cadena {
  id: string;
  name: string;
  is_active: boolean;
  sucursales_count: number;
  created_at: string;
}

export interface CadenaCreate {
  name: string;
}

export interface CadenaUpdate {
  name?: string | null;
  is_active?: boolean | null;
}

// --- Registros Financieros ---
export interface RegistroFinanciero {
  id: string;
  sucursal_id: string;
  sucursal_name: string;
  cadena_name: string;
  mes: number;
  año: number;
  estatus: "borrador" | "publicado";
  // Datos ingresados
  ventas_brutas: number;
  inventario_inicial: number;
  compra: number;
  inventario_final: number;
  dev_desc_vta: number;
  gastos_operativos: number;
  gastos_fijos: number;
  gastos_extraordinarios: number;
  // Calculados (server-side)
  pct_comp_venta: number;
  venta_neta: number;
  costo_venta: number;
  pct_costo: number;
  utilidad_bruta: number;
  pct_utilidad: number;
  pct_of: number;
  utilidad_operativa: number;
  pct_uo: number;
  utilidad_final: number;
  margen_utilidad_neta: number;
  // Metadata
  editado_por_nombre: string | null;
  fecha_ultima_edicion: string | null;
  publicado_por_nombre: string | null;
  fecha_publicacion: string | null;
  created_at: string;
}

export interface RegistroFinancieroCreate {
  sucursal_id: string;
  mes: number;
  año: number;
  ventas_brutas?: number;
  inventario_inicial?: number;
  compra?: number;
  inventario_final?: number;
  dev_desc_vta?: number;
  gastos_operativos?: number;
  gastos_fijos?: number;
  gastos_extraordinarios?: number;
}

export interface RegistroFinancieroUpdate {
  ventas_brutas?: number | null;
  inventario_inicial?: number | null;
  compra?: number | null;
  inventario_final?: number | null;
  dev_desc_vta?: number | null;
  gastos_operativos?: number | null;
  gastos_fijos?: number | null;
  gastos_extraordinarios?: number | null;
}

// --- Desgloses ---
export type DesgloseCategoria =
  | "ventas_brutas"
  | "inventario_inicial"
  | "compra"
  | "inventario_final"
  | "dev_desc_vta"
  | "venta_neta"
  | "costo_venta"
  | "utilidad_bruta"
  | "gastos_operativos"
  | "gastos_fijos"
  | "gastos_extraordinarios";

export type DesgloseTipo = "fijo" | "operativo" | "extraordinario";

export interface DesgloseLinea {
  id: string;
  registro_financiero_id: string;
  categoria: DesgloseCategoria;
  nombre: string;
  cantidad: number;
  tipo: DesgloseTipo;
  fecha_generacion: string | null;
}

export interface DesgloseLineaCreate {
  registro_financiero_id: string;
  categoria: DesgloseCategoria;
  nombre: string;
  cantidad: number;
  tipo: DesgloseTipo;
  fecha_generacion?: string | null;
}

export interface DesgloseLineaUpdate {
  nombre?: string | null;
  cantidad?: number | null;
  tipo?: DesgloseTipo | null;
  fecha_generacion?: string | null;
}

// --- Dashboard ---
export interface DashboardKPI {
  ventas_brutas: number;
  venta_neta: number;
  costo_venta: number;
  utilidad_bruta: number;
  utilidad_operativa: number;
  utilidad_final: number;
  margen_utilidad_neta: number;
  pct_comp_venta: number;
  pct_costo: number;
  pct_utilidad: number;
  pct_of: number;
  pct_uo: number;
  dev_desc_vta: number;
  gastos_operativos: number;
  gastos_fijos: number;
  gastos_extraordinarios: number;
  cambio_ventas_brutas_pct: number;
  cambio_utilidad_final_pct: number;
  cambio_margen_pct: number;
}

export interface DashboardTrendPoint {
  mes: string;
  año: number;
  ventas_brutas: number;
  venta_neta: number;
  costo_venta: number;
  utilidad_bruta: number;
  utilidad_final: number;
  gastos_operativos: number;
  gastos_fijos: number;
  gastos_extraordinarios: number;
  inventario_inicial: number;
  compra: number;
  inventario_final: number;
  pct_comp_venta: number;
  pct_costo: number;
  pct_utilidad: number;
  pct_uo: number;
  margen_utilidad_neta: number;
}

export interface DashboardFilters {
  cadena_id?: string | null;
  sucursal_id?: string | null;
  periodo?: "6m" | "12m" | null;
  año?: number | null;
}

export interface ComparativoSucursal {
  sucursal_id: string;
  sucursal_name: string;
  cadena_name: string;
  ventas_brutas: number;
  utilidad_final: number;
  margen_utilidad_neta: number;
}
