import { useState, useRef, useEffect } from "react";
import { Filter, ArrowRight, ChevronDown, Loader2 } from "lucide-react";
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
import { useCadenas, useSucursales, useFinanzas, useDesgloses, usePublicarFinanza } from "@/hooks/useApiData";
import { finanzasService } from "@/services/finanzas.service";
import type { Sucursal, RegistroFinanciero, DesgloseLinea } from "@/types/api.types";

const mesesList = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const añosList = ["2024", "2025", "2026"];
const mesNameToNum: Record<string, number> = {
  Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
  Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12,
};
const mesNumToName = Object.fromEntries(Object.entries(mesNameToNum).map(([k, v]) => [v, k]));

const financeColumns = [
  "Ventas brutas", "Inventario inicial", "Compra", "Inventario final",
  "% Comp/Venta", "Dev Desc a VTA", "Venta Neta", "Costo venta",
  "% Costo", "Utilidad bruta", "% utilidad",
];

const colToCategoria: Record<string, string> = {
  "Ventas brutas": "ventas_brutas",
  "Inventario inicial": "inventario_inicial",
  "Compra": "compra",
  "Inventario final": "inventario_final",
  "Dev Desc a VTA": "dev_desc_vta",
  "Venta Neta": "venta_neta",
  "Costo venta": "costo_venta",
  "Utilidad bruta": "utilidad_bruta",
};

const isPercentColumn = (col: string) => col.startsWith("%") || col.includes("% ");

const registroToRow = (r: RegistroFinanciero): string[] => [
  String(r.ventas_brutas), String(r.inventario_inicial), String(r.compra), String(r.inventario_final),
  `${r.pct_comp_venta.toFixed(1)}%`, String(r.dev_desc_vta), String(r.venta_neta), String(r.costo_venta),
  `${r.pct_costo.toFixed(1)}%`, String(r.utilidad_bruta), `${r.pct_utilidad.toFixed(1)}%`,
];

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

interface BranchCard {
  id: string;
  cadena: string;
  localizacion: string;
  estatus: string;
}

