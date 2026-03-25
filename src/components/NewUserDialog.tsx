import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (user: { name: string; email: string; password: string; role: string }) => void;
}

const NewUserDialog = ({ open, onClose, onAdd }: NewUserDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!name || !email || !password || !role) return;
    onAdd({ name, email, password, role });
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-xl p-8 w-full max-w-lg z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-foreground hover:text-muted-foreground">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-foreground text-center mb-1">Nuevo usuario</h2>
        <div className="w-16 h-0.5 bg-border mx-auto mb-3" />
        <p className="text-muted-foreground text-center mb-6">
          Llena todos sus datos básicos para crear un nuevo registro.
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Nombre del usuario*</label>
            <Input
              placeholder="Nombre aquí"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Correo de contacto*</label>
            <Input
              placeholder="Correoaqui@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Contraseña*</label>
            <Input
              type="password"
              placeholder="Contraseña aquí"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Tipo de rol*</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Tesorería">Tesorería</SelectItem>
                <SelectItem value="Socio">Socio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          <Button variant="destructive" className="rounded-full px-6" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="rounded-full px-6 bg-primary text-primary-foreground" onClick={handleSubmit}>
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewUserDialog;
