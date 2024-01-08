// AddWebSite.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button, TextField } from '@mui/material';
import { toast, Toaster } from 'react-hot-toast';

import Page from '../admin/components/Page';

export default function AddWebSite() {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleInputChange = (event) => {
    setWebsiteUrl(event.target.value);
  };

  const handleSubmit = () => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlRegex.test(websiteUrl)) {
      // URL is not valid, show toast notification
      toast.error('Please enter a valid URL', { position: 'top-center' });
    } else {
      // URL is valid, proceed with navigation
      console.log('Submitted URL:', websiteUrl);
      navigate(`/user/websiteinfo?url=${encodeURIComponent(websiteUrl)}`);
    }
  };

  return (
    <>
      <Page title="Add URL" sx={{ padding: '25px', overflow: 'hidden' }}>
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
          <Toaster position="top-center" />
        </Box>
      </Page>
      <Toaster />
    </>
  );
}
