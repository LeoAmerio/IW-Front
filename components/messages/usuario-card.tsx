"use client"

import type React from "react"
import { useState } from "react"
import { IconMessage, IconChevronDown } from "@tabler/icons-react"
import { motion } from "framer-motion"

interface Usuario {
  id: number
  email: string
  nombre: string
  apellido: string
  rol_info: {
    id: number
    rol: string
  }
  is_active: boolean
  is_staff: boolean
  edificio: string | null
  piso: string | null
  numero: string | null
}

interface UsuarioCardProps {
  usuario: Usuario
}

export const UsuarioCard: React.FC<UsuarioCardProps> = ({ usuario }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
    >
      <div onClick={() => setIsOpen(!isOpen)} className="p-4 bg-white flex justify-between items-center cursor-pointer">
        <h3 className="text-lg font-semibold">
          {usuario.nombre} {usuario.apellido}
        </h3>
        <IconChevronDown className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>
      <motion.div
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 },
        }}
        transition={{ duration: 0.2 }}
        className="px-4 py-2 bg-gray-50"
      >
        <p>
          <strong>Email:</strong> {usuario.email}
        </p>
        <p>
          <strong>Rol:</strong> {usuario.rol_info.rol}
        </p>
        {usuario.edificio && (
          <p>
            <strong>Edificio:</strong> {usuario.edificio}
          </p>
        )}
        {usuario.piso && (
          <p>
            <strong>Piso:</strong> {usuario.piso}
          </p>
        )}
        {usuario.numero && (
          <p>
            <strong>Número:</strong> {usuario.numero}
          </p>
        )}
        <button
          onClick={() => {
            // Aquí iría la lógica para iniciar una conversación
            console.log(`Iniciar conversación con ${usuario.nombre} ${usuario.apellido}`)
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
        >
          <IconMessage className="mr-2" />
          Iniciar conversación
        </button>
      </motion.div>
    </motion.div>
  )
}

