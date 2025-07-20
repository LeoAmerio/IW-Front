import { User } from "@/interfaces/user.interface";
import Cookies from "js-cookie";

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