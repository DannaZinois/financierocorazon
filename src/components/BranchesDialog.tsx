import { useState } from "react";
import { X, Pencil, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCadenas, useSucursales } from "@/hooks/useApiData";

interface Branch {
  id: number;
  cadena: string;
  nombre: string;
}

interface BranchesDialogProps {
  open: boolean;
  onClose: () => void;
  branches: Branch[];
  onUpdate: (branches: Branch[]) => void;
}

const BranchesDialog = ({ open, onClose, branches, onUpdate }: BranchesDialogProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ cadena: "", nombre: "" });
  const [newCadena, setNewCadena] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const { data: cadenasData } = useCadenas({ is_active: true });
  const cadenasList = Array.isArray(cadenasData) ? cadenasData : [];

  const { data: sucursalesData } = useSucursales({ cadena_id: newCadena || undefined, is_active: true });
  const sucursalesList = Array.isArray(sucursalesData) ? sucursalesData : [];

  if (!open) return null;

  const handleEdit = (branch: Branch) => {
    setEditingId(branch.id);
    setEditValues({ cadena: branch.cadena, nombre: branch.nombre });
  };

  const handleSaveEdit = (id: number) => {
    onUpdate(
      branches.map((b) =>
        b.id === id ? { ...b, cadena: editValues.cadena, nombre: editValues.nombre } : b
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    onUpdate(branches.filter((b) => b.id !== id));
  };

  const handleAddBranch = () => {
    if (!newCadena || !newLocation) return;
    const cadenaName = cadenasList.find((c) => c.id === newCadena)?.name || newCadena;
    const sucursalName = sucursalesList.find((s) => s.id === newLocation)?.localizacion || newLocation;
    const newId = Math.max(0, ...branches.map((b) => b.id)) + 1;
    onUpdate([...branches, { id: newId, cadena: cadenaName, nombre: sucursalName }]);
    setNewCadena("");
    setNewLocation("");
    setShowAddDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Main dialog */}
      <div
        className={`relative z-50 bg-card rounded-2xl shadow-xl border border-border w-full max-w-2xl p-8 transition-opacity ${
          showAddDialog ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-foreground hover:opacity-70">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-foreground text-center">Sucursales disponibles</h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-2 mb-4 rounded-full" />
        <p className="text-muted-foreground text-center mb-6">
          Llena todos sus datos básicos para crear un nuevo registro.
        </p>

        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setShowAddDialog(true)}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            + Agregar sucursal
          </Button>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary">
                <TableHead className="font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1">
                    Cadena a la que pertenence
                    <Filter className="w-3.5 h-3.5 text-primary" />
                  </span>
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1">
                    Nombre de sucursal
                    <Filter className="w-3.5 h-3.5 text-primary" />
                  </span>
                </TableHead>
                <TableHead className="font-semibold text-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    {editingId === branch.id ? (
                      <Input
                        value={editValues.cadena}
                        onChange={(e) => setEditValues((v) => ({ ...v, cadena: e.target.value }))}
                        className="h-8"
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(branch.id)}
                      />
                    ) : (
                      branch.cadena
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === branch.id ? (
                      <Input
                        value={editValues.nombre}
                        onChange={(e) => setEditValues((v) => ({ ...v, nombre: e.target.value }))}
                        className="h-8"
                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(branch.id)}
                      />
                    ) : (
                      branch.nombre
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {editingId === branch.id ? (
                        <Button size="sm" onClick={() => handleSaveEdit(branch.id)}>
                          Guardar
                        </Button>
                      ) : (
                        <button onClick={() => handleEdit(branch)} className="hover:opacity-70 transition-opacity">
                          <Pencil className="w-5 h-5 text-orange-500" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(branch.id)} className="hover:opacity-70 transition-opacity">
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {branches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No hay sucursales asignadas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground px-6"
          >
            Cancelar
          </Button>
          <Button onClick={onClose} className="rounded-full px-6">
            Continuar
          </Button>
        </div>
      </div>

      {/* Add branch dialog */}
      {showAddDialog && (
        <div className="relative z-50 bg-card rounded-2xl shadow-xl border border-border w-full max-w-lg p-8">
          <button
            onClick={() => setShowAddDialog(false)}
            className="absolute top-6 right-6 text-foreground hover:opacity-70"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-foreground text-center">Agregar sucursal</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-2 mb-4 rounded-full" />
          <p className="text-muted-foreground text-center mb-6">
            Concede el acceso a una nueva sucursal para este usuario.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Cadena*</label>
              <Select value={newCadena} onValueChange={setNewCadena}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una cadena" />
                </SelectTrigger>
                <SelectContent>
                  {cadenasList.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Localización*</label>
              <Select value={newLocation} onValueChange={setNewLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {sucursalesList.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name} - {s.localizacion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="rounded-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground px-6"
            >
              Cancelar
            </Button>
            <Button onClick={handleAddBranch} className="rounded-full px-6">
              Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesDialog;
