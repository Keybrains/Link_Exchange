import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Container, Typography, Box } from '@mui/material';
import axiosInstance from '../config/AxiosInstanceAdmin';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import { ReactComponent as Logo } from '../../assets/nav-logo.svg';
// sections
import AdminLoginForm from '../sections/auth/login/AdminLoginForm';

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

export default function AdminLogin() {
  const navigate = useNavigate();

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
      const response = await axiosInstance.post('/adminsignup/adminlogin', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response && response.data && response.data.success) {
        await toast
          .promise(Promise.resolve(response.data.message), {
            loading: 'Logging in...',
            success: 'User Login Successful',
            error: 'Failed to log in',
          })
          .then(() => {
            navigate('/admin/admindashboard');
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
      <Page title="Admin Login">
        <RootStyle>
          <HeaderStyle>
            <div
              style={{
                width: '15%',
                height: '15%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Logo style={{ width: '100%', height: '100%' }} />
            </div>
          </HeaderStyle>

          {mdUp && (
            <SectionStyle sx={{ px: 5, mt: 15, mb: 5 }}>
              <img src="/static/illustrations/illustration_adminlogin.png" alt="login" />
            </SectionStyle>
          )}

          <Container maxWidth="sm">
            <ContentStyle>
              <Typography variant="h4" align="center" sx={{ mb: 5 }} gutterBottom style={{ color: '#010ED0' }}>
                Admin Login
              </Typography>

              <AdminLoginForm onSubmit={handleSubmit} />
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
      <Toaster />
    </>
  );
}
