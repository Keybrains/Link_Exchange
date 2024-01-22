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
    let inputUrl = event.target.value;

    if (!inputUrl.startsWith('https://') && !inputUrl.startsWith('http://')) {
      inputUrl = `https://${inputUrl}`;
    }

    setWebsiteUrl(inputUrl);
  };

  const handleSubmit = () => {
    // Regular expression to match valid main domain URLs (e.g., www.mydomain.com)
    const urlRegex = /^(ftp|http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!urlRegex.test(websiteUrl)) {
      // URL is not valid, show toast notification
      toast.error('Please enter a valid main domain URL (e.g., https://www.mydomain.com)', { position: 'top-center' });
    } else {
      // URL is valid, proceed with navigation
    
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
