import { Posteo } from '@/interfaces/types'
import React from 'react'
import { Badge } from '../ui/badge'

interface PosteoCard {
  id: number
  titulo: string
  descripcion: string
  usuario: {
    id: number
    nombre: string
    apellido: string
    piso: number
    numero: string
  }
  tipo_posteo: {
    id: number
    tipo: string
  }
  imagen: string | null
  fecha_creacion_legible: string
}

const PostCard = ({ posteo }: { posteo: PosteoCard }) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          {/* <div className="text-right"> */}
          {/* </div> */}
          <div>
            <Typography className="text-xl mb-2 text-black">
              {posteo.titulo}
            </Typography>
            <p className="text-black dark:text-gray-300">
              {posteo.descripcion}
            </p>
          </div>
          {/* {posteo.imagen && ( */}
            <img
              src="https://source.unsplash.com/random"
              alt="Imagen del posteo"
              className="w-1/3 h-auto rounded-md content-end"
              />
            {/* )} */}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Badge variant="secondary">{posteo.tipo_posteo.tipo}</Badge>
          <div className="text-right">
            <p className="text-sm text-gray-700">
              {posteo.fecha_creacion_legible}
            </p>
            <p className="text-sm text-gray-700 mb-0">
              Piso {posteo.usuario.piso} - {posteo.usuario.numero}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard
