import { MenuAction, Posteo } from "@/interfaces/types";
import { PencilIcon } from "@heroicons/react/24/outline";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { useMemo } from 'react';

interface UseMenuActionsProps {
  userId?: number;
  ownerId?: number;
  onEdit?: (posteo: Posteo) => void;
  onDelete?: (posteo: Posteo) => void;
  onReport: () => void;
  extraActions?: MenuAction[];
  posteo: Posteo;
}

export const useMenuActions = ({
  userId,
  ownerId,
  onEdit,
  onDelete,
  onReport,
  extraActions = [],
  posteo
}: UseMenuActionsProps) => {
  const menuActions = useMemo(() => {
    const defaultActions: MenuAction[] = [
      {
        key: 'edit',
        label: 'Editar',
        icon: <PencilIcon className="h-5 w-5" />,
        onClick: () => onEdit?.(posteo),
        show: userId === ownerId && !!onEdit
      },
      {
        key: 'delete',
        label: 'Eliminar',
        icon: <DeleteOutlineIcon className="h-5 w-5 fill-red-600" />,
        onClick: () => onDelete?.(posteo),
        show: userId === ownerId && !!onDelete
      },
      {
        key: 'report',
        label: 'Denunciar',
        icon: <ReportGmailerrorredIcon className="h-5 w-5 fill-red-600" />,
        onClick: () => onReport(),
        show: !!onReport
      }
    ];

    // Merge default actions with extra actions
    return [...defaultActions, ...extraActions].filter(action => action.show !== false);
  }, [userId, ownerId, onEdit, onDelete, onReport, extraActions]);

  return menuActions;
};