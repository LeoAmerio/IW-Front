"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/interfaces";
import { crearUsuario, editarUsuario } from "@/api/user.api";

const roles = [
  { id: 1, rol: "Inquilino" },
  { id: 2, rol: "Colaborador" },
  { id: 3, rol: "Administrador" },
];

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  user: User | null;
}

export default function UserDialog({ isOpen, onClose, isEditing, user }: UserDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      nombre: "",
      apellido: "",
      rol: "",
      edificio: "",
      piso: 0,
      numero: "",
      is_staff: false,
      is_active: true,
    },
  });

  useEffect(() => {
    if (isEditing && user) {
      reset({
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol_info.rol,
        edificio: user.edificio.nombre,
        piso: user.piso,
        numero: user.numero,
        is_staff: user.is_staff,
        is_active: user.is_active,
      });
    } else {
      reset();
    }
  }, [isEditing, user, reset]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
        edificio: data.edificio,
        piso: Number(data.piso),
        numero: data.numero,
        is_staff: data.is_staff,
        is_active: data.is_active,
      };
      if (isEditing && user) {
        await editarUsuario(user.id, payload);
      } else {
        await crearUsuario(payload);
      }
      onClose();
    } catch (e) {
      alert("Error al guardar usuario");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuario" : "Agregar Usuario"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email", { required: true })} disabled={isEditing} />
            {errors.email && <span>Este campo es requerido</span>}
          </div>
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" {...register("nombre", { required: true })} />
            {errors.nombre && <span>Este campo es requerido</span>}
          </div>
          <div>
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              {...register("apellido", { required: true })}
            />
            {errors.apellido && <span>Este campo es requerido</span>}
          </div>
          <div>
            <Label htmlFor="rol">Rol</Label>
            <select
              id="rol"
              {...register("rol", { required: true })}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">Seleccionar rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.rol}>
                  {role.rol}
                </option>
              ))}
            </select>
            {errors.rol && <span>Este campo es requerido</span>}
          </div>
          <div>
            <Label htmlFor="edificio">Edificio</Label>
            <Input
              id="edificio"
              {...register("edificio", { required: true })}
            />
            {errors.edificio && <span>Este campo es requerido</span>}
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <Label htmlFor="piso">Piso</Label>
              <Input id="piso" {...register("piso", { required: true })} />
              {errors.piso && <span>Este campo es requerido</span>}
            </div>
            <div className="w-1/2">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" {...register("numero", { required: true })} />
              {errors.numero && <span>Este campo es requerido</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_staff" {...register("is_staff")} />
            <Label htmlFor="is_staff">Es staff</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" {...register("is_active")} />
            <Label htmlFor="is_active">Activo</Label>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <Button type="submit">{isEditing ? "Actualizar" : "Crear"}</Button>
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
