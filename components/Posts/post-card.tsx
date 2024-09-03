import { Posteo, PosteoTypo, PosteoTypoEnum, User } from "@/interfaces/types";
import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardTitle } from "../ui";
import Link from "next/link";
import { usePostStore } from "@/store/post-store";
import Image from "next/image";
import { PencilIcon } from "@heroicons/react/24/outline";
import { CardHeader, IconButton } from "@mui/material";

interface PostCardProps {
  posteo: Posteo;
  onEdit: (Posteo: Posteo) => void;
}

const PostCard: React.FC<PostCardProps> = ({ posteo, onEdit }) => {
  const setPost = usePostStore((state) => state.setPosteo);

  const handleSetPost = () => {
    setPost(posteo);
  };

  const truncateDescription = (descripcion: string, maxLength: number) => {
    return descripcion.length > maxLength
      ? `${descripcion.substring(0, maxLength)}...`
      : descripcion;
  };

  const handleEditPost = (posteo: Posteo) => {
    // console.log("Editando posteo: ", posteo);
    onEdit(posteo);
  };

  // console.log("Posteo:", posteo);

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl m-2 font-bold text-gray-900">
            {posteo.titulo}
          </CardTitle>
          <IconButton
            onClick={() => handleEditPost(posteo)}
            className="m-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <PencilIcon className="h-5 w-5 d-flex justify-end" />
          </IconButton>
      </div>
      <Link
        href={`/dashboard/post/${posteo.id}`}
        className="block"
        onClick={handleSetPost}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 mr-4">
              <p className="text-gray-700 dark:text-gray-300">
                {truncateDescription(posteo.descripcion, 150)}
              </p>
            </div>
            {posteo.imagen && (
              <div className="w-1/3 h-auto relative aspect-square">
                <Image
                  src={posteo.imagen}
                  alt="Imagen del posteo"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md content-end"
                />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            {posteo.tipo_posteo && posteo.tipo_posteo.tipo && (
              <Badge variant="secondary">
                {/* {getPosteoType()} */}
                {posteo.tipo_posteo.tipo}
              </Badge>
            )}
            <div className="text-right">
              <p className="text-sm text-gray-700">
                {posteo.fecha_creacion_legible}
              </p>
              {posteo.usuario &&
                posteo.usuario.piso !== null &&
                posteo.usuario.depto !== null && (
                  <p className="text-sm text-gray-700 mb-0">
                    Piso {posteo.usuario.piso} - {posteo.usuario.depto}
                  </p>
                )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PostCard;
