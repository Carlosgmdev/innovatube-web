import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Stack, Typography } from '@mui/material';
import useAuthStore from '../store/useAuthStore';
import { eraseCookie } from '../utils/Cookies';

export default function AvatarMenu() {
  const { user } = useAuthStore()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    setAnchorEl(null)
    localStorage.removeItem('user')
    eraseCookie('jwtToken')
    window.location.href = '/login'
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
      <Typography variant='body1' sx={{ marginRight: 1}}>{`${user?.firstName} ${user?.lastName}`}</Typography>
      <Stack
        direction="row"
        spacing={2}
      >
        <Avatar></Avatar>
      </Stack>
      </Button>
      <Menu
        id="basic-menu"        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
      </Menu>
    </div>
  );
}