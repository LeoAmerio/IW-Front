// import { StateCreator, create } from 'zustand';
// import type { AuthStatus, User } from '../../interfaces';
// import { AuthService, LoginResponse } from '../../services/auth.service';
// import { devtools, persist } from 'zustand/middleware';

// export interface AuthState {

//   status: AuthStatus;
//   token?: string;
//   user?: User;

//   loginUser: (email: string, password: string) => Promise<LoginResponse>;
//   checkAuthStatus: () => Promise<void>;
//   logout: () => void;
// }

// const storeApi: StateCreator<AuthState> = (set) => ({
//   status: 'Pending',
//   token: undefined,
//   user: undefined,

//   loginUser: async (email: string, password: string): Promise<LoginResponse> => {
//     try {
//       const resp = await AuthService.login(email, password);
//       set({ status: 'Authorized', token: resp.token, user: {
//         id: resp.user_id,
//         email: resp.email
//       } })
//       return resp;
//     } catch (error) {
//       set({ status: 'Unauthorized', token: undefined, user: undefined })
//       throw 'Unauthorized'
//     }
//   },
//   checkAuthStatus: async () => {
//     try {
//       const { token, ...user } = await AuthService.checkStatus();
//       set({ status: 'Authorized', token, user: {
//         id: user.user_id,
//         email: user.email
//       } });
//     } catch (error) {
//       set({ status: 'Unauthorized', token: undefined, user: undefined });
//     }
//   },
//   logout: () => {
//     set({ status: 'Unauthorized', token: undefined, user: undefined });
//   },
// });

// export const useAuthStore = create<AuthState>()(
//   devtools(
//     persist(
//       storeApi,
//       { name: 'auth-storage' }
//     )
//     )
//   );

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AuthService, { LoginResponse } from '../../services/auth.service';

interface AuthState {
  token: string | null;
  user_id: number | null;
  email: string | null;
  isAuthenticated: boolean;

  // Métodos
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void; 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user_id: null,
      email: null,
      isAuthenticated: false,

      /**
       * Invoca el servicio de login, si es exitoso,
       * setea los datos en el store y actualiza isAuthenticated.
       */
      login: async (email, password) => {
        try {
          const data: LoginResponse = await AuthService.login(email, password);
          set({
            token: data.token,
            user_id: data.user_id,
            email: data.email,
            isAuthenticated: true,
          });
        } catch (error) {
          // En caso de error, limpia el store
          set({
            token: null,
            user_id: null,
            email: null,
            isAuthenticated: false,
          });
          // Re-lanzamos el error para manejarlo en la UI
          throw error;
        }
      },

      /**
       * Logout: Borra la cookie y limpia el store.
       */
      logout: () => {
        AuthService.logout();
        set({
          token: null,
          user_id: null,
          email: null,
          isAuthenticated: false,
        });
      },

      /**
       * checkAuth podría usarse al cargar la app para
       * verificar si aún hay cookie/token y setear isAuthenticated,
       * o hacer una llamada a tu backend y revalidar.
       */
      checkAuth: () => {
        // Ejemplo simple: si la cookie 'token' existe,
        // marcamos isAuthenticated en true; caso contrario, false.
        const token = get().token;
        const cookieToken = typeof window !== 'undefined' ? 
            document.cookie.split('; ').find(row => row.startsWith('token=')) 
            : null;
        
        if (token && cookieToken) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      // Por defecto, createJSONStorage usa localStorage,
      // si prefieres sessionStorage, especifícalo:
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);