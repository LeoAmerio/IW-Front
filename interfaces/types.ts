
export type Posteo = {
  id: number;
  title: string;
  body: string;
  user: User;
  posteoTypo: PosteoTypo;
  imagen?: string;
  created_at: string;
};

export interface User {
  id: number;
  name: string;
  lastName: string;
  piso: number;
  departamento: string;
}

export interface PosteoTypo {
  id: number;
  typo: string;
}