'use client'

import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteProfessional } from '@/api/services.api'
import { LinearProgress } from '@mui/material'

type DeleteConfirmationDialogProps = {
  isOpen: boolean
  onClose: () => void
  professional: {
    id: number
    nombre_proveedor: string
  } | null
}

export function DeleteConfirmationDialog({ isOpen, onClose, professional }: DeleteConfirmationDialogProps) {
  const queryClient = useQueryClient()

  const deleteProfessionalMutation = useMutation(
    ({ id }: { id: number }) =>
      deleteProfessional(id),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['professionals'])
        onClose()
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.error('Error al eliminar:', error.response?.status, error.message)
        } else {
          console.error('Error desconocido:', error)
        }
      }
    }
  );

  const handleDelete = () => {
    if (!professional || !professional.id) {
      console.error('No hay profesional seleccionado')
      // onClose()
      return
    }

    deleteProfessionalMutation.mutate({ id: professional?.id! })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmacio de borrado</DialogTitle>
          <DialogDescription>
            Esta seguro de dar de baja a {professional?.nombre_proveedor}? Esta accion no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProfessionalMutation.isLoading || deleteProfessionalMutation.isSuccess}
          >
            Eliminar
          </Button>
        </DialogFooter>
        {deleteProfessionalMutation.isLoading && <LinearProgress />}
      </DialogContent>
    </Dialog>
  )
}