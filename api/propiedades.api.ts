import { Edificio } from '@/interfaces/types';
import axios, { AxiosResponse } from 'axios';

class propiedadesApi {
  http() {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
    })
  }

  async getEdificios(): Promise<AxiosResponse<Edificio>> {
    return this.http().get<Edificio>(`/propiedades/edificios/`);
  }
}

export default new propiedadesApi();