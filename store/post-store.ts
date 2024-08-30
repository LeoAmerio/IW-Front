import { PosteoTypo, User } from '@/interfaces/types';
import create from 'zustand';

interface PosteoCard {
  id: number;
  title: string;
  descripcion: string;
  user: User;
  posteoTypo: PosteoTypo;
  imagen: string | null;
  created_at: string;
}

interface PostStore {
  posteo: PosteoCard | null;
  setPosteo: (posteo: PosteoCard) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  posteo: null,
  setPosteo: (posteo) => set({ posteo }),
}));