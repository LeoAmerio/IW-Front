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