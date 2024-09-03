export interface Posteo {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_creacion_legible: string;
  imagen: string | null;
  tipo_posteo: {
    id: number;
    tipo: string;
  };
  usuario: {
    id: number;
    apellido: string;
    nombre: string;
    piso: number | null;
    depto: string | null;
  };
}

export interface PosteoRequest {
  titulo: string;
  descripcion: string;
  tipo_posteo_id: number;
  imagen: string | null;
}

// export type Posteo = {
//   id: number;
//   title: string;
//   descripcion: string;
//   user: User;
//   posteoTypo: PosteoTypo;
//   imagen: string | null;
//   created_at: string;
// };

export interface User {
  id: number;
  name: string;
  lastName: string;
  piso: number;
  departamento: string;
}

export interface PosteoTypo {
  id: number;
  typo: PosteoTypoEnum;
}

export enum PosteoTypoEnum {
  Reclamo = "Reclamo",
  Consulta = "Consulta",
  Aviso = "Aviso",
}

export interface Edificio {
  id: number;
  nombre: string;
  direccion: string;
  numero: number;
  ciudad: string;
}

export interface SearchParams {
  usuario: string;
  tipo_posteo: number;
  ordering: string;
}