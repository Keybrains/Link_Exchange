import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import axiosInstance from '../config/AxiosInstance';

export default function AddWebSite() {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleInputChange = (event) => {
    setWebsiteUrl(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Simulating example form data
      const formData = {
        monthlyVisits: 10000,
        DA: 40,
        spamScore: 5,
        categories: ['Category1', 'Category2'],
        linkType: 'DoFollow',
        country: 'USA',
        language: 'English',
        surfaceInGoogleNews: true,
        backlinksAllowed: 3,
        costOfAddingBacklink: 'Paid',
        charges: 50,
        linkTime: 'Forever',
        isPaid: true,
      };

      const response = await axiosInstance.post('/website/website', {
        url: websiteUrl,
        formData,
      });

      console.log('Response:', response.data);
      navigate('/user/websiteinfo');
    } catch (error) {
      console.error('Error:', error);
      // Handle error state
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Add Website's
      </Typography>
      <Box display="flex" alignItems="center">
        <TextField
          required
          label="URL"
          variant="outlined"
          value={websiteUrl}
          onChange={handleInputChange}
          sx={{ marginRight: '15px', flex: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ flex: 'none' }}>
          Submit
        </Button>
      </Box>
    </>
  );
}
