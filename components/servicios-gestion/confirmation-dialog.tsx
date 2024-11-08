'use client'

import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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

  const mutation = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/professionals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['professionals'])
      onClose()
    },
  })

  const handleDelete = () => {
    if (professional) {
      mutation.mutate(professional.id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {professional?.nombre_proveedor}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}