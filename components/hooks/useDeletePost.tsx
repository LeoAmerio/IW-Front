// import { useMutation, useQueryClient } from 'react-query';

// const useDeletePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation(deletePostById, {
//     onSuccess: () => {
//       queryClient.invalidateQueries('posts'); // Invalida la caché de posts para actualizar la lista
//       toast.success("Posteo eliminado exitosamente");
//     },
//     onError: (error: Error) => {
//       toast.error(error.message);
//     },
//   });
// };