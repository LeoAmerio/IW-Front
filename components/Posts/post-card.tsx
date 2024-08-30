import { Posteo, PosteoTypo, User } from "@/interfaces/types";
import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardTitle } from "../ui";
import Link from "next/link";
import { usePostStore } from '@/store/post-store';

interface PosteoCard {
  id: number;
  title: string;
  descripcion: string;
  user: User;
  posteoTypo: PosteoTypo;
  imagen: string | null;
  created_at: string;
}

const PostCard = ({ posteo }: { posteo: PosteoCard }) => {
  const setPost = usePostStore((state) => state.setPosteo);

  const handleSetPost = () => {
    setPost(posteo);
  };

  return (
    <Link href={`/dashboard/post/${posteo.id}`} className="block" onClick={handleSetPost}>
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            {/* <div className="text-right"> */}
            {/* </div> */}
            <div>
              <CardTitle className="text-xl mb-2">{posteo.title}</CardTitle>
              <p className="text-gray-700 dark:text-gray-300">
                {posteo.descripcion}
              </p>
            </div>
            {posteo.imagen && (
              <img
                src={posteo.imagen}
                alt="Imagen del posteo"
                className="w-1/3 h-auto rounded-md content-end"
              />
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Badge variant="secondary">{posteo.posteoTypo.typo}</Badge>
            <div className="text-right">
              <p className="text-sm text-gray-700">{posteo.created_at}</p>
              <p className="text-sm text-gray-700 mb-0">
                Piso {posteo.user.piso} - {posteo.user.departamento}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;
