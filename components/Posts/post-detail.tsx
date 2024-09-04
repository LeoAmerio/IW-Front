'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Posteo, PosteoTypo, User } from '@/interfaces/types'
import { PencilIcon } from '@heroicons/react/24/outline'
import { IconButton } from '@mui/material'
// import { MessageCircle } from 'lucide-react'

interface PostCardProps {
  posteo: Posteo;
  // onEdit: (Posteo: Posteo) => void;
}

const PostDetail = ({ posteo }: PostCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comentario, setComentario] = useState('')

  if (!posteo) {
    return <div>Posteo no encontrado</div>
  }

  const handleSubmitComentario = (e: React.FormEvent) => {
    e.preventDefault()
    setComentario('')
    setIsModalOpen(false)
  }

  // const handleEditPost = () => {
  //   onEdit(posteo);
  // }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{posteo.titulo}</CardTitle>
          {/* <IconButton onClick={handleEditPost} className="text-gray-500 hover:text-gray-700">
            <PencilIcon className="h-5 w-5" />
          </IconButton> */}
          <div className="flex justify-between items-center">
            <Badge variant="outline">{posteo.tipo_posteo.tipo}</Badge>
            <p className="text-sm text-gray-500">{posteo.fecha_creacion_legible}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{posteo.descripcion}</p>
          {posteo.imagen && (
            <img src={posteo.imagen} alt="Imagen del posteo" className="w-full h-auto rounded-md mb-4" />
          )}
          <div className="text-right">
            <p className="text-sm text-gray-500">Autor: Piso {posteo.usuario.piso} - {posteo.usuario.depto}</p>
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
  )
}

export default PostDetail;