import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, List, Collapse, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
//
import Iconify from './Iconify';

// ----------------------------------------------------------------------

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  fontSize: '1.1rem',
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func,
};

function NavItem({ item, active }) {
  const theme = useTheme();
  const isActiveRoot = active(item.path);

  const { title, path, icon, info, children } = item;

  const [open, setOpen] = useState(true); // Set the dropdown to always be open

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    borderLeft: '4px solid white', // Add a white left border for active items
  };
  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium',
  };

  // Rest of your component remains unchanged
  // ...

  // The rendering logic for the dropdown and its items
  if (children) {
    return (
      <>
        <ListItemStyle onClick={handleOpen} sx={isActiveRoot ? activeRootStyle : {}}>
          <ListItemIconStyle style={{ color: 'white' }}>{icon && icon}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} style={{ color: 'white' }} />
          {info && info}
          <Iconify
            icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item) => (
              <ListItemStyle
                key={item.title}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: 'black',
                }}
              >
                <ListItemIconStyle style={{ color: 'black' }}>
                  <Box
                    component="span"
                    sx={{
                      width: 4,
                      height: 4,
                      display: 'flex',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: active(item.path) ? 'theme.palette.primary.main' : 'white',
                      transition: (theme) => theme.transitions.create('transform'),
                      ...(active(item.path) && {
                        transform: 'scale(2)',
                        bgcolor: 'primary.main',
                        boxShadow: `0 0 0 2px white`,
                      }),
                    }}
                  />
                </ListItemIconStyle>

                <ListItemText disableTypography primary={item.title} sx={{ color: 'white' }} />
              </ListItemStyle>
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        ...(isActiveRoot && activeRootStyle),
      }}
    >
      <ListItemIconStyle style={{ color: 'white' }}>{icon && icon}</ListItemIconStyle>
      <ListItemText disableTypography primary={title} style={{ color: 'white' }} />
      {info && info}
    </ListItemStyle>
  );
}

NavSection.propTypes = {
  navConfig: PropTypes.array,
};

export default function NavSection({ navConfig, ...other }) {
  const { pathname } = useLocation();

  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {navConfig.map((item) => (
          <NavItem key={item.title} item={item} active={match} />
        ))}
      </List>
    </Box>
  );
}
