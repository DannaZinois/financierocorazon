import { useState } from "react";
import { Search, Eye, EyeOff, ChevronLeft, ChevronRight, Info, Loader2 } from "lucide-react";
import BranchesDialog from "@/components/BranchesDialog";
import NewUserDialog from "@/components/NewUserDialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useUsers, useToggleUserActive, useCreateUser, useUpdateUserPassword, useUpdateUserSucursales,
} from "@/hooks/useApiData";

const PAGE_SIZE = 10;

const UserTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [branchDialogUserId, setBranchDialogUserId] = useState<string | null>(null);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [localPasswords, setLocalPasswords] = useState<Record<string, string>>({});

  const { data: paginatedData, isLoading, error } = useUsers({ search, page, size: PAGE_SIZE });
  const toggleMutation = useToggleUserActive();
  const createMutation = useCreateUser();
  const passwordMutation = useUpdateUserPassword();
  const sucursalesMutation = useUpdateUserSucursales();

  const users = paginatedData?.items ?? [];
  const total = paginatedData?.total ?? 0;
  const totalPages = paginatedData?.pages ?? 1;

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handlePasswordChange = (id: string, newPassword: string) => {
    setLocalPasswords((prev) => ({ ...prev, [id]: newPassword }));
  };

  const handlePasswordBlur = (id: string) => {
    const pwd = localPasswords[id];
    if (pwd && pwd.length > 0) {
      passwordMutation.mutate({ id, password: pwd });
    }
  };

  const branchUser = branchDialogUserId ? users.find((u) => u.id === branchDialogUserId) : null;

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
        <Button onClick={() => setNewUserOpen(true)}>+ Nuevo Usuario</Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Cargando usuarios...</span>
        </div>
      )}

      {error && (
        <div className="text-destructive text-sm py-4">
          Error al cargar usuarios. Verifica la conexión con el servidor.
        </div>
      )}

      {!isLoading && !error && (
        <>
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
                        <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>Estado del usuario</TooltipContent>
                      </Tooltip>
                    </span>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    <span className="inline-flex items-center gap-1">
                      Sucursales habilitadas
                      <Tooltip>
                        <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>Sucursales asignadas</TooltipContent>
                      </Tooltip>
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/40">
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.roles.map((r) => r.name).join(", ") || "—"}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString("es-MX")}</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center gap-2">
                        <Input
                          type={visiblePasswords.has(user.id) ? "text" : "password"}
                          value={localPasswords[user.id] ?? "••••••••"}
                          onChange={(e) => handlePasswordChange(user.id, e.target.value)}
                          onBlur={() => handlePasswordBlur(user.id)}
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
                        <span className="text-sm">{user.is_active ? "Activo" : "Inactivo"}</span>
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={() => toggleMutation.mutate(user.id)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => setBranchDialogUserId(user.id)}
                        className="text-sm text-foreground hover:text-primary transition-colors"
                      >
                        Ver [{user.sucursales.length}] sucursales
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {users.length} de {total} registros
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Previo
              </Button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((p) => (
                <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)} className="w-9">
                  {p}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Siguiente <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}

      <BranchesDialog
        open={branchDialogUserId !== null}
        onClose={() => setBranchDialogUserId(null)}
        branches={branchUser?.sucursales.map((s, i) => ({ id: i + 1, cadena: s.cadena_name, nombre: s.name })) ?? []}
        onUpdate={(newBranches) => {
          // Note: this would need to map branch IDs back to sucursal_ids for the API
          if (branchDialogUserId) {
            // Future: sucursalesMutation.mutate(...)
          }
        }}
      />
      <NewUserDialog
        open={newUserOpen}
        onClose={() => setNewUserOpen(false)}
        onAdd={({ name, email, password, role_ids }) => {
          createMutation.mutate({
            name,
            email,
            password,
            role_ids,
          });
        }}
      />
    </div>
  );
};

export default UserTable;
