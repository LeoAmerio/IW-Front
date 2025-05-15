import { ChangeStateResponse, Edificio } from "@/interfaces/types";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

class ChangeStateApi {
  http() {
    const token = Cookies.get("token");
    // console.log('Token: ', token);
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Token ${token}`,
    };

    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
    });
  }

  async changeState({
    reportId,
    newStatus,
  }: {
    reportId: number;
    newStatus: string;
  }): Promise<AxiosResponse<ChangeStateResponse>> {
    return this.http().patch<ChangeStateResponse>(
      `/denuncias/denuncias/${reportId}/cambiar_estado/`, newStatus
    );
  }
}

export default new ChangeStateApi();
