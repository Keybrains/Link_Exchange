import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Grid, Card, CardActionArea, CardMedia } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import axiosInstance from '../../config/AxiosInstance';
import './DashboardStyles.css';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const basePath = 'https://propertymanager.cloudpress.host/api/images/upload/images/';
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/projects/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <RootStyle>
      {/* <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 2, mt: 2 }}>
        {projects.map((project, index) => (
          <Box
            key={project._id} // Assuming each project has a unique _id for the key
            component="img"
            src={`${basePath}${project.image}`} // Use `src` instead of `image` for img elements
            alt="Uploaded Image"
            className="project-image"
            sx={{
              height: 'auto', // Maintain aspect ratio
              padding: '10px', // If you still want padding around the images, adjust as needed
              '&:hover': {
                opacity: 0.7, // Example hover effect, adjust or remove as needed
              },
            }}
            onClick={() => window.open(project.url, '_blank')}
          />
        ))}
      </Stack> */}

      <ToolbarStyle sx={{ pb: 2, pt: 2 }} style={{ paddingTop: '20px' }}>
        <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }} style={{ marginBottom: '50px' }}>
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
