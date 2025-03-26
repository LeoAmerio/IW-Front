// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';

// interface AuthState {
//   token: string | null;
//   user_id: number;
//   email: string | null;
//   setAuth: (token: string, userId: number, email: string) => void;
//   clearAuth: () => void;
// }

// export interface LoginResponse {
//   token: string;
//   user_id: number;
//   email: string;
// }
// // export const useAuthStore = create<AuthState>((set) => ({
// //   token: null,
// //   user_id: 0,
// //   email: null,
// //   setAuth: (token, user_id, email) => set({ token, user_id, email }),
// //   clearAuth: () => set({ token: null, user_id: 0, email: null }),
// // }));
// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       token: null,
//       user_id: 0,
//       email: null,
//       setAuth: (token, user_id, email) => {
//         set({ token, user_id, email });
//         return { token, user_id, email };
//       },
//       clearAuth: () => set({ token: null, user_id: 0, email: null })
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => sessionStorage)
//     }
//   )
// )


import Cookies from 'js-cookie';

export interface LoginResponse {
  token: string;
  user_id: number;
  email: string;
}

/** Datos para registrar un usuario */
export interface SignupRequest {
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  rol?: number;        // El rol que mencionas, por ejemplo 3
  edificio?: number;
  piso?: number;
  numero?: string;
}

/** Respuesta del registro */
export interface SignupResponse {
  message: string;
  token?: string;
  user_id?: number;
  email?: string;
}

/** Datos para solicitar un reset de contraseña */
export interface RequestPasswordResetData {
  email: string;
}

/** Datos para realizar el cambio de contraseña tras el token enviado */
export interface ResetPasswordData {
  email: string;
  token: string;
  new_password: string;
}

/** Respuesta genérica de tus endpoints de password reset */
export interface PasswordResetResponse {
  message: string;
}

/**
 * AuthService se encarga de hacer las peticiones al backend
 * para login, logout, etc.
 */
const AuthService = {
  /**
   * Realiza la petición de login al backend.
   * En caso de éxito, setea la cookie con expiración de 8 horas
   * y retorna la data.
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // Extrae el mensaje de error que venga de tu backend, si lo deseas
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en el login');
    }

    const data = (await response.json()) as LoginResponse;

    // Guardamos el token en una cookie, con expiración de 8 horas
    // 1 día = 24 horas => 8/24 = 0.333..., 
    // por lo que expires: 1/3 de día
    Cookies.set('token', data.token, { expires: 1 / 3 });

    return data;
  },

   /**
   * Signup: registra un nuevo usuario con los datos del formulario.
   * Retorna un mensaje y, si tu backend lo implementa, el token y user_id.
   */
   signup: async (signupData: SignupRequest): Promise<SignupResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/registro/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    // Manejo de error
    if (!response.ok) {
      const errorData = await response.json();
      // Por ejemplo, si hay errorData.email o lo que mande el backend
      const message = errorData.email?.[0] || errorData.error || 'Error en el registro';
      throw new Error(message);
    }

    const data: SignupResponse = await response.json();

    // Si tu backend retornase un token tras el registro y quisieras
    // loguear automáticamente al usuario, podrías guardarlo aquí:
    if (data.token) {
      Cookies.set('token', data.token, { expires: 1 / 3 });
    }

    return data;
  },

  /**
   * Solicita un correo con el token para resetear la contraseña.
   */
  requestPasswordReset: async (payload: RequestPasswordResetData): Promise<PasswordResetResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/request-password-reset/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error solicitando reset de contraseña');
    }

    const data: PasswordResetResponse = await response.json();
    return data;
  },

  /**
   * Hace el cambio de contraseña usando el token recibido por correo.
   */
  resetPassword: async (payload: ResetPasswordData): Promise<PasswordResetResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/reset-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error reseteando la contraseña');
    }

    const data: PasswordResetResponse = await response.json();
    return data;
  },

  /**
   * Solo como ejemplo, podrías limpiar la cookie al hacer logout.
   */
  logout: () => {
    Cookies.remove('token');
  },
};

export default AuthService;