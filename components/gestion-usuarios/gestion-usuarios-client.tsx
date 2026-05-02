"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Edit, Trash2, Power } from "lucide-react";
import UserDialog from "./user-dialog";
import ConfirmationDialog from "./confirmation-dialog";
import { activarUsuario, fetchUsuarios } from "@/api/user.api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-hot-toast";
import { User } from "@/interfaces/user.interface";
import { useAuthStore } from "@/store/auth/auth.store";

const roles = [
  { id: 1, rol: "Inquilino" },
  { id: 2, rol: "Colaborador" },
  { id: 3, rol: "Administrador" },
];

export default function GestionUsuariosClient() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingActivate, setLoadingActivate] = useState<number | null>(null);

  // Fetch usuarios desde la API
  const { data: users = [], isLoading } = useQuery<User[]>(
    ["usuarios"],
    fetchUsuarios,
    {
      refetchOnWindowFocus: false,
    }
  );

  // Mutación para activar usuario
  const activateMutation = useMutation(
    (userId: number) => activarUsuario(userId),
    {
      onSuccess: (_data, userId) => {
        queryClient.invalidateQueries(["usuarios"]);
        toast.success("Usuario activado correctamente.");
      },
      onError: () => {
        toast.error("Error al activar el usuario.");
      },
      onSettled: () => {
        setLoadingActivate(null);
      },
    }
  );

  // Filtros y búsqueda en cliente
  const filteredUsers = users
    .filter((user) => {
      // Building isolation for Colaborador role
      if (currentUser?.rol_info?.rol === "Colaborador") {
        if (!currentUser.edificio?.id) return false; // no building assigned → show nothing
        return user.edificio?.id === currentUser.edificio.id;
      }
      return true;
    })
    .filter(
      (user) =>
        (selectedRole === "" || selectedRole === "all" || user.rol_info.rol === selectedRole) &&
        (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.apellido.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleActivate = (userId: number) => {
    setLoadingActivate(userId);
    activateMutation.mutate(userId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <main>
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold ml-2">Gestión de Usuarios</h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="Buscar usuario"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background border border-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            />
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.rol}>
                    {role.rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
            onClick={() => {
              setIsDialogOpen(true);
              setIsEditing(false);
              setSelectedUser(null);
            }}
          >
            Agregar Usuario
          </Button>
        </div>
        <div className="overflow-x-auto rounded-lg shadow border border-border bg-background">
          <Table className="min-w-full text-sm text-center">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2 text-center">EMAIL</TableHead>
                <TableHead className="px-4 py-2 text-center">NOMBRE</TableHead>
                <TableHead className="px-4 py-2 text-center">APELLIDO</TableHead>
                <TableHead className="px-4 py-2 text-center">ROL</TableHead>
                <TableHead className="px-4 py-2 text-center">EDIFICIO</TableHead>
                <TableHead className="px-4 py-2 text-center">PISO</TableHead>
                <TableHead className="px-4 py-2 text-center">NUMERO</TableHead>
                <TableHead className="px-4 py-2 text-center">ACTIVO</TableHead>
                <TableHead className="px-4 py-2 text-center">ACCIONES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-muted-foreground">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-border hover:bg-accent transition-colors"
                  >
                    <TableCell className="px-4 py-2 whitespace-nowrap text-center">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap text-center">
                      {user.nombre}
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap text-center">
                      {user.apellido}
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap text-center">
                      {user.rol_info.rol}
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap text-center">
                      {user.edificio
                        ? `${user.edificio.nombre} - ${user.edificio.direccion}`
                        : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap text-center">
                      {user.piso ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap text-center">
                      {user.numero ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-center">
                      {user.is_active ? (
                        <span className="text-green-500 flex justify-center">
                          <CheckCircle size={18} />
                        </span>
                      ) : (
                        <span className="text-red-500">●</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-2 flex gap-2 justify-center items-center text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        title="Editar usuario"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user)}
                        title="Eliminar usuario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {!user.is_active && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Activar usuario"
                          onClick={() => handleActivate(user.id)}
                          className="text-green-500 hover:bg-green-900"
                          disabled={loadingActivate === user.id}
                        >
                          {loadingActivate === user.id ? (
                            <span className="animate-spin">●</span>
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <UserDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedUser(null);
          }}
          isEditing={isEditing}
          user={isEditing ? selectedUser : null}
        />
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      </div>
    </main>
  );
}