const FinancePage = () => {
  const [cadenaFilter, setCadenaFilter] = useState<string>("");
  const [locFilter, setLocFilter] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<BranchCard | null>(null);
  const [selectedMeses, setSelectedMeses] = useState<string[]>([]);
  const [selectedAños, setSelectedAños] = useState<string[]>([]);
  const [desgloseCol, setDesgloseCol] = useState<string | null>(null);
  const [desgloseRegistroId, setDesgloseRegistroId] = useState<string | null>(null);
  const [showPdfDialog, setShowPdfDialog] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const { data: sucursalesData } = useSucursales({ is_active: true });
  const sucursales: Sucursal[] = Array.isArray(sucursalesData) ? sucursalesData : [];

  const branches: BranchCard[] = sucursales.map((s) => ({
    id: s.id,
    cadena: s.cadena_name,
    localizacion: s.localizacion,
    estatus: s.is_active ? "Activo" : "Inactivo",
  }));

  const cadenas = [...new Set(branches.map((b) => b.cadena))];
  const localizaciones = [...new Set(branches.map((b) => b.localizacion))];

  const filtered = branches.filter((b) => {
    if (cadenaFilter && cadenaFilter !== "__all__" && b.cadena !== cadenaFilter) return false;
    if (locFilter && locFilter !== "__all__" && b.localizacion !== locFilter) return false;
    return true;
  });

  // Fetch financial records for selected branch
  const { data: finanzasData, isLoading: finanzasLoading } = useFinanzas(
    selectedBranch ? { sucursal_id: selectedBranch.id } : undefined
  );
  const registros: RegistroFinanciero[] = Array.isArray(finanzasData) ? finanzasData : [];

  // Fetch desgloses for the active breakdown
  const desgloseCategoria = desgloseCol ? colToCategoria[desgloseCol] : undefined;
  const { data: desglosesData } = useDesgloses(
    desgloseRegistroId ? { registro_financiero_id: desgloseRegistroId, categoria: desgloseCategoria } : undefined
  );
  const desgloseLines: DesgloseLinea[] = Array.isArray(desglosesData) ? desglosesData : [];

  const publicarMutation = usePublicarFinanza();

  const handlePublish = () => {
    if (publishingId) {
      publicarMutation.mutate(publishingId, {
        onSuccess: () => setShowPublishConfirm(false),
      });
    }
  };

  const handleExportPdf = async (registroId: string) => {
    try {
      const blob = await finanzasService.exportPdf(registroId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financiero_${registroId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      setShowPdfDialog(false);
    } catch {
      setShowPdfDialog(false);
    }
  };

  // Build combos from selected months/years
  const sortedAños = [...selectedAños].sort((a, b) => Number(b) - Number(a));
  const orderedMeses = [...selectedMeses].sort(
    (a, b) => mesesList.indexOf(a) - mesesList.indexOf(b)
  );
  const combos: { mes: string; año: string }[] = [];
  for (const año of sortedAños) {
    for (const mes of orderedMeses) {
      combos.push({ mes, año });
    }
  }

  // Find matching registro for a given mes/año
  const findRegistro = (mes: string, año: string): RegistroFinanciero | undefined => {
    const mesNum = mesNameToNum[mes];
    const añoNum = parseInt(año);
    return registros.find((r) => r.mes === mesNum && r.año === añoNum);
  };

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
            {selectedBranch.cadena}: {selectedBranch.localizacion}
          </h2>

          <div className="flex items-end gap-4 mb-6">
            <MultiCheckDropdown
              label="Meses"
              labelClass="text-primary"
              options={mesesList}
              selected={selectedMeses}
              onChange={setSelectedMeses}
            />
            <MultiCheckDropdown
              label="Años"
              labelClass="text-foreground"
              options={añosList}
              selected={selectedAños}
              onChange={setSelectedAños}
            />
            <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-6" onClick={() => setShowPdfDialog(true)}>
              Exportar a pdf
            </Button>
          </div>

          {finanzasLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {combos.length === 0 && !finanzasLoading && (
            <p className="text-muted-foreground text-sm italic">
              Selecciona al menos un mes y un año para ver los datos.
            </p>
          )}

          {combos.map(({ mes, año }) => {
            const registro = findRegistro(mes, año);
            if (!registro) {
              return (
                <div key={`${mes}-${año}`} className="mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-1">{mes} {año}</h3>
                  <p className="text-sm text-muted-foreground italic">No hay registro financiero para este periodo.</p>
                </div>
              );
            }
            const row = registroToRow(registro);
            return (
              <div key={`${mes}-${año}`} className="mb-8">
                <h3 className="text-xl font-bold text-foreground mb-1">{mes} {año}</h3>
                <p className="text-sm text-foreground">Fecha de última actualización: {registro.fecha_ultima_edicion ?? "—"}</p>
                <p className="text-sm text-foreground">Editado por: {registro.editado_por_nombre ?? "—"}</p>
                <p className="text-sm text-foreground mb-4 flex items-center gap-1">
                  Estatus: {registro.estatus === "publicado" ? "Publicado" : "Borrador"}
                  <span className={cn("w-2.5 h-2.5 rounded-full inline-block", registro.estatus === "publicado" ? "bg-primary" : "bg-yellow-500")} />
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
                      <TableRow>
                        {row.map((cell, j) => {
                          const col = financeColumns[j];
                          const isPct = isPercentColumn(col);
                          const displayVal = isPct ? cell : `$${parseInt(cell.replace(/[%]/g, "") || "0").toLocaleString()}`;
                          return (
                            <TableCell
                              key={j}
                              className={cn(
                                "text-sm text-foreground",
                                !isPct && "cursor-pointer hover:bg-secondary/50"
                              )}
                              onClick={() => {
                                if (!isPct) {
                                  setDesgloseCol(col);
                                  setDesgloseRegistroId(registro.id);
                                }
                              }}
                            >
                              {displayVal}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8"
                    onClick={() => { setPublishingId(registro.id); setShowPublishConfirm(true); }}
                    disabled={registro.estatus === "publicado"}
                  >
                    {registro.estatus === "publicado" ? "Publicado" : "Publicar"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Desglose Dialog */}
      <Dialog open={!!desgloseCol} onOpenChange={(open) => { if (!open) { setDesgloseCol(null); setDesgloseRegistroId(null); } }}>
        <DialogContent className="max-w-3xl [&>button]:hidden p-0 border-none bg-transparent shadow-none">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setDesgloseCol(null); setDesgloseRegistroId(null); }} />
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
                  {desgloseLines.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                        No hay desgloses para esta categoría.
                      </TableCell>
                    </TableRow>
                  )}
                  {desgloseLines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell className="text-muted-foreground">{line.nombre}</TableCell>
                      <TableCell className="text-foreground">${line.cantidad.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground capitalize">{line.tipo}</TableCell>
                      <TableCell className="text-muted-foreground">{line.fecha_generacion ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end mt-4">
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8" onClick={() => { setDesgloseCol(null); setDesgloseRegistroId(null); }}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Export Dialog */}
      <Dialog open={showPdfDialog} onOpenChange={setShowPdfDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Exportar a PDF</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Se exportará el archivo financiero de <strong>{selectedBranch?.cadena} - {selectedBranch?.localizacion}</strong> correspondiente a <strong>{selectedMeses.join(", ")} {selectedAños.join(", ")}</strong>.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPdfDialog(false)}>Cancelar</Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  const firstCombo = combos[0];
                  if (firstCombo) {
                    const reg = findRegistro(firstCombo.mes, firstCombo.año);
                    if (reg) handleExportPdf(reg.id);
                  }
                }}
              >
                Descargar PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation Dialog */}
      <Dialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Confirmar publicación</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              El registro financiero de <strong>{selectedBranch?.cadena} - {selectedBranch?.localizacion}</strong> será publicado. Una vez publicado no podrá ser modificado. ¿Desea continuar?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPublishConfirm(false)}>Cancelar</Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handlePublish}
                disabled={publicarMutation.isPending}
              >
                {publicarMutation.isPending ? "Publicando..." : "Confirmar y publicar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
