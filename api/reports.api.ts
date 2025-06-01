import { Edificio, Report, PosteoRequest, SearchParams } from '@/interfaces/types';
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

class ReportsApi {
  http() {
    const token = Cookies.get('token');
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`,
    };

    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
      headers: headers,
    })
  }

  async getReports(): Promise<AxiosResponse<Report[]>> {
    return this.http().get<Report[]>(`/denuncias/denuncias/`)
  };

//   async getFilters(filters?: SearchParams): Promise<AxiosResponse<Posteo[]>> {
//     const params = new URLSearchParams();

//     if(filters) {
//       if (filters.tipo_posteo) {
//         params.append('tipo_posteo', filters.tipo_posteo.toString());
//       }
//       if (filters.ordering) {
//         params.append('ordering', filters.ordering)
//       }
//       if (filters.usuario) {
//         params.append('usuario', filters.usuario.toString());
//       }
//     }

//     return this.http().get<Posteo[]>(`/comunicaciones/posteos/?${params.toString()}`)
//   }
}

export default new ReportsApi();