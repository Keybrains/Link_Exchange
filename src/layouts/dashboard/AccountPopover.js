import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [userInfo, setUserInfo] = useState({});
  const [open, setOpen] = useState(null);
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const decodedToken = localStorage.getItem('decodedToken');
    if (decodedToken) {
      const parsedToken = JSON.parse(decodedToken);
      const { userId } = parsedToken;
      setUserInfo({
        firstname: userId.firstname,
        lastname: userId.lastname,
        email: userId.email,
      });
    }
  }, []);

  const getInitials = () => {
    const { firstname, lastname } = userInfo || {};
    return `${firstname ? firstname.charAt(0) : ''}${lastname ? lastname.charAt(0) : ''}`;
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('decodedToken');
    navigate('/login');

    handleClose();
  };

  useEffect(() => {
    const decodedToken = localStorage.getItem('decodedToken');
    if (decodedToken) {
      const parsedToken = JSON.parse(decodedToken);
      const { userId } = parsedToken;
      setUserInfo({
        firstname: userId.firstname,
        lastname: userId.lastname,
        email: userId.email,
      });
    }
  }, []);

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar
          sx={{
            fontSize: '1.1rem',
            backgroundColor: '#010ED0',
            color: '#fffff',
          }}
        >
          {getInitials()}
        </Avatar>
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userInfo.firstname} {userInfo.lastname}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userInfo.email}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
