import { Edificio, Posteo, PosteoRequest } from '@/interfaces/types';
import { useAuthStore } from '@/store/auth/auth.store';
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

  async getPosts(): Promise<AxiosResponse<Posteo[]>> {
    return this.http().get<Posteo[]>(`/comunicaciones/posteos/`);
  }

  async postPost(posteo: PosteoRequest): Promise<AxiosResponse<PosteoRequest>> {
    return this.http().post<PosteoRequest>(`/comunicaciones/posteos/`, posteo);
  }

  async editPost(posteo: PosteoRequest, id: number): Promise<AxiosResponse<PosteoRequest>> {
    return this.http().put<PosteoRequest>(`/comunicaciones/posteos/${id}/`, posteo);
  }

  // async getFilters(): Promise<AxiosResponse<any>> {

  // }
}

export default new EdificoApi();