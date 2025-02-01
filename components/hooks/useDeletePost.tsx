import { useMutation, useQueryClient } from "react-query";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const deletePost = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/comunicaciones/posteos/${id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${Cookies.get("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete post: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return { status: 204 };
  }

  return response.json();
};

/**
 * onSuccessCallback: Callback function to execute after the post is deleted
 * Por defecto (si no pasas ningún callback), cuando eliminas un post exitosamente:
 * - Invalida la caché de posts
 * - Muestra un mensaje de éxito
 * - Redirige al dashboard
 * Pero digamos que en algunas partes de la app queremos un comportamiento diferente.
 * Example:
 * En un componente que muestra una lista de posts
 * const deletePostMutation = useDeletePost(() => {
 * - En vez de redirigir, solo actualiza la lista
 *   refetchPosts();
 * });
 *
 * En un modal
 * const deletePostMutation = useDeletePost(() => {
 * - Cierra el modal después de eliminar
 *    closeModal();
 *  });
 */
export const useDeletePost = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation(deletePost, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("posts");
      toast.success("Posteo eliminado exitosamente");
      
      if (onSuccessCallback) {
        onSuccessCallback();
      } else {
        window.location.href = "/dashboard";
      }
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el posteo: ${error.message}`);
      window.location.href = "/dashboard";
    },
  });
};
