import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

const cadenas = ["Todas", "Corazón de Alcachofa", "Kokoro", "Oasis"];
const localizaciones = ["Todas", "Andares", "Punto Sao Paulo", "Centro"];
const periodos = ["Últimos 6 meses", "Últimos 12 meses", "2024", "2025", "2026"];

const monthlyData = [
  { mes: "Ene", ventasBrutas: 150000, ventaNeta: 138000, costoVenta: 89000, utilidadBruta: 49000, utilidadFinal: 18000, gastosOp: 20000, gastosFijos: 8000, gastosExtra: 3000 },
  { mes: "Feb", ventasBrutas: 162000, ventaNeta: 149000, costoVenta: 93000, utilidadBruta: 56000, utilidadFinal: 24000, gastosOp: 21000, gastosFijos: 8000, gastosExtra: 3000 },
  { mes: "Mar", ventasBrutas: 145000, ventaNeta: 133000, costoVenta: 87000, utilidadBruta: 46000, utilidadFinal: 16000, gastosOp: 19000, gastosFijos: 8500, gastosExtra: 2500 },
  { mes: "Abr", ventasBrutas: 178000, ventaNeta: 165000, costoVenta: 102000, utilidadBruta: 63000, utilidadFinal: 30000, gastosOp: 22000, gastosFijos: 8000, gastosExtra: 3000 },
  { mes: "May", ventasBrutas: 195000, ventaNeta: 181000, costoVenta: 110000, utilidadBruta: 71000, utilidadFinal: 36000, gastosOp: 23000, gastosFijos: 9000, gastosExtra: 3000 },
  { mes: "Jun", ventasBrutas: 188000, ventaNeta: 174000, costoVenta: 106000, utilidadBruta: 68000, utilidadFinal: 33000, gastosOp: 22500, gastosFijos: 8500, gastosExtra: 4000 },
];

const inventarioData = [
  { mes: "Ene", inicial: 32000, compra: 45000, final: 28000 },
  { mes: "Feb", inicial: 28000, compra: 48000, final: 30000 },
  { mes: "Mar", inicial: 30000, compra: 42000, final: 26000 },
  { mes: "Abr", inicial: 26000, compra: 50000, final: 32000 },
  { mes: "May", inicial: 32000, compra: 52000, final: 34000 },
  { mes: "Jun", inicial: 34000, compra: 47000, final: 29000 },
];

const costBreakdownData = [
  { name: "Costo venta", value: 89000, fill: "hsl(130, 45%, 38%)" },
  { name: "Gastos operativos", value: 20000, fill: "hsl(40, 90%, 55%)" },
  { name: "Gastos fijos", value: 8000, fill: "hsl(200, 60%, 50%)" },
  { name: "Gastos extra", value: 3000, fill: "hsl(0, 70%, 55%)" },
];

