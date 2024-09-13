

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol_info: Rol;
  is_active: boolean;
  is_staff: boolean;
}

interface Rol {
  id: number;
  rol: string;
}