import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MenuAction } from '@/interfaces/types';

interface VerticalMenuProps {
  actions: MenuAction[];
  buttonClassName?: string;
  menuClassName?: string;
  maxHeight?: number;
  width?: string;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({
  actions,
  buttonClassName = "m-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
  menuClassName = "",
  maxHeight = 216,
  width = "20ch"
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: MenuAction) => {
    action.onClick();
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        className={buttonClassName}
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className={menuClassName}
        PaperProps={{
          style: {
            maxHeight,
            width,
          },
        }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.key}
            onClick={() => handleMenuItemClick(action)}
            className={action.className}
          >
            {action.icon && (
              <span className="mr-2 flex items-center">{action.icon}</span>
            )}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default VerticalMenu;