const percentData = [
  { mes: "Ene", compVenta: 30, costo: 64, utilidad: 35, of: 20, uo: 15, margen: 13 },
  { mes: "Feb", compVenta: 30, costo: 62, utilidad: 38, of: 19, uo: 19, margen: 16 },
  { mes: "Mar", compVenta: 29, costo: 65, utilidad: 35, of: 21, uo: 14, margen: 12 },
  { mes: "Abr", compVenta: 28, costo: 62, utilidad: 38, of: 18, uo: 20, margen: 18 },
  { mes: "May", compVenta: 27, costo: 61, utilidad: 39, of: 18, uo: 21, margen: 20 },
  { mes: "Jun", compVenta: 27, costo: 61, utilidad: 39, of: 18, uo: 20, margen: 19 },
];

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
  const [selectedLoc, setSelectedLoc] = useState("Todas");
  const [selectedPeriodo, setSelectedPeriodo] = useState("Últimos 6 meses");

  const latestMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];

  const calcChange = (curr: number, prev: number) => {
    const pct = ((curr - prev) / prev * 100).toFixed(1);
    return { change: `${Number(pct) > 0 ? "+" : ""}${pct}%`, positive: Number(pct) >= 0 };
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Financiero</h1>
          <p className="text-sm text-muted-foreground">Resumen de indicadores clave de rendimiento</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">Cadena</span>
            <Select value={selectedCadena} onValueChange={setSelectedCadena}>
              <SelectTrigger className="w-[180px] bg-card border-border text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cadenas.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">Sucursal</span>
            <Select value={selectedLoc} onValueChange={setSelectedLoc}>
              <SelectTrigger className="w-[160px] bg-card border-border text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {localizaciones.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">Periodo</span>
            <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
              <SelectTrigger className="w-[170px] bg-card border-border text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodos.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard title="Ventas Brutas" value={`$${(latestMonth.ventasBrutas / 1000).toFixed(0)}k`} {...calcChange(latestMonth.ventasBrutas, prevMonth.ventasBrutas)} icon={DollarSign} />
        <KpiCard title="Venta Neta" value={`$${(latestMonth.ventaNeta / 1000).toFixed(0)}k`} {...calcChange(latestMonth.ventaNeta, prevMonth.ventaNeta)} icon={DollarSign} />
        <KpiCard title="Utilidad Bruta" value={`$${(latestMonth.utilidadBruta / 1000).toFixed(0)}k`} {...calcChange(latestMonth.utilidadBruta, prevMonth.utilidadBruta)} icon={TrendingUp} />
        <KpiCard title="Utilidad Final" value={`$${(latestMonth.utilidadFinal / 1000).toFixed(0)}k`} {...calcChange(latestMonth.utilidadFinal, prevMonth.utilidadFinal)} icon={TrendingUp} />
        <KpiCard title="Margen Neto" value={`${percentData[percentData.length - 1].margen}%`} {...calcChange(percentData[percentData.length - 1].margen, percentData[percentData.length - 2].margen)} icon={Percent} />
      </div>

      {/* Row 1: Ventas & Utilidad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Ventas y Costo</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBars} className="h-[260px] w-full">
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" className="text-xs" tick={{ fill: "hsl(30,8%,50%)" }} />
                <YAxis tickFormatter={formatCurrency} className="text-xs" tick={{ fill: "hsl(30,8%,50%)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="ventasBrutas" fill="var(--color-ventasBrutas)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ventaNeta" fill="var(--color-ventaNeta)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="costoVenta" fill="var(--color-costoVenta)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Utilidad Bruta vs Final</CardTitle>
          </CardHeader>
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

      {/* Row 2: Inventario & Desglose de costos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Inventario y Compras</CardTitle>
          </CardHeader>
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
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Desglose de Costos y Gastos</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={{}} className="h-[260px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={costBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3}>
                  {costBreakdownData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Gastos & Porcentajes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigGastos} className="h-[260px] w-full">
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" tick={{ fill: "hsl(30,8%,50%)" }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fill: "hsl(30,8%,50%)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="gastosOp" stackId="a" fill="var(--color-gastosOp)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="gastosFijos" stackId="a" fill="var(--color-gastosFijos)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="gastosExtra" stackId="a" fill="var(--color-gastosExtra)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Indicadores Porcentuales</CardTitle>
          </CardHeader>
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

      {/* Dev Desc a VTA & Utilidad Operativa summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Dev Desc a VTA</p>
            <p className="text-lg font-bold text-foreground">$12,000</p>
            <p className="text-xs text-muted-foreground">6.4% de ventas brutas</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">% Comp/Venta</p>
            <p className="text-lg font-bold text-foreground">27%</p>
            <p className="text-xs text-green-600">↓ 3pts vs anterior</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Utilidad Operativa</p>
            <p className="text-lg font-bold text-foreground">$34,500</p>
            <p className="text-xs text-muted-foreground">% UO: 20%</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">% O+F</p>
            <p className="text-lg font-bold text-foreground">18%</p>
            <p className="text-xs text-green-600">Dentro de rango</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
