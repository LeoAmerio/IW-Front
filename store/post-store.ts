import { Posteo, PosteoTypo, User } from "@/interfaces/types";
import create from "zustand";

interface PosteoCard {
  id: number;
  title: string;
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

interface PostStore {
  posteo: Posteo | null;
  setPosteo: (posteo: Posteo) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  posteo: null,
  setPosteo: (posteo) => set({ posteo }),
}));
