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

const PostsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<PosteoRequest>({
    defaultValues: {
      titulo: "",
      descripcion: "",
      tipo_posteo_id: 1,
      imagen: null,
    },
  });

  const {
    data: posts,
    isLoading: loadingData,
    refetch,
  } = useQuery(["posts"], fetchPosts);

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

  return (
    <div className="container mx-auto p-4">
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
                      <SelectItem value="3">AVISO</SelectItem>
                      <SelectItem value="2">CONSULTA</SelectItem>
                      <SelectItem value="1">RECLAMO</SelectItem>
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