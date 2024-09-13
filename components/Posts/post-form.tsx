// import React, { useState } from "react";
// import edificiosApi from "@/api/edificios.api";
// import { CrudOperation, PosteoRequest, SearchParams } from "@/interfaces/types";
// import * as Yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Dialog, Card, CardContent, DialogContent, DialogTitle, Select, Button } from "@mui/material";
// import { DialogTrigger } from "@radix-ui/react-dialog";
// import { Label, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
// import { Input } from "postcss";
// import { DialogHeader } from "../ui/dialog";
// import { Textarea } from "../ui/textarea";
// import { useQuery } from "react-query";

// const createPost = async (posteo: PosteoRequest) => {
//   const { data } = await edificiosApi.postPost(posteo);
//   // console.log("Post created: ", data);
//   return data;
// };

// const editPost = async (posteo: PosteoRequest, id: number) => {
//   const { data } = await edificiosApi.editPost(posteo, id);
//   console.log("Post edited: ", data);
//   return data;
// };

// interface PostModalForm {
//   open: boolean;
//   onClose: () => void;
//   isEditing?: boolean;
//   operation: CrudOperation;
// }

// interface PostFormFields {
//   titulo: string;
//   descripcion: string;
//   tipo_posteo_id: number;
//   imagen?: string;
// }

// const defaultValues = {
//   titulo: "",
//   descripcion: "",
//   tipo_posteo_id: 0,
//   imagen: ""
// };

// const schema = Yup.object<PostFormFields>().shape({
//   titulo: Yup.string().required("El título es requerido"),
//   descripcion: Yup.string().required("La descripción es requerida"),
//   tipo_posteo_id: Yup.number().required("El tipo de publicación es requerido"),
//   imagen: Yup.string()
// });

// export default function PostForm() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [currentPostId, setCurrentPostId] = useState<number | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [filters, setFilters] = useState<SearchParams>({
//     usuario: '',
//     tipo_posteo: 0,
//     ordering: ''
//   })
//   const [formData, setFormData] = useState<PosteoRequest>({
//     titulo: "",
//     descripcion: "",
//     tipo_posteo_id: 1,
//     imagen: null,
//   });

//   const {
//     data: posts,
//     isLoading: loadingData,
//     refetch,
//   } = useQuery(["posts"], fetchPosts, {
//     onSuccess: (data) => {
//       // console.log("Posts from useQuery: ", data);
//       // setPosteos([posts]);
//     },
//   });

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const postData = {
//       ...formData,
//       imagen: imagePreview ? imagePreview : "null",
//     };
//     // const postData = new FormData();
//     // postData.append('titulo', formData.titulo);
//     // postData.append('descripcion', formData.descripcion);
//     // postData.append('tipo_posteo_id', formData.tipo_posteo_id.toString());
    
//     if (formData.imagen) {
//       postData.imagen = formData.imagen;
//     }

//     // console.log("Post data: ", Object.fromEntries(postData));
    

//     console.log("Post data: ", postData);
//     if (isEditing && currentPostId) {
//       await editPost(postData, currentPostId);
//       setIsEditing(false);
//       setCurrentPostId(null);
//     } else {
//       await createPost(postData);
//     }

//     setIsModalOpen(false);
//     refetch();
//   };

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DialogTrigger asChild>
//         <Card className="mb-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
//           <CardContent className="p-6">
//             <p className="text-gray-500">Realizar posteo...</p>
//           </CardContent>
//         </Card>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Crear nuevo posteo</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="titulo">Título</Label>
//             <Input
//               id="titulo"
//               required
//               value={formData.titulo}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label htmlFor="descripcion">Descripción</Label>
//             <Textarea
//               id="descripcion"
//               required
//               value={formData.descripcion}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label htmlFor="tipo">Tipo de publicación</Label>
//             <Select
//               required
//               value={formData.tipo_posteo_id.toString()}
//               onValueChange={handleSelectChange}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Seleccione un tipo" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value={"0"}>AVISO</SelectItem>
//                 <SelectItem value={"1"}>CONSULTA</SelectItem>
//                 <SelectItem value={"2"}>RECLAMO</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="imagen">
//               Imagen{" "}
//               {formData.titulo
//                 ? "(opcional, deje vacío para mantener la imagen actual)"
//                 : "(opcional)"}
//             </Label>
//             <Input
//               id="imagen"
//               type="file"
//               accept="image/*"
//               onChange={handleChange}
//             />
//             {imagePreview && (
//               <div className="mt-2">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="max-w-full h-auto max-h-48 object-contain"
//                 />
//               </div>
//             )}
//           </div>
//           <Button type="submit">Publicar</Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
