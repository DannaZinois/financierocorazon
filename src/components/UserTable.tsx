import { useState } from "react";
import { Search, Eye, EyeOff, ChevronLeft, ChevronRight, Info } from "lucide-react";
import BranchesDialog from "@/components/BranchesDialog";
import NewUserDialog from "@/components/NewUserDialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Branch {
  id: number;
  cadena: string;
  nombre: string;
}

interface UserRecord {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  active: boolean;
  branches: Branch[];
  password: string;
}

const defaultBranches: Branch[] = [
  { id: 1, cadena: "Corazón de Alcachofa", nombre: "Andares" },
  { id: 2, cadena: "Corazón de Alcachofa", nombre: "Punto Sao Paulo" },
  { id: 3, cadena: "Corazón de Alcachofa", nombre: "Andares" },
  { id: 4, cadena: "Kokoro", nombre: "Punto Sao Paulo" },
];

const emailDomains = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "empresa.mx"];
const emailNames = ["carlos.lopez", "maria.garcia", "juan.martinez", "ana.hernandez", "pedro.sanchez", "laura.ramirez", "diego.flores", "sofia.torres", "miguel.reyes", "valentina.cruz", "roberto.diaz", "camila.morales", "fernando.ortiz", "gabriela.rivas", "andres.mendoza", "patricia.luna", "ricardo.vargas", "daniela.castro", "alejandro.rojas", "monica.guerrero"];

const mockUsers: UserRecord[] = Array.from({ length: 160 }, (_, i) => ({
  id: i + 1,
  email: `${emailNames[i % emailNames.length]}@${emailDomains[i % emailDomains.length]}`,
  role: ["Admin", "Tesorería", "Socio"][i % 3],
  createdAt: "00/00/0000",
  active: true,
  branches: [...defaultBranches],
  password: "Pass1234!",
}));

const PAGE_SIZE = 10;

const UserTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState(mockUsers);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());
  const [branchDialogUserId, setBranchDialogUserId] = useState<number | null>(null);
  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleUser = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const updatePassword = (id: number, newPassword: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, password: newPassword } : u))
    );
  };

  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold text-foreground mb-1" style={{ fontFamily: '"Myanmar MN", sans-serif' }}>Gestión de usuarios</h1>
      <p className="text-muted-foreground mb-6">
        Consulta tus documentos, actualiza, edita o borra datos.
      </p>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar correo de usuario"
            className="pl-9 w-72 bg-card"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button>+ Nuevo Usuario</Button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="font-semibold text-foreground">Correo</TableHead>
              <TableHead className="font-semibold text-foreground">Rol</TableHead>
              <TableHead className="font-semibold text-foreground">Fecha de creación</TableHead>
              <TableHead className="font-semibold text-foreground">Contraseña</TableHead>
              <TableHead className="font-semibold text-foreground">
                <span className="inline-flex items-center gap-1">
                  Estatus
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Estado del usuario</TooltipContent>
                  </Tooltip>
                </span>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <span className="inline-flex items-center gap-1">
                  Sucursales habilitadas
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Sucursales asignadas</TooltipContent>
                  </Tooltip>
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/40">
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-2">
                    <Input
                      type={visiblePasswords.has(user.id) ? "text" : "password"}
                      value={user.password}
                      onChange={(e) => updatePassword(user.id, e.target.value)}
                      className="h-7 w-32 text-sm"
                    />
                    <button
                      onClick={() => togglePasswordVisibility(user.id)}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {visiblePasswords.has(user.id) ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-orange-500" />
                      )}
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{user.active ? "Activo" : "Inactivo"}</span>
                    <Switch
                      checked={user.active}
                      onCheckedChange={() => toggleUser(user.id)}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setBranchDialogUserId(user.id)}
                    className="text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Ver [{user.branches.length}] sucursales
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Mostrando {PAGE_SIZE} de {filtered.length} registros
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previo
          </Button>
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(p)}
              className="w-9"
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
      <BranchesDialog
        open={branchDialogUserId !== null}
        onClose={() => setBranchDialogUserId(null)}
        branches={branchDialogUserId ? users.find((u) => u.id === branchDialogUserId)?.branches || [] : []}
        onUpdate={(newBranches) => {
          if (branchDialogUserId) {
            setUsers((prev) =>
              prev.map((u) => (u.id === branchDialogUserId ? { ...u, branches: newBranches } : u))
            );
          }
        }}
      />
    </div>
  );
};

export default UserTable;
