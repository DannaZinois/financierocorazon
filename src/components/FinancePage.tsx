import { useState } from "react";
import { Filter, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const FinancePage = () => {
  const [cadenaFilter, setCadenaFilter] = useState<string>("");
  const [locFilter, setLocFilter] = useState<string>("");

  const filtered = mockBranches.filter((b) => {
    if (cadenaFilter && b.cadena !== cadenaFilter) return false;
    if (locFilter && b.localizacion !== locFilter) return false;
    return true;
  });

  return (
    <div className="flex-1 p-8">
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
        {filtered.map((branch) => (
          <div
            key={branch.id}
            className="bg-card rounded-lg border border-border p-4 flex flex-col justify-between shadow-sm"
          >
            <div>
              <p className="font-semibold text-foreground text-sm">{branch.cadena}</p>
              <p className="text-muted-foreground text-sm">{branch.localizacion}</p>
              <p className="text-muted-foreground text-sm">Estatus: {branch.estatus}</p>
            </div>
            <button className="flex items-center gap-1 text-sm font-medium text-primary mt-3 hover:underline">
              Ver más detalles <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancePage;
