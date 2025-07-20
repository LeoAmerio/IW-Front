import { Servicios } from "@/interfaces/types";
import { User } from "@/interfaces/user.interface";
import Cookies from "js-cookie";
import axios from "axios";
import { ProfessionalFormRequest } from "@/components/servicios-gestion/professional-dialog";

// class ServiceApi {
// http<AxiosInterface>() {
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Token ${Cookies.get("token")}`,
//   }

//   axios.create({
//     baseURL: "https://ucse-iw-2024.onrender.com",
//     headers: headers,
//   })
// }

// async fetchServicios(): Promise<Servicios[]> {
//   return this.http().get<Servicios>(`/servicios`);
export const fetchServicios = async (): Promise<Servicios[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/servicios`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${Cookies.get("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los servicios");
  }

  return response.json();
};

export const createProfessional = async (data: ProfessionalFormRequest) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/servicios/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${Cookies.get("token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear el profesional");
  }

  return response.json();
}

export const editProfessional = async (id: number, data: ProfessionalFormRequest) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/servicios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${Cookies.get("token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al editar el profesional");
  }

  return response.json();
}

export const deleteProfessional = async (id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/servicios/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${Cookies.get("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el profesional");
    }

    if (response.status === 204) {
      return;
    } else {
      throw new Error(`Respuesta inesperada: ${response.status}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al eliminar profesional:', error.response?.status);
    }
    throw error;
  }
}
// }

// export default new ServiceApi();
