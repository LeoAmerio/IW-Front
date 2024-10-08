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
  usuario: User;
  respuestas: Answers[];
}

interface Answers {
  id: number;
  usuario: User;
  contenido: string;
  fecha_creacion_legible: string;
}

export interface PosteoRequest {
  titulo: string;
  descripcion: string;
  tipo_posteo_id: number;
  imagen?: string | File | null;
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
  token: string;
  user_id: number;
  email: string;
}

export enum CrudOperation {
  CREATE,
  READ,
  UPDATE,
  DELETE
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  piso: number;
  numero: string;
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

export enum EventoTypoEnum {
  ReunionConsorcio = "Reunion Consorcio",
  Reformas = "Reformas",
  Limpieza = "Limpieza",
  Mantenimiento = "Mantenimiento",
  OcupacionEspaciosComunes = "Ocupacion Espacios Comunes",
}

export interface Edificio {
  id: number;
  nombre: string;
  direccion: string;
  numero: number;
  ciudad: string;
}

export interface SearchParams {
  usuario: number;
  tipo_posteo: string;
  ordering: string;
}

export interface Servicios {
  id: number;
  tipo: {
    id: number;
    tipo: string;
  };
  nombre_proveedor: string;
  telefono: string;
}