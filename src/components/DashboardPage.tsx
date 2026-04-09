import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
  PieChart, Pie, Cell, Area, AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Percent, Loader2 } from "lucide-react";
import { useCadenas, useSucursales, useDashboardKpis, useDashboardTrends } from "@/hooks/useApiData";
import type { DashboardFilters } from "@/types/api.types";

const periodos = ["Últimos 6 meses", "Últimos 12 meses", "2024", "2025", "2026"];

const periodoToFilter = (p: string): Partial<DashboardFilters> => {
  if (p === "Últimos 6 meses") return { periodo: "6m" };
  if (p === "Últimos 12 meses") return { periodo: "12m" };
  return { año: parseInt(p) };
};

const mesLabels: Record<string, string> = {
  "1": "Ene", "2": "Feb", "3": "Mar", "4": "Abr", "5": "May", "6": "Jun",
  "7": "Jul", "8": "Ago", "9": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

const formatCurrency = (val: number) => `$${(val / 1000).toFixed(0)}k`;

const KpiCard = ({ title, value, change, icon: Icon, positive }: { title: string; value: string; change: string; icon: typeof DollarSign; positive: boolean }) => (
  <Card className="border-border">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-medium">{title}</span>
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent-foreground" />
        </div>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        {positive ? <TrendingUp className="w-3 h-3 text-green-600" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
        <span className={`text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>{change}</span>
        <span className="text-xs text-muted-foreground">vs mes anterior</span>
      </div>
    </CardContent>
  </Card>
);

const chartConfigBars = {
  ventasBrutas: { label: "Ventas brutas", color: "hsl(130, 45%, 38%)" },
  ventaNeta: { label: "Venta Neta", color: "hsl(130, 45%, 55%)" },
  costoVenta: { label: "Costo venta", color: "hsl(40, 90%, 55%)" },
};
const chartConfigUtilidad = {
  utilidadBruta: { label: "Utilidad bruta", color: "hsl(130, 45%, 38%)" },
  utilidadFinal: { label: "Utilidad final", color: "hsl(200, 60%, 50%)" },
};
const chartConfigInventario = {
  inicial: { label: "Inv. inicial", color: "hsl(200, 60%, 50%)" },
  compra: { label: "Compra", color: "hsl(40, 90%, 55%)" },
  final: { label: "Inv. final", color: "hsl(0, 70%, 55%)" },
};
const chartConfigGastos = {
  gastosOp: { label: "Gastos operativos", color: "hsl(40, 90%, 55%)" },
  gastosFijos: { label: "Gastos fijos", color: "hsl(200, 60%, 50%)" },
  gastosExtra: { label: "Gastos extraordinarios", color: "hsl(0, 70%, 55%)" },
};
const chartConfigPercent = {
  compVenta: { label: "% Comp/Venta", color: "hsl(40, 90%, 55%)" },
  costo: { label: "% Costo", color: "hsl(0, 70%, 55%)" },
  utilidad: { label: "% Utilidad", color: "hsl(130, 45%, 38%)" },
  uo: { label: "% UO", color: "hsl(200, 60%, 50%)" },
  margen: { label: "Margen neto", color: "hsl(270, 50%, 55%)" },
};

const DashboardPage = () => {
  const [selectedCadena, setSelectedCadena] = useState("Todas");
  const [selectedSucursal, setSelectedSucursal] = useState("Todas");
  const [selectedPeriodo, setSelectedPeriodo] = useState("Últimos 6 meses");

  const { data: cadenas } = useCadenas();
  const { data: sucursales } = useSucursales(
    selectedCadena !== "Todas" ? { cadena_id: selectedCadena } : undefined
  );

  const filters: DashboardFilters = useMemo(() => ({
    cadena_id: selectedCadena !== "Todas" ? selectedCadena : undefined,
    sucursal_id: selectedSucursal !== "Todas" ? selectedSucursal : undefined,
    ...periodoToFilter(selectedPeriodo),
  }), [selectedCadena, selectedSucursal, selectedPeriodo]);

  const { data: kpis, isLoading: kpisLoading } = useDashboardKpis(filters);
  const { data: trends, isLoading: trendsLoading } = useDashboardTrends(filters);

  const isLoading = kpisLoading || trendsLoading;

  // Transform trends to chart data
  const monthlyData = useMemo(() =>
    (trends ?? []).map((t) => ({
      mes: mesLabels[String(t.mes)] || t.mes,
      ventasBrutas: t.ventas_brutas,
      ventaNeta: t.venta_neta,
      costoVenta: t.costo_venta,
      utilidadBruta: t.utilidad_bruta,
      utilidadFinal: t.utilidad_final,
      gastosOp: t.gastos_operativos,
      gastosFijos: t.gastos_fijos,
      gastosExtra: t.gastos_extraordinarios,
    }))
  , [trends]);

  const inventarioData = useMemo(() =>
    (trends ?? []).map((t) => ({
      mes: mesLabels[String(t.mes)] || t.mes,
      inicial: t.inventario_inicial,
      compra: t.compra,
      final: t.inventario_final,
    }))
  , [trends]);

  const percentData = useMemo(() =>
    (trends ?? []).map((t) => ({
      mes: mesLabels[String(t.mes)] || t.mes,
      compVenta: t.pct_comp_venta,
      costo: t.pct_costo,
      utilidad: t.pct_utilidad,
      uo: t.pct_uo,
      margen: t.margen_utilidad_neta,
    }))
  , [trends]);

  const costBreakdownData = useMemo(() => {
    if (!kpis) return [];
    return [
      { name: "Costo venta", value: kpis.costo_venta ?? 0, fill: "hsl(130, 45%, 38%)" },
      { name: "Gastos operativos", value: kpis.gastos_operativos ?? 0, fill: "hsl(40, 90%, 55%)" },
      { name: "Gastos fijos", value: kpis.gastos_fijos ?? 0, fill: "hsl(200, 60%, 50%)" },
      { name: "Gastos extra", value: kpis.gastos_extraordinarios ?? 0, fill: "hsl(0, 70%, 55%)" },
    ];
  }, [kpis]);

  const calcChange = (pct: number | undefined) => {
    const val = pct ?? 0;
    return { change: `${val > 0 ? "+" : ""}${val.toFixed(1)}%`, positive: val >= 0 };
  };

  const cadenaOptions = ["Todas", ...(cadenas ?? []).map((c) => c.name)];
  const cadenaIdMap = Object.fromEntries((cadenas ?? []).map((c) => [c.name, c.id]));
  const sucursalOptions = ["Todas", ...(sucursales ?? []).map((s) => `${s.name} - ${s.localizacion}`)];
  const sucursalIdMap = Object.fromEntries((sucursales ?? []).map((s) => [`${s.name} - ${s.localizacion}`, s.id]));

  const handleCadenaChange = (v: string) => {
    setSelectedCadena(v === "Todas" ? "Todas" : cadenaIdMap[v] || v);
    setSelectedSucursal("Todas");
  };

  const handleSucursalChange = (v: string) => {
    setSelectedSucursal(v === "Todas" ? "Todas" : sucursalIdMap[v] || v);
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Financiero</h1>
          <p className="text-sm text-muted-foreground">Resumen de indicadores clave de rendimiento</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">Cadena</span>
            <Select value={selectedCadena} onValueChange={handleCadenaChange}>
              <SelectTrigger className="w-[180px] bg-card border-border text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {cadenaOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">Sucursal</span>
            <Select value={selectedSucursal} onValueChange={handleSucursalChange}>
              <SelectTrigger className="w-[160px] bg-card border-border text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {sucursalOptions.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">Periodo</span>
            <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
              <SelectTrigger className="w-[170px] bg-card border-border text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {periodos.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Cargando datos del dashboard...</span>
        </div>
      )}

      {!isLoading && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <KpiCard title="Ventas Brutas" value={`$${((kpis?.ventas_brutas ?? 0) / 1000).toFixed(0)}k`} {...calcChange(kpis?.cambio_ventas_brutas_pct)} icon={DollarSign} />
            <KpiCard title="Venta Neta" value={`$${((kpis?.venta_neta ?? 0) / 1000).toFixed(0)}k`} {...calcChange(kpis?.cambio_ventas_brutas_pct)} icon={DollarSign} />
            <KpiCard title="Utilidad Bruta" value={`$${((kpis?.utilidad_bruta ?? 0) / 1000).toFixed(0)}k`} {...calcChange(kpis?.cambio_utilidad_final_pct)} icon={TrendingUp} />
            <KpiCard title="Utilidad Final" value={`$${((kpis?.utilidad_final ?? 0) / 1000).toFixed(0)}k`} {...calcChange(kpis?.cambio_utilidad_final_pct)} icon={TrendingUp} />
            <KpiCard title="Margen Neto" value={`${(kpis?.margen_utilidad_neta ?? 0).toFixed(1)}%`} {...calcChange(kpis?.cambio_margen_pct)} icon={Percent} />
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base font-semibold text-foreground">Ventas y Costo</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigBars} className="h-[260px] w-full">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" tick={{ fill: "hsl(30,8%,50%)" }} />
                    <YAxis tickFormatter={formatCurrency} tick={{ fill: "hsl(30,8%,50%)" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="ventasBrutas" fill="var(--color-ventasBrutas)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ventaNeta" fill="var(--color-ventaNeta)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="costoVenta" fill="var(--color-costoVenta)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base font-semibold text-foreground">Utilidad Bruta vs Final</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigUtilidad} className="h-[260px] w-full">
                  <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" tick={{ fill: "hsl(30,8%,50%)" }} />
                    <YAxis tickFormatter={formatCurrency} tick={{ fill: "hsl(30,8%,50%)" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="utilidadBruta" fill="var(--color-utilidadBruta)" fillOpacity={0.2} stroke="var(--color-utilidadBruta)" strokeWidth={2} />
                    <Area type="monotone" dataKey="utilidadFinal" fill="var(--color-utilidadFinal)" fillOpacity={0.2} stroke="var(--color-utilidadFinal)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base font-semibold text-foreground">Inventario y Compras</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigInventario} className="h-[260px] w-full">
                  <BarChart data={inventarioData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" tick={{ fill: "hsl(30,8%,50%)" }} />
                    <YAxis tickFormatter={formatCurrency} tick={{ fill: "hsl(30,8%,50%)" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="inicial" fill="var(--color-inicial)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="compra" fill="var(--color-compra)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="final" fill="var(--color-final)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base font-semibold text-foreground">Desglose de Costos y Gastos</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-center">
                <ChartContainer config={{}} className="h-[260px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie data={costBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3}>
                      {costBreakdownData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base font-semibold text-foreground">Gastos por Categoría</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigGastos} className="h-[260px] w-full">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" tick={{ fill: "hsl(30,8%,50%)" }} />
                    <YAxis tickFormatter={formatCurrency} tick={{ fill: "hsl(30,8%,50%)" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="gastosOp" stackId="a" fill="var(--color-gastosOp)" />
                    <Bar dataKey="gastosFijos" stackId="a" fill="var(--color-gastosFijos)" />
                    <Bar dataKey="gastosExtra" stackId="a" fill="var(--color-gastosExtra)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base font-semibold text-foreground">Indicadores Porcentuales</CardTitle></CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigPercent} className="h-[260px] w-full">
                  <LineChart data={percentData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" tick={{ fill: "hsl(30,8%,50%)" }} />
                    <YAxis unit="%" tick={{ fill: "hsl(30,8%,50%)" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="compVenta" stroke="var(--color-compVenta)" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="costo" stroke="var(--color-costo)" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="utilidad" stroke="var(--color-utilidad)" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="uo" stroke="var(--color-uo)" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="margen" stroke="var(--color-margen)" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Dev Desc a VTA</p>
                <p className="text-lg font-bold text-foreground">${((kpis?.dev_desc_vta ?? 0)).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{kpis ? `${((kpis.dev_desc_vta / (kpis.ventas_brutas || 1)) * 100).toFixed(1)}% de ventas brutas` : "—"}</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">% Comp/Venta</p>
                <p className="text-lg font-bold text-foreground">{(kpis?.pct_comp_venta ?? 0).toFixed(0)}%</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Utilidad Operativa</p>
                <p className="text-lg font-bold text-foreground">${((kpis?.utilidad_operativa ?? 0)).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">% UO: {(kpis?.pct_uo ?? 0).toFixed(0)}%</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">% O+F</p>
                <p className="text-lg font-bold text-foreground">{(kpis?.pct_of ?? 0).toFixed(0)}%</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
