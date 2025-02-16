"use client";

import type React from "react";
import { useState } from "react";
import { IconMessage, IconChevronDown, IconSend } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Usuario } from "@/interfaces/types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface UsuarioCardProps {
  usuario: Usuario;
  conversacionExistente?: {
    id: number;
    ultimo_mensaje: {
      contenido: string;
      fecha_envio_legible: string;
      leido: boolean;
    };
  };
}

export const UsuarioCard: React.FC<UsuarioCardProps> = ({ usuario, conversacionExistente }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mensajeInicial, setMensajeInicial] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const iniciarConversacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensajeInicial.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/mensajeria/conversaciones/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          participante_id: usuario.id,
          mensaje_inicial: mensajeInicial
        }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar la conversación');
      }

      const data = await response.json();
      router.push(`/dashboard/mensajes/conversacion/${data.id}`);
    } catch (error) {
      console.error('Error:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-md dark:bg-gray-700">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Image
            src="/no-image-icon-4.png"
            alt={`${usuario.nombre} ${usuario.apellido}`}
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="text-lg font-semibold">
            {usuario.nombre} {usuario.apellido}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {usuario.edificio ? `${usuario.edificio.nombre}, ` : ""}
            {usuario.piso && usuario.numero
              ? `Piso ${usuario.piso}, Depto ${usuario.numero}`
              : "Sin ubicación especificada"}
          </p>
        </div>
      </div>

      {conversacionExistente ? (
        <Link
          href={`/dashboard/mensajes/conversacion/${conversacionExistente.id}`}
          passHref
        >
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center">
            <IconMessage className="mr-2" size={20} />
            Continuar conversación
          </button>
        </Link>
      ) : (
        <div className="mt-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <IconMessage className="mr-2" size={20} />
            {isOpen ? "Cancelar" : "Iniciar conversación"}
          </button>

          {isOpen && (
            <form onSubmit={iniciarConversacion} className="mt-4">
              <div className="flex">
                <input
                  type="text"
                  value={mensajeInicial}
                  onChange={(e) => setMensajeInicial(e.target.value)}
                  placeholder="Escribe tu primer mensaje..."
                  className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                  disabled={isLoading}
                >
                  <IconSend size={20} />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
    // <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
    //   <div className="flex-shrink-0">
    //     <Image
    //       src="/no-image-icon-4.png"
    //       alt={`${usuario.nombre} ${usuario.apellido}`}
    //       width={60}
    //       height={60}
    //       className="rounded-full"
    //     />
    //   </div>
    //   <div className="ml-4 flex-grow">
    //     <h3 className="text-lg font-semibold">
    //       {usuario.nombre} {usuario.apellido}
    //     </h3>
    //     <p className="text-sm text-gray-600">
    //       {usuario.edificio ? `${usuario.edificio.nombre}, ` : ""}
    //       {usuario.piso && usuario.numero
    //         ? `Piso ${usuario.piso}, Depto ${usuario.numero}`
    //         : "Sin ubicación especificada"}
    //     </p>
    //     <div className="mt-2">
    //       {conversacionExistente ? (
    //         <Link
    //           href={`/dashboard/mensajes/conversacion/${conversacionExistente.id}`}
    //           passHref
    //         >
    //           <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center">
    //             <IconMessage className="mr-2" size={20} />
    //             Nuevo Mensaje
    //           </button>
    //         </Link>

    //       ) : (
    //         <button
    //           onClick={() => setIsOpen(!isOpen)}
    //           className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
    //         >
    //           <IconMessage className="mr-2" size={20} />
    //           Iniciar Conversacion
    //         </button>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};
