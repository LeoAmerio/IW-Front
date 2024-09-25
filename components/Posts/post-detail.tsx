"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Posteo, PosteoTypo, User } from "@/interfaces/types";
import { PencilIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@mui/material";
// import { MessageCircle } from 'lucide-react'
import Cookies from "js-cookie";
import { useAuthStore } from "@/services/auth.service";
import { TrashIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

interface PostCardProps {
  posteo: Posteo;
  // onEdit: (Posteo: Posteo) => void;
}

const deletePost = async (id: number) => {
  console.log("Deleting post with ID:", id);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/comunicaciones/posteos/${id}/`,
    {
      method: "DELETE",
      headers: {
        // "Content-Type": "application/json",
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

const PostDetail = ({ posteo }: PostCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comentario, setComentario] = useState("");
  const userId = useAuthStore((state) => state.user_id);
  const queryClient = useQueryClient();
  // const router = useRouter();

  if (!posteo) {
    return <div>Posteo no encontrado</div>;
  }

  const handleSubmitComentario = (e: React.FormEvent) => {
    e.preventDefault();
    setComentario("");
    setIsModalOpen(false);
  };

  const deletePostMutation = useMutation(deletePost, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("posts");
      toast.success("Posteo eliminado exitosamente");
      // if (data.status === 204) {
      //   redirect("/");
      // }
      window.location.href = "/dashboard";
    },
    onError: (error: Error) => {
      // redirect("/");
      window.location.href = "/dashboard";
    },
  });

  const handleDeletePost = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este posteo?")) {
      deletePostMutation.mutate(posteo.id);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-2xl">{posteo.titulo}</CardTitle>
            {userId === posteo.usuario.id && (
              <IconButton
                onClick={handleDeletePost}
                className="text-gray-500 hover:text-gray-700 justify-end"
              >
                <TrashIcon className="h-5 w-5" />
              </IconButton>
            )}
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="outline">{posteo.tipo_posteo.tipo}</Badge>
            <p className="text-sm text-gray-500">
              {posteo.fecha_creacion_legible}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {posteo.descripcion}
          </p>
          {posteo.imagen && (
            <img
              src={posteo.imagen}
              alt="Imagen del posteo"
              className="w-full h-auto rounded-md mb-4"
            />
          )}
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Autor: {posteo.usuario.piso} - {posteo.usuario.numero}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                {/* <MessageCircle className="mr-2 h-4 w-4" /> */}
                Responder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar comentario</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitComentario} className="space-y-4">
                <Textarea
                  placeholder="Escribe tu comentario aquí"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                />
                <Button type="submit">Enviar comentario</Button>
              </form>
            </DialogContent>
          </Dialog>
          {/* <span className="text-sm text-gray-500">{posteo.comentarios} comentarios</span> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostDetail;
