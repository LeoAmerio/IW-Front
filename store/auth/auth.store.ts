import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { User } from '@/interfaces/user.interface';
import { AuthStatus } from '@/interfaces/auth-status.interface';
import { QueryClient } from 'react-query';

// API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://ucse-iw-2024.onrender.com';
const LOGIN_URL = `${API_BASE_URL}/auth/login/`;
const USER_URL = (userId: number) => `${API_BASE_URL}/auth/usuarios/${userId}`;

// Response types
export interface LoginResponse {
  token: string;
  user_id: number;
  email: string;
}

// Tipo parcial para el usuario inicial
type PartialUser = Pick<User, 'id' | 'email'>;

export interface AuthState {
  // State
  status: AuthStatus;
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Computed
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  fetchUserData: () => Promise<void>;
}


const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        status: 'Pending',
        token: null,
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        // Actions
        login: async (email: string, password: string): Promise<LoginResponse> => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch(LOGIN_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              set({ 
                status: 'Unauthorized', 
                isLoading: false, 
                error: errorData.error || 'Error de autenticación',
                isAuthenticated: false 
              });
              throw new Error(errorData.error || 'Error de autenticación');
            }

            const data = await response.json();
            
            // Guardar el token en cookies para peticiones de API
            Cookies.set('token', data.token);
            
            // Actualizar el estado con un usuario parcial
            const partialUser: PartialUser = {
              id: data.user_id,
              email: data.email,
            };
            
            set({ 
              status: 'Authorized', 
              token: data.token, 
              user: partialUser as User, // Usar type assertion para evitar el error
              isLoading: false,
              error: null,
              isAuthenticated: true
            });
            
            // Obtener la información completa del usuario
            get().fetchUserData();
            
            return data;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            set({ 
              isLoading: false, 
              error: errorMessage,
              isAuthenticated: false 
            });
            throw error;
          }
        },

        logout: () => {
          const queryClient = new QueryClient();
          // Eliminar el token de las cookies
          Cookies.remove('token');
          
          // Limpiar el estado completamente
          set({ 
            status: 'Unauthorized', 
            token: null, 
            user: null,
            isLoading: false,
            error: null,
            isAuthenticated: false 
          });
          
          queryClient.clear();
        },

        initializeAuth: async () => {
          set({ isLoading: true });
          
          // Recuperar el token de las cookies
          const token = Cookies.get('token');
          
          if (!token) {
            set({ 
              status: 'Unauthorized', 
              isLoading: false,
              isAuthenticated: false 
            });
            return;
          }
          
          // Si tenemos token pero no tenemos información de usuario, actualizamos el estado
          // y luego intentamos obtener la información completa del usuario
          set({ 
            token, 
            status: 'Authorized',
            isAuthenticated: true
          });
          
          // Intentar obtener información del usuario
          try {
            await get().fetchUserData();
          } finally {
            set({ isLoading: false });
          }
        },
        
        updateUser: (userData: Partial<User>) => {
          const currentUser = get().user;
          
          if (!currentUser) {
            console.error('No hay usuario actual para actualizar');
            return;
          }
          
          set({ 
            user: { 
              ...currentUser, 
              ...userData 
            } 
          });
        },
        
        fetchUserData: async () => {
          const { token, user } = get();
          
          if (!token) {
            console.error('No hay token disponible para obtener datos del usuario');
            return;
          }
          
          // Si ya tenemos el ID del usuario, usarlo; de lo contrario, verificar si está en el estado parcial
          const userId = user?.id;
          
          if (!userId) {
            console.error('No se puede obtener datos del usuario sin un ID');
            return;
          }
          
          try {
            const response = await fetch(USER_URL(userId), {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
              },
            });
            
            if (!response.ok) {
              throw new Error('Error al obtener datos del usuario');
            }
            
            const userData = await response.json();
            
            set({ 
              user: userData,
              status: 'Authorized',
              isAuthenticated: true 
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
            // No cambiamos el estado de autenticación aquí para evitar deslogear al usuario
            // si hay un error temporal al obtener sus datos completos
            toast.error('Error al obtener datos del usuario. Algunas funciones pueden estar limitadas.');
          }
        }
      }),
      {
        name: 'auth-storage',
        // Solo persistir estos valores
        partialize: (state) => ({ 
          token: state.token,
          status: state.status,
          user: state.user,
        }),
        // Se ejecuta después de hidratar el estado desde storage
        onRehydrateStorage: () => (state) => {
          // Si tenemos un estado hidratado con token, asegurarse de que isAuthenticated sea true
          if (state && state.token) {
            state.isAuthenticated = true;
          }
        },
      }
    )
  )
);

export { useAuthStore };
