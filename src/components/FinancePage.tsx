import { useState, useRef, useEffect } from "react";
import { Filter, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface BranchCard {
  id: number;
  cadena: string;
  localizacion: string;
  estatus: string;
}

const mockBranches: BranchCard[] = [
  { id: 1, cadena: "Corazón de Alcachofa", localizacion: "Andares", estatus: "Activo" },
  { id: 2, cadena: "Kokoro", localizacion: "Andares", estatus: "Activo" },
  { id: 3, cadena: "Oasis", localizacion: "Andares", estatus: "Activo" },
  { id: 4, cadena: "Corazón de Alcachofa", localizacion: "Andares", estatus: "Activo" },
  { id: 5, cadena: "Kokoro", localizacion: "Andares", estatus: "Activo" },
  { id: 6, cadena: "Corazón de Alcachofa", localizacion: "Andares", estatus: "Activo" },
  { id: 7, cadena: "Kokoro", localizacion: "Andares", estatus: "Activo" },
  { id: 8, cadena: "Oasis", localizacion: "Andares", estatus: "Activo" },
  { id: 9, cadena: "Corazón de Alcachofa", localizacion: "Andares", estatus: "Activo" },
  { id: 10, cadena: "Kokoro", localizacion: "Andares", estatus: "Activo" },
];

const cadenas = ["Corazón de Alcachofa", "Kokoro", "Oasis"];
const localizaciones = ["Andares", "Punto Sao Paulo", "Centro"];

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const años = ["2024", "2025", "2026"];

const financeColumns = [
  "Ventas brutas", "Inventario inicial", "Compra", "Inventario final",
  "% Comp/Venta", "Dev Desc a VTA", "Venta Neta", "Costo venta",
  "% Costo", "Utilidad bruta", "% utilidad",
];

const isPercentColumn = (col: string) => col.startsWith("%") || col.includes("% ");

const mockRows = [
  ["150000", "32000", "45000", "28000", "30%", "12000", "138000", "89000", "64%", "49000", "35%"],
];

const desgloseData: Record<string, { nombre: string; cantidad: string; tipo: string; fecha: string }[]> = {
  "Ventas brutas": [
    { nombre: "Venta en comedor", cantidad: "$85000", tipo: "fijo", fecha: "" },
    { nombre: "Venta para llevar", cantidad: "$35000", tipo: "operativo", fecha: "" },
    { nombre: "Venta por delivery", cantidad: "$20000", tipo: "operativo", fecha: "" },
    { nombre: "Eventos privados", cantidad: "$10000", tipo: "extraordinario", fecha: "" },
  ],
  "Inventario inicial": [
    { nombre: "Proteínas y carnes", cantidad: "$12000", tipo: "fijo", fecha: "" },
    { nombre: "Frutas y verduras", cantidad: "$8000", tipo: "operativo", fecha: "" },
    { nombre: "Lácteos y huevos", cantidad: "$5000", tipo: "fijo", fecha: "" },
    { nombre: "Bebidas y licores", cantidad: "$7000", tipo: "fijo", fecha: "" },
  ],
  "Compra": [
    { nombre: "Compra de mariscos", cantidad: "$15000", tipo: "operativo", fecha: "" },
    { nombre: "Compra de vegetales", cantidad: "$10000", tipo: "operativo", fecha: "" },
    { nombre: "Insumos de cocina", cantidad: "$8000", tipo: "fijo", fecha: "" },
    { nombre: "Bebidas alcohólicas", cantidad: "$7000", tipo: "operativo", fecha: "" },
    { nombre: "Productos de limpieza", cantidad: "$5000", tipo: "fijo", fecha: "" },
  ],
  "Inventario final": [
    { nombre: "Proteínas restantes", cantidad: "$10000", tipo: "fijo", fecha: "" },
    { nombre: "Verduras en almacén", cantidad: "$6000", tipo: "operativo", fecha: "" },
    { nombre: "Lácteos en cámara fría", cantidad: "$5000", tipo: "fijo", fecha: "" },
    { nombre: "Licores en barra", cantidad: "$7000", tipo: "fijo", fecha: "" },
  ],
  "Dev Desc a VTA": [
    { nombre: "Descuento por temporada", cantidad: "$5000", tipo: "extraordinario", fecha: "" },
    { nombre: "Devolución de platillos", cantidad: "$3000", tipo: "operativo", fecha: "" },
    { nombre: "Cortesías a clientes", cantidad: "$4000", tipo: "extraordinario", fecha: "" },
  ],
  "Venta Neta": [
    { nombre: "Ingreso neto comedor", cantidad: "$78000", tipo: "fijo", fecha: "" },
    { nombre: "Ingreso neto delivery", cantidad: "$32000", tipo: "operativo", fecha: "" },
    { nombre: "Ingreso neto eventos", cantidad: "$28000", tipo: "extraordinario", fecha: "" },
  ],
  "Costo venta": [
    { nombre: "Costo de alimentos", cantidad: "$45000", tipo: "fijo", fecha: "" },
    { nombre: "Costo de bebidas", cantidad: "$18000", tipo: "operativo", fecha: "" },
    { nombre: "Merma y desperdicio", cantidad: "$12000", tipo: "operativo", fecha: "" },
    { nombre: "Empaque para llevar", cantidad: "$8000", tipo: "fijo", fecha: "" },
    { nombre: "Gas y energéticos", cantidad: "$6000", tipo: "fijo", fecha: "" },
  ],
  "Utilidad bruta": [
    { nombre: "Margen de alimentos", cantidad: "$30000", tipo: "fijo", fecha: "" },
    { nombre: "Margen de bebidas", cantidad: "$12000", tipo: "operativo", fecha: "" },
    { nombre: "Margen de eventos", cantidad: "$7000", tipo: "extraordinario", fecha: "" },
  ],
};

const MultiCheckDropdown = ({
  label,
  labelClass,
  options,
  selected,
  onChange,
}: {
  label: string;
  labelClass?: string;
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
    <div ref={ref} className="relative">
      <p className={`text-sm font-medium mb-1 ${labelClass ?? "text-foreground"}`}>{label}</p>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-48 border border-input rounded-md bg-card px-3 py-2 text-sm"
      >
        <span className="truncate text-muted-foreground">
          {selected.length > 0 ? selected.join(", ") : "Selecciona"}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-48 border border-input rounded-md bg-card shadow-lg p-2 max-h-48 overflow-auto space-y-1">
          {options.map((o) => (
            <label key={o} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-secondary rounded px-1 py-0.5">
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

const FinancePage = () => {
  const [cadenaFilter, setCadenaFilter] = useState<string>("");
  const [locFilter, setLocFilter] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<BranchCard | null>(null);
  const [selectedMeses, setSelectedMeses] = useState<string[]>([]);
  const [selectedAños, setSelectedAños] = useState<string[]>([]);
  const [desgloseCol, setDesgloseCol] = useState<string | null>(null);
  const [desglosePeriod, setDesglosePeriod] = useState<{ mes: string; año: string } | null>(null);
  const [showPdfDialog, setShowPdfDialog] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const filtered = mockBranches.filter((b) => {
    if (cadenaFilter && cadenaFilter !== "__all__" && b.cadena !== cadenaFilter) return false;
    if (locFilter && locFilter !== "__all__" && b.localizacion !== locFilter) return false;
    return true;
  });

  return (
    <div className="flex-1 p-8 overflow-auto">
      <h1
        className="text-3xl font-bold text-foreground mb-1"
        style={{ fontFamily: '"Myanmar MN", sans-serif' }}
      >
        Accesos a sucursales disponibles
      </h1>
      <p className="text-muted-foreground mb-8">
        Consulta las bases para las cadenas y sucursales que requieras.
      </p>

      <h2 className="text-xl font-bold text-foreground mb-4">
        Ve todas las sucursales y filtra su contenido
      </h2>

      <div className="bg-card rounded-lg border border-border p-5 mb-8 shadow-md">
        <div className="flex items-start gap-8">
          <div>
            <div className="flex items-center gap-1 mb-2 text-sm font-semibold text-foreground">
              Cadena <Filter className="w-3.5 h-3.5" />
            </div>
            <Select value={cadenaFilter} onValueChange={setCadenaFilter}>
              <SelectTrigger className="w-56">
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
          <div>
            <div className="flex items-center gap-1 mb-2 text-sm font-semibold text-foreground">
              Localización <Filter className="w-3.5 h-3.5" />
            </div>
            <Select value={locFilter} onValueChange={setLocFilter}>
              <SelectTrigger className="w-56">
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
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {filtered.map((branch) => {
          const isSelected = selectedBranch?.id === branch.id;
          return (
            <div
              key={branch.id}
              onClick={() => setSelectedBranch(isSelected ? null : branch)}
              className={cn(
                "rounded-lg border p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-all",
                isSelected
                  ? "bg-sidebar text-sidebar-foreground border-sidebar"
                  : "bg-card border-border"
              )}
            >
              <div>
                <p className={cn("font-semibold text-sm", isSelected ? "text-sidebar-foreground" : "text-foreground")}>{branch.cadena}</p>
                <p className={cn("text-sm", isSelected ? "text-sidebar-foreground/80" : "text-muted-foreground")}>{branch.localizacion}</p>
                <p className={cn("text-sm", isSelected ? "text-sidebar-foreground/80" : "text-muted-foreground")}>Estatus: {branch.estatus}</p>
              </div>
              {isSelected ? (
                <Button size="sm" className="mt-3 bg-primary text-primary-foreground rounded-full text-xs">
                  Publicar versión
                </Button>
              ) : (
                <button className="flex items-center gap-1 text-sm font-medium text-primary mt-3 hover:underline">
                  Ver más detalles <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedBranch && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Nombre de cadena: {selectedBranch.localizacion}
          </h2>

          <div className="flex items-end gap-4 mb-6">
            <MultiCheckDropdown
              label="Meses"
              labelClass="text-primary"
              options={meses}
              selected={selectedMeses}
              onChange={setSelectedMeses}
            />
            <MultiCheckDropdown
              label="Años"
              labelClass="text-foreground"
              options={años}
              selected={selectedAños}
              onChange={setSelectedAños}
            />
            <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-6" onClick={() => setShowPdfDialog(true)}>
              Exportar a pdf
            </Button>
          </div>

          {(() => {
            // Build sorted year-month combos: most recent year first, months in calendar order
            const sortedAños = [...selectedAños].sort((a, b) => Number(b) - Number(a));
            const orderedMeses = selectedMeses.sort(
              (a, b) => meses.indexOf(a) - meses.indexOf(b)
            );
            const combos: { mes: string; año: string }[] = [];
            for (const año of sortedAños) {
              for (const mes of orderedMeses) {
                combos.push({ mes, año });
              }
            }
            // If no selection, show a placeholder
            if (combos.length === 0) {
              return (
                <p className="text-muted-foreground text-sm italic">
                  Selecciona al menos un mes y un año para ver los datos.
                </p>
              );
            }
            return combos.map(({ mes, año }) => (
              <div key={`${mes}-${año}`} className="mb-8">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {mes} {año}
                </h3>
                <p className="text-sm text-foreground">Fecha de última actualización: 00/00/0000</p>
                <p className="text-sm text-foreground">Editado por: Usuario Jane Doe</p>
                <p className="text-sm text-foreground mb-4 flex items-center gap-1">
                  Estatus: Borrador <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />
                </p>

                <div className="bg-card rounded-lg border border-border overflow-hidden shadow-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary">
                        {financeColumns.map((col) => (
                          <TableHead key={col} className="font-semibold text-foreground text-xs whitespace-nowrap">
                            {col}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRows.map((row, i) => (
                        <TableRow key={i}>
                          {row.map((cell, j) => {
                            const col = financeColumns[j];
                            const isPct = isPercentColumn(col);
                            const displayVal = isPct ? cell : `$${cell.replace('%', '')}`;
                            return (
                              <TableCell
                                key={j}
                                className={cn(
                                  "text-sm text-foreground",
                                  !isPct && "cursor-pointer hover:bg-secondary/50"
                                )}
                                onClick={() => { if (!isPct) { setDesgloseCol(col); setDesglosePeriod({ mes, año }); } }}
                              >
                                {displayVal}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end mt-4">
                  <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8">
                    Publicar
                  </Button>
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      <Dialog open={!!desgloseCol} onOpenChange={(open) => { if (!open) { setDesgloseCol(null); setDesglosePeriod(null); } }}>
        <DialogContent className="max-w-3xl [&>button]:hidden p-0 border-none bg-transparent shadow-none">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setDesgloseCol(null); setDesglosePeriod(null); }} />
          <div className="relative bg-card rounded-2xl shadow-xl p-8 z-10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Desglose: {desgloseCol}</DialogTitle>
            </DialogHeader>
            <div className="bg-card rounded-lg border border-border overflow-hidden mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary">
                    <TableHead className="font-semibold text-foreground">Nombre de dato</TableHead>
                    <TableHead className="font-semibold text-foreground">Cantidad del gasto</TableHead>
                    <TableHead className="font-semibold text-foreground">Tipo</TableHead>
                    <TableHead className="font-semibold text-foreground">Fecha de generación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(desgloseCol && desgloseData[desgloseCol] ? desgloseData[desgloseCol] : []).map((row, i) => {
                    const mesIdx = desglosePeriod ? meses.indexOf(desglosePeriod.mes) + 1 : 1;
                    const año = desglosePeriod?.año || "2025";
                    const day = String(Math.min((i + 1) * 5, 28)).padStart(2, "0");
                    const fecha = `${day}/${String(mesIdx).padStart(2, "0")}/${año}`;
                    return (
                      <TableRow key={i}>
                        <TableCell className="text-muted-foreground">{row.nombre}</TableCell>
                        <TableCell className="text-foreground">{row.cantidad}</TableCell>
                        <TableCell className="text-foreground capitalize">{row.tipo}</TableCell>
                        <TableCell className="text-muted-foreground">{fecha}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end mt-4">
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8" onClick={() => { setDesgloseCol(null); setDesglosePeriod(null); }}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPdfDialog} onOpenChange={setShowPdfDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Exportar a PDF</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Se exportará el archivo financiero de <strong>{selectedBranch?.cadena} - {selectedBranch?.localizacion}</strong> correspondiente a <strong>{selectedMeses.join(", ")} {selectedAños.join(", ")}</strong>.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPdfDialog(false)}>Cancelar</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => { setShowPdfDialog(false); setShowPublishConfirm(true); }}>Descargar PDF</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Confirmar publicación</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              El archivo PDF de <strong>{selectedBranch?.cadena} - {selectedBranch?.localizacion}</strong> será publicado y estará disponible para su descarga. ¿Desea continuar?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPublishConfirm(false)}>Cancelar</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowPublishConfirm(false)}>Confirmar y publicar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
