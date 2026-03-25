import { useState } from "react";
import { Filter, Copy, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const cadenas = ["Corazón de Alcachofa", "Kokoro", "Oasis"];
const localizaciones = ["Andares", "Punto Sao Paulo", "Centro"];
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const años = ["2024", "2025", "2026"];

const mesIndex: Record<string, string> = {
  Enero: "01", Febrero: "02", Marzo: "03", Abril: "04",
  Mayo: "05", Junio: "06", Julio: "07", Agosto: "08",
  Septiembre: "09", Octubre: "10", Noviembre: "11", Diciembre: "12",
};

interface DocRow {
  id: number;
  cadena: string;
  localizacion: string;
  mes: string;
  año: string;
  fecha: string;
  usuario: string;
  cambios: number;
}

const usuarios = ["María García", "Carlos López", "Ana Martínez", "Pedro Ruiz", "Laura Sánchez", "Diego Torres", "Sofía Hernández"];

const generarFecha = (mes: string, año: string, dia: number) =>
  `${String(dia).padStart(2, "0")}/${mesIndex[mes]}/${año}`;

const mockDocs: DocRow[] = [
  { id: 1, cadena: "Corazón de Alcachofa", localizacion: "Andares", mes: "Enero", año: "2025", fecha: generarFecha("Enero", "2025", 15), usuario: "María García", cambios: 200 },
  { id: 2, cadena: "Kokoro", localizacion: "Andares", mes: "Febrero", año: "2025", fecha: generarFecha("Febrero", "2025", 20), usuario: "Carlos López", cambios: 150 },
  { id: 3, cadena: "Oasis", localizacion: "Centro", mes: "Marzo", año: "2025", fecha: generarFecha("Marzo", "2025", 10), usuario: "Ana Martínez", cambios: 180 },
  { id: 4, cadena: "Corazón de Alcachofa", localizacion: "Punto Sao Paulo", mes: "Abril", año: "2025", fecha: generarFecha("Abril", "2025", 5), usuario: "Pedro Ruiz", cambios: 120 },
  { id: 5, cadena: "Kokoro", localizacion: "Centro", mes: "Enero", año: "2024", fecha: generarFecha("Enero", "2024", 12), usuario: "Laura Sánchez", cambios: 90 },
  { id: 6, cadena: "Oasis", localizacion: "Andares", mes: "Marzo", año: "2024", fecha: generarFecha("Marzo", "2024", 22), usuario: "Diego Torres", cambios: 210 },
  { id: 7, cadena: "Corazón de Alcachofa", localizacion: "Centro", mes: "Febrero", año: "2026", fecha: generarFecha("Febrero", "2026", 8), usuario: "Sofía Hernández", cambios: 175 },
  { id: 8, cadena: "Kokoro", localizacion: "Punto Sao Paulo", mes: "Enero", año: "2026", fecha: generarFecha("Enero", "2026", 3), usuario: "María García", cambios: 95 },
];

const kpiNames = [
  "Ventas totales - Compra de mariscos",
  "Costo de ventas - Insumos de cocina",
  "Nómina - Sueldo de meseros",
  "Ventas totales - Bebidas alcohólicas",
  "Costo de ventas - Merma y desperdicio",
  "Gastos operativos - Mantenimiento de equipo",
  "Nómina - Sueldo de cocineros",
  "Gastos operativos - Servicios de limpieza",
  "Ventas totales - Platillos especiales",
  "Costo de ventas - Productos cárnicos",
  "Gastos operativos - Renta del local",
  "Nómina - Propinas redistribuidas",
  "Gastos operativos - Gas y electricidad",
  "Costo de ventas - Verduras y frutas",
  "Gastos operativos - Publicidad local",
];

const tipos = ["Fijo", "Extraordinario", "Operativo"];
const nombresUsuarios = ["María García", "Carlos López", "Ana Martínez", "Pedro Ruiz", "Laura Sánchez", "Diego Torres", "Sofía Hernández", "Roberto Díaz", "Elena Flores", "Manuel Vega", "Gabriela Ríos", "Fernando Castro", "Patricia Morales", "Alejandro Reyes", "Isabel Navarro"];

const comentarios = [
  "Se ajustó el precio del proveedor de mariscos por cambio de temporada",
  "Compra extraordinaria de insumos para evento especial del restaurante",
  "Actualización del sueldo base de meseros según nuevo tabulador",
  "Incremento en ventas de bebidas por promoción de fin de semana",
  "Se registró merma mayor por producto caducado en almacén",
  "Reparación urgente del horno principal de la cocina",
  "Ajuste salarial de cocineros por evaluación de desempeño trimestral",
  "Contratación de servicio de limpieza profunda mensual",
  "Nuevos platillos añadidos al menú de temporada aumentaron ventas",
  "Cambio de proveedor de cárnicos por mejor precio y calidad",
  "Renovación del contrato de renta con aumento del tres por ciento",
  "Redistribución de propinas conforme a la nueva política interna",
  "Aumento en tarifa de gas natural afectó el costo operativo",
  "Se negoció descuento con proveedor de verduras del mercado local",
  "Campaña publicitaria en redes sociales para atraer nuevos clientes",
];

interface CambioRow {
  kpi: string;
  fechaActualizacion: string;
  usuario: string;
  datoAnterior: string;
  datoNuevo: string;
  tipo: string;
  comentario: string;
}

const generarCambios = (mes: string, año: string): CambioRow[] => {
  const mi = parseInt(mesIndex[mes]);
  return kpiNames.map((kpi, i) => {
    const dia = ((i * 2 + 3) % 28) + 1;
    const anterior = Math.floor(Math.random() * 50000) + 1000;
    let nuevo = anterior + Math.floor(Math.random() * 10000) - 5000;
    if (nuevo === anterior) nuevo += 500;
    return {
      kpi,
      fechaActualizacion: `${String(dia).padStart(2, "0")}/${String(mi).padStart(2, "0")}/${año}`,
      usuario: nombresUsuarios[i % nombresUsuarios.length],
      datoAnterior: `$${anterior.toLocaleString()}`,
      datoNuevo: `$${Math.abs(nuevo).toLocaleString()}`,
      tipo: tipos[i % tipos.length],
      comentario: comentarios[i],
    };
  });
};

const MultiCheckDropdown = ({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);

  const toggle = (val: string) => {
    onChange(
      selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val]
    );
  };

  return (
    <div className="relative min-w-[180px]">
      <div className="flex items-center gap-1 mb-2 text-sm font-semibold text-foreground">
        {label} <Filter className="w-3.5 h-3.5" />
      </div>
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex items-center justify-between w-full border border-input rounded-md bg-background px-3 py-2 text-sm"
      >
        <span className="truncate text-muted-foreground">
          {selected.length > 0 ? selected.join(", ") : "Selecciona"}
        </span>
        <ChevronDown className="w-4 h-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full border border-input rounded-md bg-popover shadow-lg p-2 max-h-48 overflow-auto space-y-1">
          {options.map((o) => (
            <label key={o} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-accent rounded px-1 py-0.5">
              <input
                type="checkbox"
                checked={selected.includes(o)}
                onChange={() => toggle(o)}
                className="accent-primary"
              />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const FinanceDupPage = () => {
  const [cadenaFilter, setCadenaFilter] = useState<string>("");
  const [locFilter, setLocFilter] = useState<string>("");
  const [selectedMeses, setSelectedMeses] = useState<string[]>([]);
  const [selectedAños, setSelectedAños] = useState<string[]>([]);
  const [showExistente, setShowExistente] = useState(true);
  const [showNuevo, setShowNuevo] = useState(false);
  const [expandedCambios, setExpandedCambios] = useState<number | null>(null);
  const [expandedComentario, setExpandedComentario] = useState<number | null>(null);
  const [nuevosArchivos, setNuevosArchivos] = useState<DocRow[]>([]);

  const filteredDocs = mockDocs.filter((doc) => {
    if (cadenaFilter && cadenaFilter !== "__all__" && doc.cadena !== cadenaFilter) return false;
    if (locFilter && locFilter !== "__all__" && doc.localizacion !== locFilter) return false;
    if (selectedMeses.length > 0 && !selectedMeses.includes(doc.mes)) return false;
    if (selectedAños.length > 0 && !selectedAños.includes(doc.año)) return false;
    return true;
  });

  const handleNuevoCheck = (checked: boolean) => {
    setShowNuevo(checked);
    if (checked) {
      // Add current filtered results to nuevos table (avoid duplicates)
      setNuevosArchivos((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newOnes = filteredDocs.filter((d) => !existingIds.has(d.id));
        return [...prev, ...newOnes];
      });
    }
  };

  const removeNuevo = (id: number) => {
    setNuevosArchivos((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <h1
        className="text-3xl font-bold text-foreground mb-1"
        style={{ fontFamily: '"Myanmar MN", sans-serif' }}
      >
        Duplicar y aislar versiones
      </h1>
      <p className="text-muted-foreground mb-8">
        Consulta tus datos, actualiza, edita o borra lo necesario.
      </p>

      <h2 className="text-xl font-bold text-foreground mb-4">
        Ve todas las sucursales y filtra su contenido
      </h2>

      <div className="bg-card rounded-lg border border-border p-5 mb-8 shadow-md">
        <div className="flex flex-wrap items-start gap-6 mb-4">
          <div className="min-w-[200px]">
            <div className="flex items-center gap-1 mb-2 text-sm font-semibold text-foreground">
              Cadena <Filter className="w-3.5 h-3.5" />
            </div>
            <Select value={cadenaFilter} onValueChange={setCadenaFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas</SelectItem>
                {cadenas.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[200px]">
            <div className="flex items-center gap-1 mb-2 text-sm font-semibold text-foreground">
              Localización <Filter className="w-3.5 h-3.5" />
            </div>
            <Select value={locFilter} onValueChange={setLocFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas</SelectItem>
                {localizaciones.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <MultiCheckDropdown
            label="Meses"
            options={meses}
            selected={selectedMeses}
            onChange={setSelectedMeses}
          />
          <MultiCheckDropdown
            label="Años"
            options={años}
            selected={selectedAños}
            onChange={setSelectedAños}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-primary mb-2">Mostrar tipo de archivo</p>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={showExistente}
                onCheckedChange={(v) => setShowExistente(!!v)}
              />
              Existente
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={showNuevo}
                onCheckedChange={(v) => handleNuevoCheck(!!v)}
              />
              Nuevo
            </label>
          </div>
        </div>
      </div>

      {/* Existing documents table */}
      {showExistente && (
        <>
          <h2
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: '"Myanmar MN", sans-serif' }}
          >
            Historial de documentos editados
          </h2>

          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-md mb-8">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary">
                  <TableHead className="font-semibold text-foreground">Cadena y sucursal</TableHead>
                  <TableHead className="font-semibold text-foreground">Fecha de actualización</TableHead>
                  <TableHead className="font-semibold text-foreground">Usuario que actualizó</TableHead>
                  <TableHead className="font-semibold text-foreground cursor-pointer">Cambios</TableHead>
                  <TableHead className="font-semibold text-foreground">Ver archivo ⓘ</TableHead>
                  <TableHead className="font-semibold text-foreground">Acciones ⓘ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="text-foreground">{doc.cadena} - {doc.localizacion}</TableCell>
                    <TableCell className="text-foreground">{doc.fecha}</TableCell>
                    <TableCell className="text-foreground">{doc.usuario}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => setExpandedCambios(expandedCambios === doc.id ? null : doc.id)}
                        className="text-primary underline hover:text-primary/80 font-medium text-sm"
                      >
                        Número de cambios [{doc.cambios}]
                      </button>
                    </TableCell>
                    <TableCell>
                      <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 text-sm">
                        Ver archivo
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded hover:bg-accent text-primary" title="Crear copia">
                          <Copy className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Borrar">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDocs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No se encontraron documentos con los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Cambios detail table */}
          {expandedCambios !== null && (() => {
            const doc = filteredDocs.find((d) => d.id === expandedCambios);
            if (!doc) return null;
            const cambiosData = generarCambios(doc.mes, doc.año);
            return (
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-md mb-8">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="text-lg font-bold text-foreground">
                    Detalle de cambios: {doc.cadena} - {doc.localizacion} ({doc.mes} {doc.año})
                  </h3>
                  <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
                    onClick={() => setExpandedCambios(null)}
                  >
                    Close
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary">
                      <TableHead className="font-semibold text-foreground">KPI</TableHead>
                      <TableHead className="font-semibold text-foreground">Fecha de actualización</TableHead>
                      <TableHead className="font-semibold text-foreground">Usuario que actualizó</TableHead>
                      <TableHead className="font-semibold text-foreground">Dato anterior</TableHead>
                      <TableHead className="font-semibold text-foreground">Dato nuevo</TableHead>
                      <TableHead className="font-semibold text-foreground">Tipo</TableHead>
                      <TableHead className="font-semibold text-foreground">Comentario</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cambiosData.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-foreground text-sm">{row.kpi}</TableCell>
                        <TableCell className="text-foreground text-sm">{row.fechaActualizacion}</TableCell>
                        <TableCell className="text-foreground text-sm">{row.usuario}</TableCell>
                        <TableCell className="text-foreground text-sm">{row.datoAnterior}</TableCell>
                        <TableCell className="text-foreground text-sm">{row.datoNuevo}</TableCell>
                        <TableCell className="text-foreground text-sm">{row.tipo}</TableCell>
                        <TableCell className="text-sm max-w-[200px]">
                          <button
                            onClick={() => setExpandedComentario(expandedComentario === i ? null : i)}
                            className="text-left text-muted-foreground hover:text-foreground"
                          >
                            {expandedComentario === i
                              ? row.comentario
                              : row.comentario.slice(0, 30) + "..."}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })()}
        </>
      )}

      {/* Nuevos archivos table */}
      {showNuevo && nuevosArchivos.length > 0 && (
        <>
          <h2
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: '"Myanmar MN", sans-serif' }}
          >
            Nuevos archivos para duplicar
          </h2>

          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-md mb-8">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary">
                  <TableHead className="font-semibold text-foreground">Cadena y sucursal (localización)</TableHead>
                  <TableHead className="font-semibold text-foreground">Fecha de última actualización</TableHead>
                  <TableHead className="font-semibold text-foreground">Ver archivo</TableHead>
                  <TableHead className="font-semibold text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nuevosArchivos.map((doc) => (
                  <TableRow key={`nuevo-${doc.id}`}>
                    <TableCell className="text-foreground">{doc.cadena} - {doc.localizacion}</TableCell>
                    <TableCell className="text-foreground">{doc.fecha}</TableCell>
                    <TableCell>
                      <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 text-sm">
                        Ver archivo
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded hover:bg-accent text-primary" title="Crear copia">
                          <Copy className="w-5 h-5" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                          title="Borrar"
                          onClick={() => removeNuevo(doc.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceDupPage;
