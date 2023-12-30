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
import Logo from '../components/Logo';
// sections
import { RegisterForm } from '../sections/auth/register';
import AuthSocial from '../sections/auth/AuthSocial';
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
  padding: theme.spacing(8, 0),
  overflow: 'hidden', // Apply overflow: hidden to the content
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

      if (response && response.data && response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Failed to register user');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('An error occurred while processing your request.');
    }
  };

  return (
    <>
      <Page title="Register" sx={{ overflow: 'hidden' }}>
        <RootStyle sx={{ overflow: 'hidden' }}>
          <HeaderStyle>
            <Box
              sx={{
                px: 2.5,
                py: 3,
                display: 'flex',
              }}
            >
              <Logo sx={{ width: '100px', height: '50px' }} />
            </Box>
            {smUp && (
              <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                Already have an account? {''}
                <Link variant="subtitle2" component={RouterLink} to="/login">
                  Login
                </Link>
              </Typography>
            )}
          </HeaderStyle>

          {mdUp && (
            <SectionStyle>
              <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                Manage the link more effectively with Link Exchange
              </Typography>
              <img alt="register" src="/static/illustrations/illustration_register.png" />
            </SectionStyle>
          )}

          <Container sx={{ overflow: 'hidden' }}>
            <ContentStyle>
              <Typography variant="h4" sx={{ mt: 5 }} gutterBottom>
                Sign up to Link Exchange
              </Typography>

              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter your details below.</Typography>

              <RegisterForm onSubmit={handleSubmit} />

              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
                By registering, I agree to Minimal&nbsp;
                <Link underline="always" color="text.primary" href="#">
                  Terms of Service
                </Link>
                {''}and{''}
                <Link underline="always" color="text.primary" href="#">
                  Privacy Policy
                </Link>
                .
              </Typography>

              {!smUp && (
                <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                  Already have an account?{' '}
                  <Link variant="subtitle2" to="/login" component={RouterLink}>
                    Login
                  </Link>
                </Typography>
              )}
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
      <Toaster />
    </>
  );
}
