import { Link as RouterLink, useNavigate } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Box } from '@mui/material';
import axiosInstance from '../config/AxiosInstance';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';

import { ReactComponent as Logo } from '../assets/SWAPALINKLOGO.svg';
import  LoginImage  from '../assets/build-a-single-page-application.webp';

// sections
import { LoginForm } from '../sections/auth/login';

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
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const navigate = useNavigate();
  
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Failed to decode token');
    }
  };

  const handleTokenDecoding = (token) => {
    localStorage.setItem('authToken', token);
    try {
      const decodedToken = decodeToken(token);
      toast.success('Token Decoded Successfully');
      const decodedTokenString = JSON.stringify(decodedToken);
      localStorage.setItem('decodedToken', decodedTokenString);
    } catch (error) {
      console.error('Token decoding error:', error);
      toast.error('Failed to decode token');
    }
  };

  const handleSubmit = async (data, e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/signup/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response && response.data && response.data.success) {
        if (response.data.data.status === 'deactivate') {
          toast.error('Your account is deactivated');
        } else {
          await toast.promise(Promise.resolve(response.data.message), {
            loading: 'Logging in...',
            success: 'User Login Successful',
            error: 'Failed to log in',
          });
          navigate('/user/userdashboard');

          const { token } = response.data;
          handleTokenDecoding(token);
        }
      } else {
        toast.error('Failed to log in');
      }
    } catch (error) {
      console.error('Error occurred:', error);

      if (error.response) {
        const statusCode = error.response.status;

        if (statusCode === 404) {
          toast.error('User not found. Please check your email or username.');
        } else if (statusCode === 422) {
          toast.error('Incorrect username or password. Please try again.');
        } else {
          toast.error('Failed to log in. Please try again later.');
        }
      } else {
        toast.error('An error occurred while processing your request.');
      }
    }
  };

  return (
    <>
      <Page title="Login">
        <RootStyle>
          <HeaderStyle>
            {smUp && (
              <div
                style={{
                  width: '13%',
                  height: '13%',
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
              <Typography variant="h3" sx={{ px: 5, mt: 0, mb: 10 }} style={{color:"#010ED0"}}>
                Hi, Welcome Back
              </Typography>
              <img src={LoginImage} alt="login"  />
            </SectionStyle>
          )}

          <Container maxWidth="sm">
            <ContentStyle>
              <Typography variant="h4" gutterBottom style={{color:"#010ED0"}}>
                Sign in to Swapalink
              </Typography>

              <Typography sx={{ color: 'text.secondary', mb: 5 }} style={{color:"#010ED0"}}>Enter your details below.</Typography>

              <LoginForm onSubmit={handleSubmit} />

              {!smUp && (
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  Don’t have an account?{' '}
                  <Link variant="subtitle2" component={RouterLink} to="/register">
                    Get started
                  </Link>
                </Typography>
              )}

              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 5 }}>
                {smUp && (
                  <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                    Don’t have an account? {''}
                    <Link variant="subtitle2" component={RouterLink} to="/register">
                      Get started
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
