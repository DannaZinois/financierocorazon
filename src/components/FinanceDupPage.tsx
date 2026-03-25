import { useState, useRef, useEffect } from "react";
import { Filter, Copy, Trash2, ChevronDown, ArrowLeft, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  copyLabel?: string;
}

const generarFecha = (mes: string, año: string, dia: number) =>
  `${String(dia).padStart(2, "0")}/${mesIndex[mes]}/${año}`;

const baseMockDocs: DocRow[] = [
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

// Finance detail view data
const financeColumns = [
  "Ventas brutas", "Inventario inicial", "Compra", "Inventario final",
  "% Comp/Venta", "Dev Desc a VTA", "Venta Neta", "Costo venta",
  "% Costo", "Utilidad bruta", "% utilidad",
];
const isPercentColumn = (col: string) => col.startsWith("%") || col.includes("% ");
const mockRows = [
  ["150000", "32000", "45000", "28000", "30%", "12000", "138000", "89000", "64%", "49000", "35%"],
];
const desgloseData: Record<string, { nombre: string; cantidad: string; tipo: string }[]> = {
  "Ventas brutas": [
    { nombre: "Venta en comedor", cantidad: "$85000", tipo: "fijo" },
    { nombre: "Venta para llevar", cantidad: "$35000", tipo: "operativo" },
    { nombre: "Venta por delivery", cantidad: "$20000", tipo: "operativo" },
    { nombre: "Eventos privados", cantidad: "$10000", tipo: "extraordinario" },
  ],
  "Inventario inicial": [
    { nombre: "Proteínas y carnes", cantidad: "$12000", tipo: "fijo" },
    { nombre: "Frutas y verduras", cantidad: "$8000", tipo: "operativo" },
    { nombre: "Lácteos y huevos", cantidad: "$5000", tipo: "fijo" },
    { nombre: "Bebidas y licores", cantidad: "$7000", tipo: "fijo" },
  ],
  "Compra": [
    { nombre: "Compra de mariscos", cantidad: "$15000", tipo: "operativo" },
    { nombre: "Compra de vegetales", cantidad: "$10000", tipo: "operativo" },
    { nombre: "Insumos de cocina", cantidad: "$8000", tipo: "fijo" },
    { nombre: "Bebidas alcohólicas", cantidad: "$7000", tipo: "operativo" },
    { nombre: "Productos de limpieza", cantidad: "$5000", tipo: "fijo" },
  ],
  "Inventario final": [
    { nombre: "Proteínas restantes", cantidad: "$10000", tipo: "fijo" },
    { nombre: "Verduras en almacén", cantidad: "$6000", tipo: "operativo" },
    { nombre: "Lácteos en cámara fría", cantidad: "$5000", tipo: "fijo" },
    { nombre: "Licores en barra", cantidad: "$7000", tipo: "fijo" },
  ],
  "Dev Desc a VTA": [
    { nombre: "Descuento por temporada", cantidad: "$5000", tipo: "extraordinario" },
    { nombre: "Devolución de platillos", cantidad: "$3000", tipo: "operativo" },
    { nombre: "Cortesías a clientes", cantidad: "$4000", tipo: "extraordinario" },
  ],
  "Venta Neta": [
    { nombre: "Ingreso neto comedor", cantidad: "$78000", tipo: "fijo" },
    { nombre: "Ingreso neto delivery", cantidad: "$32000", tipo: "operativo" },
    { nombre: "Ingreso neto eventos", cantidad: "$28000", tipo: "extraordinario" },
  ],
  "Costo venta": [
    { nombre: "Costo de alimentos", cantidad: "$45000", tipo: "fijo" },
    { nombre: "Costo de bebidas", cantidad: "$18000", tipo: "operativo" },
    { nombre: "Merma y desperdicio", cantidad: "$12000", tipo: "operativo" },
    { nombre: "Empaque para llevar", cantidad: "$8000", tipo: "fijo" },
    { nombre: "Gas y energéticos", cantidad: "$6000", tipo: "fijo" },
  ],
  "Utilidad bruta": [
    { nombre: "Margen de alimentos", cantidad: "$30000", tipo: "fijo" },
    { nombre: "Margen de bebidas", cantidad: "$12000", tipo: "operativo" },
    { nombre: "Margen de eventos", cantidad: "$7000", tipo: "extraordinario" },
  ],
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val: string) => {
    onChange(
      selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val]
    );
  };

  return (
    <div ref={ref} className="relative min-w-[180px]">
      <div className="flex items-center gap-1 mb-2 text-sm font-semibold text-foreground">
        {label} <Filter className="w-3.5 h-3.5" />
      </div>
      <button
        onClick={() => setOpen(!open)}
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

interface DesgloseRow {
  id: number;
  nombre: string;
  cantidadNueva: number;
  cantidadAnterior: number;
  tipo: string;
  comentario: string;
  usuario: string;
  fecha: string;
}

let desgloseNextId = 1000;

const buildDesgloseRows = (col: string, mes: string, año: string): DesgloseRow[] => {
  const items = desgloseData[col];
  if (!items) return [];
  const mesIdx = parseInt(mesIndex[mes]);
  return items.map((item, i) => {
    const amount = parseInt(item.cantidad.replace(/[$,]/g, ""));
    const anterior = amount + Math.floor(Math.random() * 5000) - 2500;
    const day = String(Math.min((i + 1) * 5, 28)).padStart(2, "0");
    return {
      id: desgloseNextId++,
      nombre: item.nombre,
      cantidadNueva: amount,
      cantidadAnterior: Math.abs(anterior),
      tipo: item.tipo,
      comentario: comentarios[i % comentarios.length],
      usuario: nombresUsuarios[i % nombresUsuarios.length],
      fecha: `${day}/${String(mesIdx).padStart(2, "0")}/${año}`,
    };
  });
};

// Detail view for "Ver archivo"
const FileDetailView = ({
  doc,
  onBack,
  allDocs,
}: {
  doc: DocRow;
  onBack: (addedCount: number) => void;
  allDocs: DocRow[];
}) => {
  const [desgloseCol, setDesgloseCol] = useState<string | null>(null);
  const [showPdfDialog, setShowPdfDialog] = useState(false);
  const [desgloseRows, setDesgloseRows] = useState<DesgloseRow[]>([]);
  const [tableValues, setTableValues] = useState<string[]>([...mockRows[0]]);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [duplicateMsg, setDuplicateMsg] = useState<string>("");
  const [filterError, setFilterError] = useState(false);

  // Filters
  const [fCadena, setFCadena] = useState<string>("");
  const [fLoc, setFLoc] = useState<string>("");
  const [fMeses, setFMeses] = useState<string[]>([]);
  const [fAños, setFAños] = useState<string[]>([]);
  const [mesDropOpen, setMesDropOpen] = useState(false);
  const [añoDropOpen, setAñoDropOpen] = useState(false);
  const mesRef = useRef<HTMLDivElement>(null);
  const añoRef = useRef<HTMLDivElement>(null);

  // Extra added tables
  const [addedDocs, setAddedDocs] = useState<DocRow[]>([]);
  const [addedTableValues, setAddedTableValues] = useState<Record<number, string[]>>({});
  const [addedDesgloseCol, setAddedDesgloseCol] = useState<{ docId: number; col: string } | null>(null);
  const [addedDesgloseRows, setAddedDesgloseRows] = useState<DesgloseRow[]>([]);
  const [addedEditingRowId, setAddedEditingRowId] = useState<number | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (mesRef.current && !mesRef.current.contains(e.target as Node)) setMesDropOpen(false);
      if (añoRef.current && !añoRef.current.contains(e.target as Node)) setAñoDropOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = () => {
    setDuplicateMsg("");
    setFilterError(false);
    const filtered = allDocs.filter((d) => {
      if (d.id === doc.id) return false;
      if (fCadena && fCadena !== "__all__" && d.cadena !== fCadena) return false;
      if (fLoc && fLoc !== "__all__" && d.localizacion !== fLoc) return false;
      if (fMeses.length > 0 && !fMeses.includes(d.mes)) return false;
      if (fAños.length > 0 && !fAños.includes(d.año)) return false;
      return true;
    });
    // Check for duplicates
    const existingIds = new Set(addedDocs.map((r) => r.id));
    const newOnes = filtered.filter((d) => !existingIds.has(d.id));
    if (newOnes.length === 0 && filtered.length > 0) {
      setDuplicateMsg("Esta tabla ya ha sido seleccionada");
      setFilterError(true);
      return;
    }
    setAddedDocs((prev) => {
      const newValues: Record<number, string[]> = {};
      newOnes.forEach((d) => { newValues[d.id] = [...mockRows[0]]; });
      setAddedTableValues((pv) => ({ ...pv, ...newValues }));
      return [...prev, ...newOnes];
    });
  };

  const toggleMes = (m: string) => setFMeses((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  const toggleAño = (a: string) => setFAños((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const handleOpenDesglose = (col: string) => {
    if (desgloseCol === col) { setDesgloseCol(null); return; }
    setDesgloseCol(col);
    setDesgloseRows(buildDesgloseRows(col, doc.mes, doc.año));
    setAddedDesgloseCol(null);
  };

  const handleOpenAddedDesglose = (docId: number, col: string, addedDoc: DocRow) => {
    if (addedDesgloseCol?.docId === docId && addedDesgloseCol?.col === col) {
      setAddedDesgloseCol(null); return;
    }
    setAddedDesgloseCol({ docId, col });
    setAddedDesgloseRows(buildDesgloseRows(col, addedDoc.mes, addedDoc.año));
    setDesgloseCol(null);
  };

  const getColIndex = (col: string) => financeColumns.indexOf(col);

  const updateParentValue = (col: string, delta: number) => {
    const idx = getColIndex(col);
    if (idx < 0) return;
    setTableValues((prev) => {
      const updated = [...prev];
      const current = parseInt(updated[idx].replace(/[%$,]/g, "")) || 0;
      updated[idx] = String(current + delta);
      return updated;
    });
  };

  const updateAddedParentValue = (docId: number, col: string, delta: number) => {
    const idx = getColIndex(col);
    if (idx < 0) return;
    setAddedTableValues((prev) => {
      const vals = [...(prev[docId] || mockRows[0])];
      const current = parseInt(vals[idx].replace(/[%$,]/g, "")) || 0;
      vals[idx] = String(current + delta);
      return { ...prev, [docId]: vals };
    });
  };

  const addRow = () => {
    if (!desgloseCol) return;
    const mesIdx = parseInt(mesIndex[doc.mes]);
    const newRow: DesgloseRow = {
      id: desgloseNextId++, nombre: "Nombre aquí", cantidadNueva: 0, cantidadAnterior: 0,
      tipo: "fijo", comentario: "Comentario", usuario: "Usuario",
      fecha: `01/${String(mesIdx).padStart(2, "0")}/${doc.año}`,
    };
    setDesgloseRows((prev) => [...prev, newRow]);
    setEditingRowId(newRow.id);
  };

  const addAddedRow = (docId: number, addedDoc: DocRow) => {
    if (!addedDesgloseCol) return;
    const mesIdx = parseInt(mesIndex[addedDoc.mes]);
    const newRow: DesgloseRow = {
      id: desgloseNextId++, nombre: "Nombre aquí", cantidadNueva: 0, cantidadAnterior: 0,
      tipo: "fijo", comentario: "Comentario", usuario: "Usuario",
      fecha: `01/${String(mesIdx).padStart(2, "0")}/${addedDoc.año}`,
    };
    setAddedDesgloseRows((prev) => [...prev, newRow]);
    setAddedEditingRowId(newRow.id);
  };

  const deleteRow = (row: DesgloseRow) => {
    if (!desgloseCol) return;
    setDesgloseRows((prev) => prev.filter((r) => r.id !== row.id));
    updateParentValue(desgloseCol, -row.cantidadNueva);
  };

  const deleteAddedRow = (row: DesgloseRow, docId: number) => {
    if (!addedDesgloseCol) return;
    setAddedDesgloseRows((prev) => prev.filter((r) => r.id !== row.id));
    updateAddedParentValue(docId, addedDesgloseCol.col, -row.cantidadNueva);
  };

  const updateRow = (id: number, field: keyof DesgloseRow, value: string | number) => {
    setDesgloseRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === "cantidadNueva" && desgloseCol) {
          const oldVal = r.cantidadNueva;
          const newVal = typeof value === "number" ? value : parseInt(value) || 0;
          updateParentValue(desgloseCol, newVal - oldVal);
          return { ...r, cantidadNueva: newVal };
        }
        return { ...r, [field]: value };
      })
    );
  };

  const updateAddedRow = (id: number, field: keyof DesgloseRow, value: string | number, docId: number) => {
    setAddedDesgloseRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === "cantidadNueva" && addedDesgloseCol) {
          const oldVal = r.cantidadNueva;
          const newVal = typeof value === "number" ? value : parseInt(value) || 0;
          updateAddedParentValue(docId, addedDesgloseCol.col, newVal - oldVal);
          return { ...r, cantidadNueva: newVal };
        }
        return { ...r, [field]: value };
      })
    );
  };

  const renderDesgloseTable = (
    col: string,
    rows: DesgloseRow[],
    editId: number | null,
    setEditId: (id: number | null) => void,
    onAdd: () => void,
    onDelete: (row: DesgloseRow) => void,
    onUpdate: (id: number, field: keyof DesgloseRow, value: string | number) => void,
    onClose: () => void,
  ) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-foreground">Desglose: {col}</h3>
        <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-6" onClick={onAdd}>
          Agregar dato
        </Button>
      </div>
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="font-semibold text-foreground">Nombre de dato</TableHead>
              <TableHead className="font-semibold text-foreground">Cantidad nueva</TableHead>
              <TableHead className="font-semibold text-foreground">Cantidad anterior</TableHead>
              <TableHead className="font-semibold text-foreground">Tipo</TableHead>
              <TableHead className="font-semibold text-foreground">Comentario</TableHead>
              <TableHead className="font-semibold text-foreground">Usuario</TableHead>
              <TableHead className="font-semibold text-foreground">Fecha de último cambio</TableHead>
              <TableHead className="font-semibold text-foreground">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const isEditing = editId === row.id;
              return (
                <TableRow key={row.id}>
                  <TableCell>{isEditing ? <input className="border border-input rounded px-2 py-1 text-sm bg-background w-full" value={row.nombre} onChange={(e) => onUpdate(row.id, "nombre", e.target.value)} /> : <span className="text-muted-foreground text-sm">{row.nombre}</span>}</TableCell>
                  <TableCell>{isEditing ? <input type="number" className="border border-input rounded px-2 py-1 text-sm bg-background w-24" value={row.cantidadNueva} onChange={(e) => onUpdate(row.id, "cantidadNueva", parseInt(e.target.value) || 0)} /> : <span className="text-foreground text-sm">${row.cantidadNueva.toLocaleString()}</span>}</TableCell>
                  <TableCell className="text-foreground text-sm">${row.cantidadAnterior.toLocaleString()}</TableCell>
                  <TableCell>{isEditing ? <select className="border border-input rounded px-2 py-1 text-sm bg-background" value={row.tipo} onChange={(e) => onUpdate(row.id, "tipo", e.target.value)}><option value="fijo">Fijo</option><option value="operativo">Operativo</option><option value="extraordinario">Extraordinario</option></select> : <span className="text-foreground text-sm capitalize">{row.tipo}</span>}</TableCell>
                  <TableCell>{isEditing ? <input className="border border-input rounded px-2 py-1 text-sm bg-background w-full" value={row.comentario} onChange={(e) => onUpdate(row.id, "comentario", e.target.value)} /> : <span className="text-muted-foreground text-sm">{row.comentario.slice(0, 25)}...</span>}</TableCell>
                  <TableCell className="text-foreground text-sm">{row.usuario}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{row.fecha}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded hover:bg-accent text-orange-500" title={isEditing ? "Guardar" : "Editar"} onClick={() => setEditId(isEditing ? null : row.id)}><Pencil className="w-5 h-5" /></button>
                      <button className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Borrar" onClick={() => onDelete(row)}><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <Button variant="outline" className="rounded-full border-destructive text-destructive hover:bg-destructive/10 px-6" onClick={onClose}>Cancelar</Button>
        <Button className="rounded-full bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground px-6" onClick={onClose}>Guardar</Button>
      </div>
    </div>
  );

  const renderFinanceTable = (
    values: string[],
    onCellClick: (col: string) => void,
    activeCol: string | null,
  ) => (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary">
            {financeColumns.map((col) => (
              <TableHead key={col} className="font-semibold text-foreground text-xs whitespace-nowrap">{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {values.map((cell, j) => {
              const col = financeColumns[j];
              const isPct = isPercentColumn(col);
              const displayVal = isPct ? cell : `$${parseInt(cell.replace(/[%$,]/g, "") || "0").toLocaleString()}`;
              return (
                <TableCell key={j} className={cn("text-sm text-foreground", !isPct && "cursor-pointer hover:bg-secondary/50", activeCol === col && "bg-secondary/50 font-semibold")} onClick={() => { if (!isPct) onCellClick(col); }}>
                  {displayVal}
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex-1 p-8 overflow-auto">
      <button
        onClick={() => onBack(addedDocs.length)}
        className="flex items-center gap-2 text-primary hover:underline mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Regresar
      </button>

      <h1 className="text-3xl font-bold text-foreground mb-1" style={{ fontFamily: '"Myanmar MN", sans-serif' }}>
        {doc.cadena} - {doc.localizacion}
      </h1>
      <p className="text-muted-foreground mb-6">
        Archivo financiero: {doc.mes} {doc.año}
      </p>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-5 mb-8 shadow-md">
        <div className="flex flex-wrap items-start gap-6 mb-4">
          <div className="min-w-[180px]">
            <div className="flex items-center gap-1 mb-2 text-sm font-semibold text-foreground">Cadena <Filter className="w-3.5 h-3.5" /></div>
            <Select value={fCadena} onValueChange={(v) => { setFCadena(v); setFilterError(false); setDuplicateMsg(""); }}>
              <SelectTrigger className={cn("w-full", filterError && "border-red-500")}><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas</SelectItem>
                {cadenas.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[180px]">
            <div className="flex items-center gap-1 mb-2 text-sm font-semibold text-foreground">Localización <Filter className="w-3.5 h-3.5" /></div>
            <Select value={fLoc} onValueChange={(v) => { setFLoc(v); setFilterError(false); setDuplicateMsg(""); }}>
              <SelectTrigger className={cn("w-full", filterError && "border-red-500")}><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas</SelectItem>
                {localizaciones.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[180px] relative" ref={mesRef}>
            <div className="flex items-center gap-1 mb-2 text-sm font-semibold text-foreground">Mes <Filter className="w-3.5 h-3.5" /></div>
            <button className={cn("flex items-center justify-between w-full rounded-md border bg-background px-3 py-2 text-sm", filterError ? "border-red-500" : "border-input")} onClick={() => setMesDropOpen(!mesDropOpen)}>
              <span className="truncate">{fMeses.length ? fMeses.join(", ") : "Selecciona"}</span><ChevronDown className="w-4 h-4 opacity-50" />
            </button>
            {mesDropOpen && (
              <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md p-2 max-h-52 overflow-auto">
                {meses.map((m) => (
                  <label key={m} className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded cursor-pointer text-sm">
                    <Checkbox checked={fMeses.includes(m)} onCheckedChange={() => { toggleMes(m); setFilterError(false); setDuplicateMsg(""); }} />{m}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="min-w-[140px] relative" ref={añoRef}>
            <div className="flex items-center gap-1 mb-2 text-sm font-semibold text-foreground">Año <Filter className="w-3.5 h-3.5" /></div>
            <button className={cn("flex items-center justify-between w-full rounded-md border bg-background px-3 py-2 text-sm", filterError ? "border-red-500" : "border-input")} onClick={() => setAñoDropOpen(!añoDropOpen)}>
              <span className="truncate">{fAños.length ? fAños.join(", ") : "Selecciona"}</span><ChevronDown className="w-4 h-4 opacity-50" />
            </button>
            {añoDropOpen && (
              <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md p-2">
                {años.map((a) => (
                  <label key={a} className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded cursor-pointer text-sm">
                    <Checkbox checked={fAños.includes(a)} onCheckedChange={() => { toggleAño(a); setFilterError(false); setDuplicateMsg(""); }} />{a}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-end min-w-[140px]">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 mt-6" onClick={handleSearch}>
              Agregar
            </Button>
          </div>
        </div>
        {duplicateMsg && (
          <p className="text-red-500 text-sm font-medium mt-2">{duplicateMsg}</p>
        )}
      </div>

      {/* Main doc table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-bold text-foreground">{doc.mes} {doc.año}</h3>
          <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6" onClick={() => setShowPdfDialog(true)}>
            Exportar a PDF
          </Button>
        </div>
        <p className="text-sm text-foreground">Fecha de última actualización: {doc.fecha}</p>
        <p className="text-sm text-foreground">Editado por: {doc.usuario}</p>
        <p className="text-sm text-foreground mb-4 flex items-center gap-1">
          Estatus: Copia aislada <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
        </p>

        <Dialog open={showPdfDialog} onOpenChange={setShowPdfDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Exportar a PDF</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Se exportará el archivo financiero de <strong>{doc.cadena} - {doc.localizacion}</strong> correspondiente a <strong>{doc.mes} {doc.año}</strong>.</p>
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"><span className="text-orange-500 font-bold text-xs">PDF</span></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Financiero_{doc.cadena.replace(/\s/g, "_")}_{doc.mes}_{doc.año}.pdf</p>
                  <p className="text-xs text-muted-foreground">Listo para descargar</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPdfDialog(false)}>Cancelar</Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowPdfDialog(false)}>Descargar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {renderFinanceTable(tableValues, handleOpenDesglose, desgloseCol)}
      </div>

      {desgloseCol && renderDesgloseTable(
        desgloseCol, desgloseRows, editingRowId, setEditingRowId,
        addRow, deleteRow, updateRow, () => setDesgloseCol(null)
      )}

      {/* Added doc tables */}
      {addedDocs.map((ad) => {
        const vals = addedTableValues[ad.id] || [...mockRows[0]];
        const isActiveDesglose = addedDesgloseCol?.docId === ad.id;
        return (
          <div key={ad.id}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-foreground">{ad.cadena} - {ad.localizacion} · {ad.mes} {ad.año}</h3>
              </div>
              <p className="text-sm text-foreground">Fecha de última actualización: {ad.fecha}</p>
              <p className="text-sm text-foreground">Editado por: {ad.usuario}</p>
              <p className="text-sm text-foreground mb-4 flex items-center gap-1">
                Estatus: Copia aislada <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              </p>
              {renderFinanceTable(vals, (col) => handleOpenAddedDesglose(ad.id, col, ad), isActiveDesglose ? addedDesgloseCol!.col : null)}
            </div>
            {isActiveDesglose && renderDesgloseTable(
              addedDesgloseCol!.col, addedDesgloseRows, addedEditingRowId, setAddedEditingRowId,
              () => addAddedRow(ad.id, ad),
              (row) => deleteAddedRow(row, ad.id),
              (id, field, value) => updateAddedRow(id, field, value, ad.id),
              () => setAddedDesgloseCol(null)
            )}
          </div>
        );
      })}
    </div>
  );
};


let nextId = 100;

const FinanceDupPage = () => {
  const [cadenaFilter, setCadenaFilter] = useState<string>("");
  const [locFilter, setLocFilter] = useState<string>("");
  const [selectedMeses, setSelectedMeses] = useState<string[]>([]);
  const [selectedAños, setSelectedAños] = useState<string[]>([]);
  const [mode, setMode] = useState<"existente" | "nuevo">("existente");
  const [expandedCambios, setExpandedCambios] = useState<number | null>(null);
  const [expandedComentario, setExpandedComentario] = useState<number | null>(null);
  const [existenteDocs, setExistenteDocs] = useState<DocRow[]>([...baseMockDocs]);
  const [nuevosArchivos, setNuevosArchivos] = useState<DocRow[]>([]);
  const [viewingDoc, setViewingDoc] = useState<DocRow | null>(null);
  const [mainDuplicateMsg, setMainDuplicateMsg] = useState<string>("");
  const [mainFilterError, setMainFilterError] = useState(false);

  const getFilteredDocs = (docs: DocRow[]) =>
    docs.filter((doc) => {
      if (cadenaFilter && cadenaFilter !== "__all__" && doc.cadena !== cadenaFilter) return false;
      if (locFilter && locFilter !== "__all__" && doc.localizacion !== locFilter) return false;
      if (selectedMeses.length > 0 && !selectedMeses.includes(doc.mes)) return false;
      if (selectedAños.length > 0 && !selectedAños.includes(doc.año)) return false;
      return true;
    });
  const filteredExistente = getFilteredDocs(existenteDocs);
  const filteredNuevos = getFilteredDocs(nuevosArchivos);

  const displayExistente = mode === "existente" ? filteredExistente : existenteDocs;
  const displayNuevos = nuevosArchivos;

  const handleModeChange = (newMode: "existente" | "nuevo") => {
    setMode(newMode);
    if (newMode === "nuevo") {
      const filtered = getFilteredDocs(existenteDocs);
      setNuevosArchivos((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newOnes = filtered.filter((d) => !existingIds.has(d.id));
        return [...prev, ...newOnes];
      });
    }
  };

  const handleAgregarBuscar = () => {
    setMainDuplicateMsg("");
    setMainFilterError(false);
    if (mode === "nuevo") {
      const filtered = getFilteredDocs(existenteDocs);
      const existingIds = new Set(nuevosArchivos.map((r) => r.id));
      const newOnes = filtered.filter((d) => !existingIds.has(d.id));
      if (newOnes.length === 0 && filtered.length > 0) {
        setMainDuplicateMsg("Esta tabla ya ha sido seleccionada");
        setMainFilterError(true);
        return;
      }
      setNuevosArchivos((prev) => [...prev, ...newOnes]);
    }
    // For "existente" mode the table auto-filters
  };

  const removeDoc = (id: number, table: "existente" | "nuevo") => {
    if (table === "existente") {
      setExistenteDocs((prev) => prev.filter((r) => r.id !== id));
    } else {
      setNuevosArchivos((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const duplicateDoc = (doc: DocRow, table: "existente" | "nuevo") => {
    const setter = table === "existente" ? setExistenteDocs : setNuevosArchivos;
    setter((prev) => {
      // Count existing copies of this base doc
      const baseName = `${doc.cadena} - ${doc.localizacion}`;
      const copyCount = prev.filter(
        (d) => d.cadena === doc.cadena && d.localizacion === doc.localizacion && d.mes === doc.mes && d.año === doc.año && d.copyLabel
      ).length;
      const newDoc: DocRow = {
        ...doc,
        id: nextId++,
        copyLabel: `Copy ${copyCount + 1}`,
      };
      const idx = prev.findIndex((d) => d.id === doc.id);
      const result = [...prev];
      result.splice(idx + 1, 0, newDoc);
      return result;
    });
  };

  // If viewing a file detail, show that instead
  if (viewingDoc) {
    return (
      <FileDetailView
        doc={viewingDoc}
        allDocs={existenteDocs}
        onBack={(addedCount: number) => {
          if (addedCount > 0) {
            setExistenteDocs((prev) =>
              prev.map((d) =>
                d.id === viewingDoc.id
                  ? { ...d, copyLabel: d.copyLabel ? `${d.copyLabel} y otros ${addedCount} archivos` : `y otros ${addedCount} archivos` }
                  : d
              )
            );
          }
          setViewingDoc(null);
        }}
      />
    );
  }

  return (
    <div className="flex-1 p-8 overflow-auto">
      <h1
        className="text-3xl font-bold text-foreground mb-1"
        style={{ fontFamily: '"Myanmar MN", sans-serif' }}
      >
        Mostrando archivos duplicados
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
            <Select value={cadenaFilter} onValueChange={(v) => { setCadenaFilter(v); setMainFilterError(false); setMainDuplicateMsg(""); }}>
              <SelectTrigger className={cn("w-full", mainFilterError && "border-red-500")}>
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

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary mb-2">Mostrar tipo de archivo</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={mode === "existente"}
                  onCheckedChange={() => handleModeChange("existente")}
                />
                Existente
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={mode === "nuevo"}
                  onCheckedChange={() => handleModeChange("nuevo")}
                />
                Nuevo
              </label>
            </div>
          </div>
          <Button
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6"
            onClick={handleAgregarBuscar}
          >
            Agregar
          </Button>
        </div>
      </div>

      {/* Existing documents table - always shown */}
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
            {displayExistente.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="text-foreground">
                  <div className="font-semibold">{doc.cadena} - {doc.localizacion}</div>
                  <div className="text-muted-foreground text-xs">{doc.mes} {doc.año}</div>
                  {doc.copyLabel && <span className="text-muted-foreground text-xs">({doc.copyLabel})</span>}
                </TableCell>
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
                  <Button
                    className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 text-sm"
                    onClick={() => setViewingDoc(doc)}
                  >
                    Ver archivo
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 rounded hover:bg-accent text-primary"
                      title="Crear copia"
                      onClick={() => duplicateDoc(doc, "existente")}
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                      title="Borrar"
                      onClick={() => removeDoc(doc.id, "existente")}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {displayExistente.length === 0 && (
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
        const doc = displayExistente.find((d) => d.id === expandedCambios);
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

      {/* Nuevos archivos table - always shown */}
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
            {displayNuevos.map((doc) => (
              <TableRow key={`nuevo-${doc.id}`}>
                <TableCell className="text-foreground">
                  <div className="font-semibold">{doc.cadena} - {doc.localizacion}</div>
                  <div className="text-muted-foreground text-xs">{doc.mes} {doc.año}</div>
                  {doc.copyLabel && <span className="text-muted-foreground text-xs">({doc.copyLabel})</span>}
                </TableCell>
                <TableCell className="text-foreground">{doc.fecha}</TableCell>
                <TableCell>
                  <Button
                    className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 text-sm"
                    onClick={() => setViewingDoc(doc)}
                  >
                    Ver archivo
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 rounded hover:bg-accent text-primary"
                      title="Crear copia"
                      onClick={() => duplicateDoc(doc, "nuevo")}
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                      title="Borrar"
                      onClick={() => removeDoc(doc.id, "nuevo")}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {displayNuevos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No hay archivos nuevos. Selecciona "Nuevo" y haz clic en "Agregar o buscar" para añadir.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FinanceDupPage;
