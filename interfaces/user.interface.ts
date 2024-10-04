

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol_info: Rol;
  is_active: boolean;
  is_staff: boolean;
  edificio: Edificio;
  piso: number;
  numero: string;
}

interface Rol {
  id: number;
  rol: string;
}

interface Edificio {
  id: number;
  nombre: string;
  direccion: string;
  numero: number;
  ciudad: string;
}