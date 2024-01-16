import { useState } from 'react';
import {
  Card,
  Stack,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import axiosInstance from '../../config/AxiosInstance';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangePassword = async () => {
    try {
      const decodedToken = localStorage.getItem('decodedToken');
      const parsedToken = JSON.parse(decodedToken);
      const adminId = parsedToken.userId?.user_id;

      const response = await axiosInstance.put(`/adminsignup/adminchangepassword/${adminId}`, {
        oldPassword,
        newPassword,
      });

      console.log(response.data);

      // Remove tokens from local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('decodedToken');

      // Navigate to adminlogin
      navigate('/adminlogin');

      // Add logic to handle success, show messages, or redirect as needed
    } catch (error) {
      console.error('Error changing password:', error.response?.data || error.message);
      // Add logic to handle errors, show error messages, etc.
    }
  };

  return (
    <Page title="Change Password">
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: isSmallScreen ? '100%' : '50%' }}>
          <Stack spacing={3} p={4}>
            <Typography variant="h4" gutterBottom>
              Change Password
            </Typography>

            <TextField
              fullWidth
              type={showOldPassword ? 'text' : 'password'}
              label="Old Password"
              variant="outlined"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                      {showOldPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button variant="contained" color="primary" onClick={handleChangePassword}>
              Change Password
            </Button>
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
