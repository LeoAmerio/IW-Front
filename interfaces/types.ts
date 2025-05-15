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

export interface PosteoSearch {
  titulo: string;
  text: string;
  descripcion: string;
  edificio: number;
  object: Posteo;
}

export interface EventResponse {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  usuario: number;
  tipo_evento: {
    id: number;
    tipo: string;
  };
}

export interface EventRequest {
  titulo: string;
  descripcion: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  tipo_evento_id: number;
}

export interface MenuAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
  show?: boolean;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol_info: {
    id: number;
    rol: string;
  };
  is_active: boolean;
  is_staff: boolean;
  edificio: Edificio | null;
  piso: string | null;
  numero: string | null;
}

export interface Report {
  id: number
  denunciante: {
    id: number
    email: string
    nombre: string
    apellido: string
    rol_info: {
      id: number
      rol: string
    }
    edificio: {
      id: number
      nombre: string
      direccion: string
      numero: number
      ciudad: string
    }
    piso: number
    numero: string
  }
  tipo: string
  posteo_denunciado: {
    id: number
    titulo: string
    descripcion: string
    usuario: {
      id: number
      nombre: string
      apellido: string
      piso: number
      numero: string
    }
    tipo_posteo: {
      id: number
      tipo: string
    }
    imagen: string
  } | null
  usuario_denunciado: any | null
  evento_denunciado: any | null
  comentario: string
  fecha_creacion: string
  estado: "en_revision" | "aprobada" | "rechazada"
}

export interface ChangeStateResponse {
  message: string;
  denuncia: Report;
}