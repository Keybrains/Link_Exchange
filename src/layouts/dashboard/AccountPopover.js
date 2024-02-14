import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
// import account from '../../_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  // {
  //   label: 'Account Setting',
  //   icon: 'eva:home-fill',
  //   linkTo: '#',
  // },
  // {
  //   label: 'My Rating & Reviews',
  //   icon: 'eva:person-fill',
  //   linkTo: '#',
  // },
  // {
  //   label: 'Referral Program',
  //   icon: 'eva:settings-2-fill',
  //   linkTo: '#',
  // },
  // {
  //   label: 'Switch To Buyer',
  //   icon: 'eva:settings-2-fill',
  //   linkTo: '#',
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const getLightColor = () => {
    const storedColor = localStorage.getItem('lightColor');
    if (storedColor) {
      return storedColor;
    }

    const letters = 'ABCDEF';
    let lightColor = '#';
    for (let i = 0; i < 3; i += 1) {
      lightColor += letters[Math.floor(Math.random() * letters.length)];
    }

    localStorage.setItem('lightColor', lightColor);
    return lightColor;
  };

  const getBrightColor = () => {
    const storedColor = localStorage.getItem('brightColor');
    if (storedColor) {
      return storedColor;
    }

    const letters = '89ABCDEF';
    let brightColor = '#';
    for (let i = 0; i < 3; i += 1) {
      brightColor += letters[Math.floor(Math.random() * letters.length)];
    }

    localStorage.setItem('brightColor', brightColor);
    return brightColor;
  };

  useEffect(() => {
    // Retrieve decodedToken from localStorage
    const decodedToken = localStorage.getItem('decodedToken');
    if (decodedToken) {
      const parsedToken = JSON.parse(decodedToken);
      const { userId } = parsedToken;

      // Extracting firstname, lastname, and email from userId in decodedToken
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

  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('decodedToken');
    navigate('/login');

    handleClose();
  };
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    // Retrieve decodedToken from localStorage
    const decodedToken = localStorage.getItem('decodedToken');
    if (decodedToken) {
      const parsedToken = JSON.parse(decodedToken);
      const { userId } = parsedToken;

      // Extracting firstname, lastname, and email from userId in decodedToken
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
            backgroundColor: getLightColor(), // Use light color for background
            color: getBrightColor(), // Use bright color for text
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

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

        {/* <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
