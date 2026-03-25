import { useState } from "react";
import { Filter } from "lucide-react";
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

interface DocRow {
  id: number;
  cadena: string;
  fecha: string;
  usuario: string;
  cambios: string;
}

const mockDocs: DocRow[] = [
  { id: 1, cadena: "Corazón de Alcachofa - Andares", fecha: "15/01/2025", usuario: "Jane Doe", cambios: "Número de cambios [200]" },
  { id: 2, cadena: "Kokoro - Andares", fecha: "20/02/2025", usuario: "Jane Doe", cambios: "Número de cambios [200]" },
  { id: 3, cadena: "Oasis - Centro", fecha: "10/03/2025", usuario: "Jane Doe", cambios: "Número de cambios [200]" },
  { id: 4, cadena: "Corazón de Alcachofa - Punto Sao Paulo", fecha: "05/04/2025", usuario: "Jane Doe", cambios: "Número de cambios [200]" },
];

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
    <div className="relative">
      <p className="text-sm font-medium mb-1 text-foreground">{label}</p>
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex items-center justify-between w-48 border border-input rounded-md bg-card px-3 py-2 text-sm"
      >
        <span className="truncate text-muted-foreground">
          {selected.length > 0 ? selected.join(", ") : "Selecciona"}
        </span>
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

const FinanceDupPage = () => {
  const [cadenaFilter, setCadenaFilter] = useState<string>("");
  const [locFilter, setLocFilter] = useState<string>("");
  const [selectedMeses, setSelectedMeses] = useState<string[]>([]);
  const [selectedAños, setSelectedAños] = useState<string[]>([]);
  const [showExistente, setShowExistente] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
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
        <div className="flex items-start gap-8 mb-4">
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
                onCheckedChange={(v) => setShowNuevo(!!v)}
              />
              Nuevo
            </label>
          </div>
        </div>
      </div>

      <h2
        className="text-2xl font-bold text-foreground mb-6"
        style={{ fontFamily: '"Myanmar MN", sans-serif' }}
      >
        Historial de documentos editados
      </h2>

      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="w-10"></TableHead>
              <TableHead className="font-semibold text-foreground">Cadena y sucursal</TableHead>
              <TableHead className="font-semibold text-foreground">Fecha de actualización</TableHead>
              <TableHead className="font-semibold text-foreground">Usuario que actualizó</TableHead>
              <TableHead className="font-semibold text-foreground">Cambios</TableHead>
              <TableHead className="font-semibold text-foreground">Ver archivo ⓘ</TableHead>
              <TableHead className="font-semibold text-foreground">Acciones ⓘ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDocs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(doc.id)}
                    onCheckedChange={() => toggleRow(doc.id)}
                  />
                </TableCell>
                <TableCell className="text-foreground">{doc.cadena}</TableCell>
                <TableCell className="text-foreground">{doc.fecha}</TableCell>
                <TableCell className="text-foreground">{doc.usuario}</TableCell>
                <TableCell className="text-foreground">{doc.cambios}</TableCell>
                <TableCell>
                  <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 text-sm">
                    Ver archivo
                  </Button>
                </TableCell>
                <TableCell>
                  <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 text-sm">
                    Duplicar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FinanceDupPage;
