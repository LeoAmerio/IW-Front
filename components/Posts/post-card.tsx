import { Posteo, PosteoTypo, PosteoTypoEnum, User } from "@/interfaces/types";
import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardTitle } from "../ui";
import Link from "next/link";
import { usePostStore } from "@/store/post-store";
import Image from "next/image";
import { PencilIcon } from "@heroicons/react/24/outline";
import { CardHeader, IconButton, Menu, MenuItem } from "@mui/material";
import { useAuthStore } from "@/services/auth.service";
import { useQuery } from "react-query";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { truncateDescription } from "../helpers/helpers";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useMenuActions } from "../hooks/useMenuActions";
import VerticalMenu from "../VerticalMenu/vertical-menu";
import { useDeletePost } from "../hooks/useDeletePost";

interface PostCardProps {
  posteo: Posteo;
  onEdit: (Posteo: Posteo) => void;
}

const fetchUserById = async (user_id: number): Promise<User> => {
  const response = await fetch(
    `https://ucse-iw-2024.onrender.com/auth/usuarios/${user_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${Cookies.get("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener el usuario");
  }

  return response.json();
};

const PostCard: React.FC<PostCardProps> = ({ posteo, onEdit }) => {
  const setPost = usePostStore((state) => state.setPosteo);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const user_id = useAuthStore((state) => state.user_id);

  const { data, isLoading } = useQuery(
    ["user", user_id],
    () => fetchUserById(user_id!),
    {
      enabled: !!user_id,
      refetchOnWindowFocus: false,
    }
  );

  const deletePostMutation = useDeletePost();

  const open = Boolean(anchorEl);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSetPost = () => {
    setPost(posteo);
  };

  const handleEditPost = (posteo: Posteo) => {
    onEdit(posteo);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este posteo?")) {
      deletePostMutation.mutate(posteo.id);
    }
  };

  const handleReportPost = () => {
    setAnchorEl(null);
  };

  const menuActions = useMenuActions({
    userId: user_id,
    ownerId: posteo.usuario.id,
    onEdit: handleEditPost,
    onDelete: handleDeletePost,
    onReport: handleReportPost,
    posteo: posteo,
  });

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-2">
        <CardTitle className="text-2xl m-2 font-bold text-gray-900">
          {posteo.titulo}
        </CardTitle>
        <VerticalMenu actions={menuActions} />
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
                posteo.usuario.numero !== null && (
                  <p className="text-sm text-gray-700 mb-0">
                    Piso {posteo.usuario.piso} - {posteo.usuario.numero}
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
