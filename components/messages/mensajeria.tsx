"use client";

import { UsuarioCard } from "@/components/messages/usuario-card";
import { IconUserOff } from "@tabler/icons-react";
import { useQuery } from "react-query";
import Cookies from 'js-cookie';
import { Usuario } from "@/interfaces/types";

interface Conversacion {
  id: number;
  participantes: Usuario[];
  fecha_creacion_legible: string;
  fecha_utlima_actualizacion_legible: string;
  ultimo_mensaje: {
    id: number;
    remitente: Usuario;
    contenido: string;
    fecha_envio_legible: string;
    leido: boolean;
  };
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

const fetchConversaciones = async (): Promise<Conversacion[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/mensajeria/conversaciones/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${Cookies.get("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al obtener las conversaciones");
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

  const {
    data: conversaciones,
    isLoading: isLoadingConversaciones,
    error: errorConversaciones,
  } = useQuery<Conversacion[]>({
    queryKey: ["conversaciones"],
    queryFn: fetchConversaciones,
  });

  if (isLoading)
    return <div className="text-center py-10">Cargando usuarios...</div>;
  if (error || errorConversaciones)
    return (
      <div className="text-center py-10 text-red-500">
        Error al cargar usuarios
      </div>
    );

  const encontrarConversacionExistente = (usuarioId: number) => {
    return conversaciones?.find(conv => 
      conv.participantes.some(p => p.id === usuarioId)
      // conv.participantes.some(p => p.id === usuarioActualId)
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mensajería Interna</h1>
      {usuarios && usuarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usuarios.map((usuario) => (
            <UsuarioCard key={usuario.id} usuario={usuario} conversacionExistente={encontrarConversacionExistente(usuario.id)} />
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
