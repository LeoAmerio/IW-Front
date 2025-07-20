"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
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
import { activarUsuario } from "@/api/user.api";
import { User } from "@/interfaces";
// import { fetchUsers, createUser, editUser, deleteUser } from "@/api/user.api";

const roles = [
  { id: 1, rol: "Inquilino" },
  { id: 2, rol: "Colaborador" },
  { id: 3, rol: "Administrador" },
];

export default function GestionUsuariosClient() {
  // Estados para la UI
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingActivate, setLoadingActivate] = useState<number | null>(null);

  // TODO: Reemplazar con datos reales de la API
  const [users, setUsers] = useState([
    {
      id: 1,
      email: "correo@ejemplo.com",
      nombre: "Pedro",
      apellido: "Rodriguez",
      rol_info: { id: 1, rol: "Inquilino" },
      is_active: true,
      is_staff: false,
      edificio: { id: 1, nombre: "Torre Lamadrid", direccion: "Belgrano 1150", numero: 1, ciudad: "Ciudad" },
      piso: 1,
      numero: "C",
    },
    {
      id: 2,
      email: "leoame99@gmail.com",
      nombre: "Leonardo",
      apellido: "Amerio",
      rol_info: { id: 2, rol: "Colaborador" },
      is_active: true,
      is_staff: false,
      edificio: { id: 1, nombre: "Torre Lamadrid", direccion: "Belgrano 1150", numero: 1, ciudad: "Ciudad" },
      piso: 1,
      numero: "B",
    },
    {
      id: 3,
      email: "nachorossi121@gmail.com",
      nombre: "Admin",
      apellido: "User",
      rol_info: { id: 3, rol: "Administrador" },
      is_active: true,
      is_staff: true,
      edificio: { id: 1, nombre: "Torre Lamadrid", direccion: "Belgrano 1150", numero: 1, ciudad: "Ciudad" },
      piso: 1,
      numero: "A",
    },
  ]);

  // Filtros y búsqueda
  const filteredUsers = users.filter(
    (user) =>
      (selectedRole === "" || user.rol_info.rol === selectedRole) &&
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

  const handleActivate = async (userId: number) => {
    setLoadingActivate(userId);
    try {
      await activarUsuario(userId);
      setUsers((prev) => prev.map(u => u.id === userId ? { ...u, is_active: true } : u));
    } catch (e) {
      alert("Error al activar usuario");
    } finally {
      setLoadingActivate(null);
    }
  };

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
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.rol}>{role.rol}</SelectItem>
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
                {/* <TableHead className="px-4 py-2 text-center">ES STAFF</TableHead> */}
                <TableHead className="px-4 py-2 text-center">ACTIVO</TableHead>
                <TableHead className="px-4 py-2 text-center">ACCIONES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-b border-border hover:bg-accent transition-colors">
                  <TableCell className="px-4 py-2 whitespace-nowrap text-center">{user.email}</TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap text-center">{user.nombre}</TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap text-center">{user.apellido}</TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap text-center">{user.rol_info.rol}</TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap text-center">{user.edificio.nombre} - {user.edificio.direccion}</TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap text-center">{user.piso}</TableCell>
                  <TableCell className="px-4 py-2 whitespace-nowrap text-center">{user.numero}</TableCell>
                  {/* <TableCell className="px-4 py-2 text-center">
                    {user.is_staff ? (
                      <span className="text-green-500">●</span>
                    ) : (
                      <span className="text-red-500">●</span>
                    )}
                  </TableCell> */}
                  <TableCell className="px-4 py-2 text-center">
                    {user.is_active ? (
                      <span className="text-green-500"><CheckCircle size={18} /></span>
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
              ))}
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