import { User } from "@/interfaces/user.interface";
import { apiClient } from "@/lib/api-client";
import Cookies from "js-cookie";

/** GET /auth/usuarios/:id — usando fetch + cookie manual (patrón existente) */
export const fetchUserById = async (user_id: number): Promise<User> => {
  const response = await fetch(`https://ucse-iw-2024.onrender.com/auth/usuarios/${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${Cookies.get("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el usuario");
  }

  return response.json();
};

/** GET /auth/usuarios/ — lista completa, usa apiClient (interceptor de token automático) */
export const fetchUsuarios = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>("/auth/usuarios/");
  return data;
};

/** DELETE /auth/usuarios/:id/ */
export const deleteUsuario = async (user_id: number): Promise<void> => {
  await apiClient.delete(`/auth/usuarios/${user_id}/`);
};

/** PATCH /auth/usuarios/:id/ — activar usuario */
export const activarUsuario = async (user_id: number): Promise<void> => {
  const response = await fetch(`https://ucse-iw-2024.onrender.com/auth/usuarios/${user_id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${Cookies.get("token")}`,
    },
    body: JSON.stringify({ activo: true }),
  });

  if (!response.ok) {
    throw new Error("Error al activar el usuario");
  }
};

/** POST /auth/usuarios/ */
export const crearUsuario = async (data: any): Promise<User> => {
  const response = await fetch(`https://ucse-iw-2024.onrender.com/auth/usuarios/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${Cookies.get("token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear el usuario");
  }

  return response.json();
};

/** PATCH /auth/usuarios/:id/ — editar */
export const editarUsuario = async (user_id: number, data: any): Promise<User> => {
  const response = await fetch(`https://ucse-iw-2024.onrender.com/auth/usuarios/${user_id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${Cookies.get("token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al editar el usuario");
  }

  return response.json();
};