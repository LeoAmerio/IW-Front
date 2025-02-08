"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IconSend } from "@tabler/icons-react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/services/auth.service";

interface Mensaje {
  id: number;
  contenido: string;
  fecha_envio_legible: string;
  remitente: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

export default function ConversacionPage() {
  const params = useParams();
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useAuthStore((state) => state.user_id);
console.log('userId ', userId);
  // const enviarMensaje = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (mensaje.trim()) {
  //     setMensajes([...mensajes, { texto: mensaje, enviado: true }])
  //     setMensaje("")
  //   }
  // }
  // const conversacionId = Number(params.id)

  const conversacionId =
    typeof params.id === "string"
      ? parseInt(params.id)
      : Array.isArray(params.id)
      ? parseInt(params.id[0])
      : 0;
  console.log(conversacionId);

  const cargarMensajes = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/mensajeria/conversaciones/${conversacionId}/mensajes/`,
        {
          headers: {
            Authorization: `Token ${Cookies.get("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Error al cargar mensajes");
      const data = await response.json();
      console.log('mensajes ', data);
      setMensajes(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    cargarMensajes();
    // Aquí podrías implementar un polling o websockets para actualizar mensajes
  }, [params.conversacionId]);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/mensajeria/conversaciones/${params.id}/enviar_mensaje/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            contenido: mensaje,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al enviar mensaje");

      const nuevoMensaje = await response.json();
      setMensajes((prevMensajes) => [...prevMensajes, nuevoMensaje]);
      setMensaje("");
    } catch (error) {
      console.error("Error:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto p-4">
        {mensajes.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${
              msg.remitente.id === userId ? "text-right" : "text-left"
              // msg.remitente.id === usuarioActualId ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block max-w-[70%] ${
                // msg.remitente.id === usuarioActualId
                msg.remitente.id === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              } p-3 rounded-lg`}
            >
              <p>{msg.contenido}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {msg.fecha_envio_legible}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={enviarMensaje} className="p-4 bg-white border-t">
        <div className="flex">
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe un mensaje..."
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
    </div>
    // <div className="flex flex-col h-full">
    //   <div className="flex-grow overflow-auto p-4">
    //     {mensajes.map((msg, index) => (
    //       <div key={index} className={`mb-2 ${msg.enviado ? "text-right" : "text-left"}`}>
    //         <span className={`inline-block p-2 rounded-lg ${msg.enviado ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
    //           {msg.texto}
    //         </span>
    //       </div>
    //     ))}
    //   </div>
    //   <form onSubmit={enviarMensaje} className="p-4 bg-white border-t">
    //     <div className="flex">
    //       <input
    //         type="text"
    //         value={mensaje}
    //         onChange={(e) => setMensaje(e.target.value)}
    //         placeholder="Escribe un mensaje..."
    //         className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       />
    //       <button
    //         type="submit"
    //         className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
    //       >
    //         <IconSend size={20} />
    //       </button>
    //     </div>
    //   </form>
    // </div>
  );
}
