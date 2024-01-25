// AddWebSite.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button, TextField } from '@mui/material';
import { toast, Toaster } from 'react-hot-toast';

import Page from '../admin/components/Page';

export default function AddWebSite() {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [backlink, setBacklink] = useState('');
  const [showBacklinkBox, setShowBacklinkBox] = useState(false);

  const handleInputChange = (event) => {
    let inputUrl = event.target.value;

    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('http://')) {
      inputUrl = `http://${inputUrl}`;
    }

    setWebsiteUrl(inputUrl);
  };

  const validateUrl = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return urlRegex.test(url);
  };

  const handleAddClick = () => {
    // Validate websiteUrl
    if (!validateUrl(websiteUrl)) {
      toast.error('Please enter a valid main domain URL (e.g., https://www.mydomain.com)', { position: 'top-center' });
      return; // Stop execution if websiteUrl is invalid
    }

    setShowBacklinkBox(true);
  };

  const handleSubmit = () => {
    // Validate websiteUrl
    const urlRegex = /^(ftp|http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!urlRegex.test(websiteUrl)) {
      toast.error('Please enter a valid main domain URL (e.g., https://www.mydomain.com)', { position: 'top-center' });
      return; // Stop execution if websiteUrl is invalid
    }

    // Validate backlink (general URL pattern)
    const backlinkRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!backlinkRegex.test(backlink)) {
      toast.error('Please enter a valid backlink URL', { position: 'top-center' });
      return; // Stop execution if backlink is invalid
    }

    // Proceed with navigation
    navigate(`/user/websiteinfo`, { state: { websiteUrl, backlink } });
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
          <Button variant="contained" color="primary" onClick={handleAddClick} sx={{ flex: 'none', width: '80px' }}>
            Add
          </Button>
        </Box>

        {showBacklinkBox && (
          <>
            <Box display="flex" alignItems="center">
              <TextField
                required
                label="Backlink"
                variant="outlined"
                value={backlink}
                onChange={(event) => setBacklink(event.target.value)}
                sx={{ marginTop: '15px', marginRight: '15px', flex: 1 }}
              />
              <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ flex: 'none', width: '80px' }}>
                Submit
              </Button>
            </Box>
            <Typography variant="body1" sx={{ marginTop: '15px', fontWeight: 'bold' }}>
              Please enter the URL where you added our backlink.
            </Typography>
          </>
        )}

        <Toaster position="top-center" />
      </Page>
    </>
  );
}
