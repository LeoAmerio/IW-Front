"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Posteo,
  PosteoRequest,
  PosteoTypoEnum,
  SearchParams,
} from "@/interfaces/types";
import edificiosApi from "@/api/edificios.api";
import { useQuery } from "react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { ManageSearch as ManageSearchIcon } from "@mui/icons-material";

const createPost = async (posteo: PosteoRequest) => {
  const { data } = await edificiosApi.postPost(posteo);
  return data;
};

const editPost = async (posteo: PosteoRequest, id: number) => {
  const { data } = await edificiosApi.editPost(posteo, id);
  return data;
};

const PostsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);


  const [filters, setFilters] = useState<SearchParams>({
    usuario: 0,
    tipo_posteo: "",
    ordering: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<SearchParams>({
    usuario: 0,
    tipo_posteo: "",
    ordering: "",
  });

  const { control, handleSubmit, reset, setValue } = useForm<PosteoRequest>({
    defaultValues: {
      titulo: "",
      descripcion: "",
      tipo_posteo_id: 1,
      imagen: null,
    },
  });

  const fetchPosts = async (filters: SearchParams) => {
    const params = new URLSearchParams();
    if (filters.usuario) params.append("usuario", filters.usuario.toString());
    if (filters.tipo_posteo) params.append("tipo_posteo", filters.tipo_posteo);
    if (filters.ordering) params.append("ordering", filters.ordering);
    const { data } = await edificiosApi.getPosts(params.toString());
    return data;
  };

  const {
    data: posts,
    isLoading: loadingData,
    refetch,
  } = useQuery(["posts", appliedFilters], () => fetchPosts(appliedFilters), {
    enabled: true,
  });

  const listUsersPost = posts ? Array.from(new Set(posts.map(post => JSON.stringify(post.usuario))))
    .map(userStr => JSON.parse(userStr)) : [];
  console.log('List users post: ', listUsersPost);

  const handleEdit = (posteo: Posteo) => {
    setValue("titulo", posteo.titulo);
    setValue("descripcion", posteo.descripcion);
    setValue("tipo_posteo_id", posteo.tipo_posteo.id);
    setCurrentPostId(posteo.id);
    setImagePreview(posteo.imagen);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: PosteoRequest) => {
    if (isEditing && currentPostId) {
      const { imagen, ...editData } = data;
      await editPost(editData, currentPostId);
      setIsEditing(false);
      setCurrentPostId(null);
    } else {
      await createPost(data);
    }

    setIsModalOpen(false);
    refetch();
  };

  const resetForm = () => {
    reset({
      titulo: "",
      descripcion: "",
      tipo_posteo_id: 1,
      imagen: null,
    });
    setImagePreview(null);
  };

  useEffect(() => {
    if (!isModalOpen) {
      resetForm();
    }
  }, [isModalOpen]);

  // const handleFilterChange = (key: keyof SearchParams, value: string) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     [key]: key === "tipo_posteo" ? parseInt(value) : value,
  //   }));
  // };

  const handleFilterChange = (key: keyof SearchParams, value: string) => {
    // setFilters(prev => ({ ...prev, [key]: value }));
    setFilters((prev) => ({
      ...prev,
      [key]: key === "usuario" ? parseInt(value, 10) : value,
    }));
  };

  const applyFilters = () => {
    refetch();
    setAppliedFilters(filters);
    setIsFilterModalOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      usuario: 0,
      tipo_posteo: "",
      ordering: "",
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    setIsFilterModalOpen(false);
    refetch();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            {/* <Card className="mb-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"> */}
            <Card className="flex-grow mr-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <CardContent className="p-4">
                <p className="text-gray-500">Realizar posteo...</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar posteo" : "Crear nuevo posteo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Controller
                  name="titulo"
                  control={control}
                  rules={{ required: "El título es requerido" }}
                  render={({ field }) => <Input {...field} />}
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Controller
                  name="descripcion"
                  control={control}
                  rules={{ required: "La descripción es requerida" }}
                  render={({ field }) => <Textarea {...field} />}
                />
              </div>
              <div>
                <Label htmlFor="tipo_posteo_id">Tipo de publicación</Label>
                <Controller
                  name="tipo_posteo_id"
                  control={control}
                  rules={{ required: "El tipo de publicación es requerido" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">AVISO</SelectItem>
                        <SelectItem value="2">CONSULTA</SelectItem>
                        <SelectItem value="3">RECLAMO</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {!isEditing && (
                <div>
                  <Label htmlFor="imagen">
                    Imagen{" "}
                    {isEditing
                      ? "(opcional, deje vacío para mantener la imagen actual)"
                      : "(opcional)"}
                  </Label>
                  <Controller
                    name="imagen"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    )}
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
              )}
              <Button type="submit">
                {isEditing ? "Actualizar" : "Publicar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="h-[58px] w-[58px]"
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
      </div>

      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrar posteos</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="space-y-4">
            <div>
              <Label htmlFor="usuario">Usuario</Label>
              <Select
                value={filters.usuario.toString()}
                onValueChange={(value) => handleFilterChange("usuario", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {listUsersPost.map((user, index) => (
                    <SelectItem key={index} value={`${user.id}`}>
                      {user.piso} {user.numero}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipo_posteo">Tipo de posteo</Label>
              <Select
                value={filters.tipo_posteo}
                onValueChange={(value) => handleFilterChange("tipo_posteo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="">Todos</SelectItem> */}
                  <SelectItem value="Aviso">AVISO</SelectItem>
                  <SelectItem value="Consulta">CONSULTA</SelectItem>
                  <SelectItem value="Reclamo">RECLAMO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ordering">Ordenar por fecha de creación</Label>
              <Select
                value={filters.ordering}
                onValueChange={(value) => handleFilterChange("ordering", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione orden" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="">Sin orden</SelectItem> */}
                  <SelectItem value="fecha_creacion">Más recientes primero</SelectItem>
                  <SelectItem value="-fecha_creacion">Más antiguos primero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between">
              <Button type="submit">Aplicar filtros</Button>
              <Button type="button" variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
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
