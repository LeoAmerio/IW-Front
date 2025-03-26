import { EventResponse } from "@/interfaces/types";
import { PencilIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@mui/material";
import { Card, CardContent, CardTitle } from "../ui";
import { Badge } from "../ui/badge";
import Link from "next/link";
import React, { useState } from "react";
import { useAuthStore } from "@/store/auth/auth.store";
import { truncateDescription } from "../helpers/helpers";
import VerticalMenu from "../VerticalMenu/vertical-menu";
import { useMenuActions } from "../hooks/useMenuActions";
import ConfirmModal from "../confirmation-modal";
import { useMutation } from "react-query";
import toast from "react-hot-toast";

interface EventCardProps {
  event: EventResponse;
}

const EventCard = ({ event }: EventCardProps) => {
  const user_id = useAuthStore((state) => state.user_id);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMutation = useMutation(
    () => fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/comunicaciones/eventos/${event.id}/`, { method: 'DELETE' }),
    {
      onSuccess: () => {
        setIsDeleting(false);
        toast.success('Evento eliminado');
      },
      onError: () => {
        setIsDeleting(false);
        toast.error('Error al eliminar el evento');
      }
    }
  )

  const handleModalDelete = () => {
    setIsDeleting(true)
  }

  const handleDeleteEvent = () => {
    deleteMutation.mutate()
  };

  const handleEditEvent = () => {};

  const handleReportEvent = () => {};

  const menuActions = useMenuActions({
    userId: user_id!,
    ownerId: event.usuario,
    onEdit: () => handleEditEvent,
    onDelete: handleModalDelete,
    onReport: handleReportEvent,
    event: event,
  });

  return (
    <>
      <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl m-2 font-bold text-gray-900 dark:text-gray-200">
            {event.titulo}
          </CardTitle>
          <VerticalMenu actions={menuActions} />
          {/* {user_id === event.usuario && (
            <IconButton
              onClick={() => {}}
              className="m-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <PencilIcon className="h-5 w-5 d-flex justify-end" />
            </IconButton>
          )} */}
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 mr-4">
              <p className="text-gray-700 dark:text-gray-300">
                {truncateDescription(event.descripcion, 150)}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            {event.tipo_evento && event.tipo_evento.tipo && (
              <Badge variant="secondary">{event.tipo_evento.tipo}</Badge>
            )}
            <div className="text-right">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {event.fecha_inicio === event.fecha_fin
                  ? event.fecha_inicio
                  : `Desde ${event.fecha_inicio} hasta ${event.fecha_fin}`}
              </p>
              {/* {posteo.usuario &&
                posteo.usuario.piso !== null &&
                posteo.usuario.numero !== null && (
                  <p className="text-sm text-gray-700 mb-0">
                    Piso {posteo.usuario.piso} - {posteo.usuario.numero}
                  </p>
                )} */}
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmModal 
        open={isDeleting}
        handleClose={() => setIsDeleting(false)}
        handleSubmit={handleDeleteEvent}
        loading={false}
      >
        ¿Estás seguro que deseas eliminar este evento?
      </ConfirmModal>
    </>
  );
};

export default EventCard;
