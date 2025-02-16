import { useMutation, useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

interface ReportPostPayload {
  tipo: string;
  usuario_denunciado: number | null;
  posteo_denunciado: number | null;
  evento_denunciado: number | null;
  comentario: string;
}

export const useReportPost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: ReportPostPayload) => {
      const response = await fetch(
        'https://ucse-iw-2024.onrender.com/denuncias/denuncias/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${Cookies.get('token')}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al denunciar el posteo');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        toast.success('Posteo denunciado correctamente');
        // You might want to invalidate queries if needed
        queryClient.invalidateQueries(['posts']);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al denunciar el posteo');
      },
    }
  );
};