"use client";

import { UsuarioCard } from "@/components/messages/usuario-card";
import { IconUserOff } from "@tabler/icons-react";
import axios from "axios";
import { useQuery } from "react-query";
import Cookies from 'js-cookie';

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol_info: {
    id: number;
    rol: string;
  };
  is_active: boolean;
  is_staff: boolean;
  edificio: string | null;
  piso: string | null;
  numero: string | null;
}

const fetchUsuariosDisponibles = async (): Promise<Usuario[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/mensajeria/conversaciones/usuarios_disponibles/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${Cookies.get("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al obtener los eventos");
  }
  return response.json();
};

export default function MensajeriaPage() {
  const {
    data: usuarios,
    isLoading,
    error,
  } = useQuery<Usuario[]>({
    queryKey: ["usuariosDisponibles"],
    queryFn: fetchUsuariosDisponibles,
  });
  console.log('usuarios', usuarios); 

  if (isLoading)
    return <div className="text-center py-10">Cargando usuarios...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error al cargar usuarios
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mensajería Interna</h1>
      {usuarios && usuarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usuarios.map((usuario) => (
            <UsuarioCard key={usuario.id} usuario={usuario} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <IconUserOff size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">
            No hay usuarios disponibles
          </h2>
          <p className="text-gray-600">
            Actualmente no hay otros usuarios registrados en el sistema. Cuando
            haya más usuarios registrados, podrás iniciar conversaciones con
            ellos aquí.
          </p>
        </div>
      )}
    </div>
  );
}
