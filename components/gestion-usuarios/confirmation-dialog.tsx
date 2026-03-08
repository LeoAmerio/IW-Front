"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/interfaces/user.interface";
import { useMutation, useQueryClient } from "react-query";
import { deleteUsuario } from "@/api/user.api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ConfirmationDialog({ isOpen, onClose, user }: ConfirmationDialogProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation(() => deleteUsuario(user!.id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
      toast.success(`Usuario ${user?.nombre} ${user?.apellido} eliminado correctamente.`);
      onClose();
      router.push("/");
    },
    onError: () => {
      toast.error("Error al eliminar el usuario. Intentá de nuevo.");
    },
  });

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmación de borrado</DialogTitle>
          <DialogDescription>
            ¿Está seguro de eliminar a {user.nombre} {user.apellido}? Esta acción no se puede
            deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deleteMutation.isLoading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}