import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { Servicios } from '@/interfaces/types';
import { 
  fetchServicios, 
  createProfessional, 
  editProfessional, 
  deleteProfessional 
} from '@/api/services.api';
import { ProfessionalFormRequest } from '@/components/servicios-gestion/professional-dialog';

interface ServicesState {
  services: Servicios[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchServices: () => Promise<void>;
  createService: (data: ProfessionalFormRequest) => Promise<void>;
  updateService: (id: number, data: ProfessionalFormRequest) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useServicesStore = create<ServicesState>()(
  devtools(
    (set, get) => ({
      services: [],
      isLoading: false,
      error: null,

      fetchServices: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const data = await fetchServicios();
          set({ services: data, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al obtener servicios';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        }
      },

      createService: async (data: ProfessionalFormRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const newService = await createProfessional(data);
          set((state) => ({ 
            services: [...state.services, newService],
            isLoading: false 
          }));
          toast.success('Profesional creado exitosamente');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al crear profesional';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      updateService: async (id: number, data: ProfessionalFormRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const updatedService = await editProfessional(id, data);
          set((state) => ({
            services: state.services.map((s) => s.id === id ? updatedService : s),
            isLoading: false
          }));
          toast.success('Profesional actualizado exitosamente');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al actualizar profesional';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      deleteService: async (id: number) => {
        set({ isLoading: true, error: null });
        
        try {
          await deleteProfessional(id);
          set((state) => ({
            services: state.services.filter((s) => s.id !== id),
            isLoading: false
          }));
          toast.success('Profesional eliminado exitosamente');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al eliminar profesional';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    })
  )
);
