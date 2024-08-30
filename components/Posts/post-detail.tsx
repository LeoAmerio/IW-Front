'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { PosteoTypo, User } from '@/interfaces/types'
// import { MessageCircle } from 'lucide-react'

// Tipo para el posteo
type Posteo = {
  id: number;
  title: string;
  descripcion: string;
  user: User;
  posteoTypo: PosteoTypo;
  imagen: string | null;
  created_at: string;
  // comentarios: number
}

// Función para obtener el posteo por ID (simulada)
function getPosteoById(id: number): Posteo | null {
  // En una aplicación real, aquí harías una llamada a tu API
  const posteo: Posteo = {
    id: 12,
    title: "probando hacer un posteo",
    descripcion: "soy leo posteando en mi edificio :)",
    user: {
      id: 38,
      name: "leo",
      lastName: "amerio",
      piso: 2,
      departamento: "D"
    },
    posteoTypo: {
      id: 1,
      typo: "Reclamo"
    },
    imagen: null,
    created_at: "29 de agosto de 2024 a las 22:25",
    // comentarios: 5
  }

  return posteo.id === id ? posteo : null
}

const PostDetail = ({ posteo }: { posteo: Posteo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comentario, setComentario] = useState('')

  if (!posteo) {
    return <div>Posteo no encontrado</div>
  }

  const handleSubmitComentario = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el comentario
    console.log('Comentario enviado:', comentario)
    setComentario('')
    setIsModalOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{posteo.title}</CardTitle>
          <div className="flex justify-between items-center">
            <Badge variant="outline">{posteo.posteoTypo.typo}</Badge>
            <p className="text-sm text-gray-500">{posteo.created_at}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{posteo.descripcion}</p>
          {posteo.imagen && (
            <img src={posteo.imagen} alt="Imagen del posteo" className="w-full h-auto rounded-md mb-4" />
          )}
          <div className="text-right">
            <p className="text-sm text-gray-500">Autor: Piso {posteo.user.piso} - {posteo.user.departamento}</p>
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