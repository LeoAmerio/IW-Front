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
  const response = await fetch(`https://ucse-iw-2024.onrender.com/servicios`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${Cookies.get("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el usuario");
  }

  return response.json();
};

export const createProfessional = async (data: ProfessionalFormRequest) => {
  const response = await fetch(`https://ucse-iw-2024.onrender.com/servicios`, {
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
// }

// export default new ServiceApi();
