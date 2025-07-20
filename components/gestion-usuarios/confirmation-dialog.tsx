"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/interfaces/user.interface";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ConfirmationDialog({ isOpen, onClose, user }: ConfirmationDialogProps) {
  if (!user) return null;
  const handleDelete = () => {
    // TODO: conectar con la API para eliminar usuario
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmación de borrado</DialogTitle>
          <DialogDescription>
            ¿Está seguro de eliminar a {user?.nombre} {user?.apellido}? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 