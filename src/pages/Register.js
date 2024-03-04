import { Link as RouterLink, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Box } from '@mui/material';
import axiosInstance from '../config/AxiosInstance';

// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import { ReactComponent as Logo } from '../assets/nav-logo.svg';
import  RegisterImage  from '../assets/Work_3-1.webp';
// sections
import { RegisterForm } from '../sections/auth/register';
// import AuthSocial from '../sections/auth/AuthSocial';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(0),
  overflow: 'hidden',
}));

// ----------------------------------------------------------------------

export default function Register() {
  const navigate = useNavigate();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  const handleSubmit = async (data, e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/signup/signup', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response && response.data) {
        if (response.data.success) {
          toast.success(response.data.message);
          navigate('/login');
        } else {
          const errorMessage = response.data.message || 'Failed to register user. Please try again.';
          toast.error(errorMessage);
        }
      } else {
        toast.error('Failed to register user. Please try again.');
      }

      switch (response.status) {
        case 201:
          toast.info('Email already exists.');
          break;
        case 202:
          toast.info('Phone number already exists.');
          break;
        case 203:
          toast.info('User name already exists.');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <>
      <Page title="Register" sx={{ overflow: 'hidden' }}>
        <RootStyle sx={{ overflow: 'hidden' }}>
          <HeaderStyle>
            {smUp && (
              <div
                style={{
                  width: '10%',
                  height: '10%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Logo style={{ width: '100%', height: '100%' }} />
              </div>
            )}
          </HeaderStyle>

          {mdUp && (
            <SectionStyle>
              <Typography variant="h4" sx={{ px: 3, mt: 10, mb: 5 }} style={{color:"#010ED0"}}>
                Manage the link more effectively with Swapalink
              </Typography>
              <img src={RegisterImage} alt="register"  />
            </SectionStyle>
          )}

          <Container sx={{ overflow: 'hidden' }}>
            <ContentStyle>
              <Typography variant="h4" sx={{ mt: 1, mb: 2 }} gutterBottom style={{color:"#010ED0"}}>
                Sign up to Swapalink
              </Typography>

              <RegisterForm onSubmit={handleSubmit} />

              {!smUp && (
                <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                  Already have an account?{' '}
                  <Link variant="subtitle2" to="/login" component={RouterLink}>
                    Login
                  </Link>
                </Typography>
              )}
              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 5 }}>
                {smUp && (
                  <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                    Already have an account? {''}
                    <Link variant="subtitle2" component={RouterLink} to="/login">
                      Login
                    </Link>
                  </Typography>
                )}
              </Typography>
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
      <Toaster />
    </>
  );
}
