import { Servicios } from "@/interfaces/types";
import { apiClient } from "@/lib/api-client";
import { ProfessionalFormRequest } from "@/components/servicios-gestion/professional-dialog";

export const fetchServicios = async (): Promise<Servicios[]> => {
  const response = await apiClient.get<Servicios[]>('/servicios');
  return response.data;
};

export const createProfessional = async (data: ProfessionalFormRequest) => {
  const response = await apiClient.post('/servicios', data);
  return response.data;
};

export const editProfessional = async (id: number, data: ProfessionalFormRequest) => {
  const response = await apiClient.put(`/servicios/${id}`, data);
  return response.data;
};

export const deleteProfessional = async (id: number) => {
  await apiClient.delete(`/servicios/${id}`);
};
