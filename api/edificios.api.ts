import { Edificio, Posteo, PosteoRequest, SearchParams } from '@/interfaces/types';
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

class EdificoApi {
  http() {
    // const token = useAuthStore.getState().token;
    const token = Cookies.get('token');
    // console.log('Token: ', token);
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`,
    };

    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
      headers: headers,
    })
  }

  async getEdificios(): Promise<AxiosResponse<Edificio>> {
    return this.http().get<Edificio>(`/propiedades/edificios/`);
  }

  async getPosts(params: string = ''): Promise<AxiosResponse<Posteo[]>> {
    return this.http().get<Posteo[]>(`/comunicaciones/posteos/${params ? `?${params}` : ''}`);
  }

  async postPost(posteo: PosteoRequest): Promise<AxiosResponse<PosteoRequest>> {
    return this.http().post<PosteoRequest>(`/comunicaciones/posteos/`, posteo);
  }

  async editPost(posteo: PosteoRequest, id: number): Promise<AxiosResponse<PosteoRequest>> {
    return this.http().put<PosteoRequest>(`/comunicaciones/posteos/${id}/`, posteo);
  }

  async getFilters(filters?: SearchParams): Promise<AxiosResponse<Posteo[]>> {
    const params = new URLSearchParams();

    if(filters) {
      if (filters.tipo_posteo) {
        params.append('tipo_posteo', filters.tipo_posteo.toString());
      }
      if (filters.ordering) {
        params.append('ordering', filters.ordering)
      }
      if (filters.usuario) {
        params.append('usuario', filters.usuario.toString());
      }
    }
    // if(filters) {
    //   Object.entries(filters).forEach(([key, value]) => {
    //     if (value !== undefined && value !== null && value !== '') {
    //       params.append(key, value.toString());
    //     }
    //   });
    // }

    return this.http().get<Posteo[]>(`/comunicaciones/posteos/?${params.toString()}`)
  }
}

export default new EdificoApi();