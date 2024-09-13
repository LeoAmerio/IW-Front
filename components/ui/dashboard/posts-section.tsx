"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CardContent, Card, CardTitle } from "@/components/ui";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import PostCard from "@/components/Posts/post-card";
import { Posteo, PosteoRequest, PosteoTypoEnum, SearchParams } from "@/interfaces/types";
import axios from "axios";
import edificiosApi from "@/api/edificios.api";
import { useQuery } from "react-query";

const fetchPosts = async () => {
  const { data } = await edificiosApi.getPosts();
  return data;
};

const createPost = async (posteo: PosteoRequest) => {
  const { data } = await edificiosApi.postPost(posteo);
  return data;
};

const editPost = async (posteo: PosteoRequest, id: number) => {
  const { data } = await edificiosApi.editPost(posteo, id);
  console.log("Post edited: ", data);
  return data;
};

const getFilters = async (filters: SearchParams) => {
  const { data } = await edificiosApi.getFilters(filters);
  console.log("Filters from api: ", data);
  return data;
};

const PostsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchParams>({
    usuario: '',
    tipo_posteo: 0,
    ordering: ''
  })
  const [formData, setFormData] = useState<PosteoRequest>({
    titulo: "",
    descripcion: "",
    tipo_posteo_id: 1,
    imagen: null,
  });

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      tipo_posteo_id: parseInt(value),
    }));
  };

  const handleEdit = (posteo: Posteo) => {
    setFormData({
      titulo: posteo.titulo,
      descripcion: posteo.descripcion,
      tipo_posteo_id: posteo.tipo_posteo.id,
    });
    setCurrentPostId(posteo.id);
    setImagePreview(posteo.imagen);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, files } = e.target as HTMLInputElement;
    if (id === 'imagen' && files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [id]: files[0]
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const {
    data: posts,
    isLoading: loadingData,
    refetch,
  } = useQuery(["posts"], fetchPosts, {
    onSuccess: (data) => {
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let postData: PosteoRequest;

    if (isEditing && currentPostId) {
      // Para edición, excluimos el campo de imagen
      const { imagen, ...editData } = formData;
      postData = editData;
      await editPost(postData, currentPostId);
      setIsEditing(false);
      setCurrentPostId(null);
    } else {
      // Para creación, incluimos la imagen solo si se ha seleccionado una
      postData = {
        ...formData,
        imagen: formData.imagen || null,
      };
      await createPost(postData);
    }

    setIsModalOpen(false);
    refetch();
  };

  const handleFilterChange = (e: any) => {
    const { id, value } = e.target
    setFilters(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const applyFilters = () => {
    refetch();
    setIsFilterModalOpen(false)
  }

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipo_posteo_id: 1,
      imagen: null
    })
    setImagePreview(null)
  }

  useEffect(() => {
    if (!isModalOpen) {
      resetForm()
    }
  }, [isModalOpen])

  return (
    <div className="container mx-auto p-4">
      {/* <div className="flex mb-2 space-x-2"> */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Card className="mb-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <CardContent className="p-6">
              <p className="text-gray-500">Realizar posteo...</p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar posteo' : 'Crear nuevo posteo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                required
                value={formData.titulo}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                required
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo de publicación</Label>
              <Select
                required
                value={formData.tipo_posteo_id.toString()}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"0"}>AVISO</SelectItem>
                  <SelectItem value={"1"}>CONSULTA</SelectItem>
                  <SelectItem value={"2"}>RECLAMO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="imagen">
                Imagen{" "}
                {formData.titulo
                  ? "(opcional, deje vacío para mantener la imagen actual)"
                  : "(opcional)"}
              </Label>
              <Input
                id="imagen"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto max-h-48 object-contain"
                  />
                </div>
              )}
            </div>
            <Button type="submit">{isEditing ? 'Actualizar' : 'Publicar'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="mt-6 grid grid-cols-1 space-y-4">
        {loadingData ? (
          <p>Cargando posteos...</p>
        ) : (
          posts &&
          posts.map((posteo) => (
            <PostCard key={posteo.id} posteo={posteo} onEdit={handleEdit} />
          ))
        )}
      </div>
    </div>
  );
};

export default PostsSection;




{/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="h-[72px] w-[72px] mb-4"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <ManageSearchIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filtros</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* </div>

      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrar posteos</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyFilters();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={filters.usuario || ""}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <Label htmlFor="tipo_posteo">Tipo de posteo</Label>
              <Select
                value={filters.tipo_posteo.toString()}
                onValueChange={(value: any) =>
                  handleFilterChange({ target: { id: "tipo_posteo", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="">Todos</SelectItem> 
                  <SelectItem value="0">AVISO</SelectItem>
                  <SelectItem value="1">CONSULTA</SelectItem>
                  <SelectItem value="2">RECLAMO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ordering">Ordenar por fecha</Label>
              <Select
                value={filters.ordering || ""}
                onValueChange={(value: any) =>
                  handleFilterChange({ target: { id: "ordering", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin orden</SelectItem>
                  <SelectItem value="fecha_creacion">
                    Más recientes primero
                  </SelectItem>
                  <SelectItem value="-fecha_creacion">
                    Más antiguos primero
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Aplicar filtros</Button>
          </form>
        </DialogContent>
      </Dialog> */}