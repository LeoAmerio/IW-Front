import { EventResponse, MenuAction, Posteo, User } from "@/interfaces/types";
import { PencilIcon } from "@heroicons/react/24/outline";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { useMemo } from 'react';

type MenuActionType = Posteo | EventResponse | User;

interface UseMenuActionsProps {
  userId?: number;
  ownerId?: number;
  onEdit?: (item: MenuActionType) => void;
  onDelete?: (item: MenuActionType) => void;
  onReport: () => void;
  extraActions?: MenuAction[];
  posteo?: Posteo;
  event?: EventResponse;
  user?: User;
}

export const useMenuActions = ({
  userId,
  ownerId,
  onEdit,
  onDelete,
  onReport,
  extraActions = [],
  posteo,
  event,
  user
}: UseMenuActionsProps) => {
  const singleItem: MenuActionType = useMemo(() => {
    const items = [posteo, event, user].filter(item => item !== undefined);
    if (items.length > 1) {
      throw new Error('Solo se puede pasar un item a la vez (posteo, evento o usuario)');
    }
    return items[0];
  }, [posteo, event, user]);

  // Second useMemo for menu actions, using the validated singleItem
  const menuActions = useMemo(() => {
    // if (!singleItem) {
    //   return extraActions;
    // }

    const defaultActions: MenuAction[] = [
      {
        key: 'edit',
        label: 'Editar',
        icon: <PencilIcon className="h-5 w-5" />,
        onClick: () => onEdit?.(singleItem),
        show: userId === ownerId && !!onEdit
      },
      {
        key: 'delete',
        label: 'Eliminar',
        icon: <DeleteOutlineIcon className="h-5 w-5 fill-red-600" />,
        onClick: () => onDelete?.(singleItem),
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

    return [...defaultActions, ...extraActions].filter(action => action.show !== false);
  }, [userId, ownerId, onEdit, onDelete, onReport, extraActions, singleItem]);

  return menuActions;
};