import { Link as RouterLink, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, Box } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { LoginForm } from '../sections/auth/login';
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
    localStorage.setItem("authToken", token);
    try {
      const decodedToken = decodeToken(token);
      console.log('Decoded Token:', decodedToken);
      console.log('User ID:', decodedToken.id.client_id);
      toast.success('Token Decoded Successfully');

      // Store the decoded token in localStorage
      localStorage.setItem('decodedToken', JSON.stringify(decodedToken));
      localStorage.setItem("authToken", token);

      // Perform any further actions with the decoded token if needed
    } catch (error) {
      console.error('Token decoding error:', error);
      toast.error('Failed to decode token');
      // Handle the error or perform additional actions as needed
    }
  };

  const handleSubmit = async (data, e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response);

      if (response && response.data && response.data.success) {
        await toast
          .promise(Promise.resolve(response.data.message), {
            loading: 'Logging in...',
            success: 'User Login Successful',
            error: 'Failed to log in',
          })
          .then(() => {
            navigate('/dashboard/mywebsite');
          });

        const { token } = response.data;
        handleTokenDecoding(token);
      } else {
        toast.error('Failed to log in');
      }
    } catch (error) {
      console.error('Error occurred:', error);

      if (error.response) {
        const statusCode = error.response.status;

        if (statusCode === 404) {
          toast.error('User does not exist');
        } else if (statusCode === 422) {
          toast.error('Wrong password');
        } else {
          toast.error('Failed to log in');
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
                Don’t have an account? {''}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Get started
                </Link>
              </Typography>
            )}
          </HeaderStyle>

          {mdUp && (
            <SectionStyle>
              <Typography variant="h3" sx={{ px: 5, mt: 15, mb: 5  }}>
                Hi, Welcome Back
              </Typography>
              <img src="/static/illustrations/illustration_login.png" alt="login" />
            </SectionStyle>
          )}

          <Container maxWidth="sm">
            <ContentStyle>
              <Typography variant="h4" gutterBottom>
                Sign in to Link Exchange
              </Typography>

              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter your details below.</Typography>

              <LoginForm onSubmit={handleSubmit} />

              {!smUp && (
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  Don’t have an account?{' '}
                  <Link variant="subtitle2" component={RouterLink} to="/register">
                    Get started
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
