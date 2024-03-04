import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Box,
  Button,
  TextField,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import axiosInstance from '../config/AxiosInstanceAdmin';
import Page from '../../components/Page';

export default function Edituser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    email: '',
    phonenumber: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axiosInstance.get(`/signup/users/${userId}`);
        setFormData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...formData,
      };

      const response = await axiosInstance.put(`/Signup/editusers/${userId}`, updatedData);
      if (response.status === 200) {
        navigate('/admin/alluser');
      } else {
        throw new Error('Failed to update website');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <Page title="Update Web Site" sx={{ padding: '25px', overflow: 'hidden' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
            Update Website Info
          </Typography>
          <Card style={{ padding: '20px' }}>
            <TextField
              label="firstname"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="lastname"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="companyname"
              value={formData.companyname}
              onChange={(e) => setFormData({ ...formData, companyname: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="phonenumber"
              value={formData.phonenumber}
              onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              margin="normal"
            />
          </Card>
        </>
      )}
      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button onClick={handleCancel} style={{ marginRight: '20px', color: 'black' }}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={handleUpdate}>
          Update
        </Button>
      </Box>
    </Page>
  );
}
