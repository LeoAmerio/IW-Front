'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LinearProgress } from '@mui/material'
import { useServicesStore } from '@/store/services/services.store'

type DeleteConfirmationDialogProps = {
  isOpen: boolean
  onClose: () => void
  professional: {
    id: number
    nombre_proveedor: string
  } | null
}

export function DeleteConfirmationDialog({ isOpen, onClose, professional }: DeleteConfirmationDialogProps) {
  const { deleteService, isLoading } = useServicesStore()

  const handleDelete = async () => {
    if (!professional || !professional.id) {
      console.error('No hay profesional seleccionado')
      return
    }

    try {
      await deleteService(professional.id)
      onClose()
    } catch (error) {
      // Error is already handled in the store
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmación de borrado</DialogTitle>
          <DialogDescription>
            ¿Está seguro de dar de baja a {professional?.nombre_proveedor}? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Eliminar
          </Button>
        </DialogFooter>
        {isLoading && <LinearProgress />}
      </DialogContent>
    </Dialog>
  )
}