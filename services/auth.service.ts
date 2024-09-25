import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user_id: number;
  email: string | null;
  setAuth: (token: string, userId: number, email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user_id: 0,
  email: null,
  setAuth: (token, user_id, email) => set({ token, user_id, email }),
  clearAuth: () => set({ token: null, user_id: 0, email: null }),
}));