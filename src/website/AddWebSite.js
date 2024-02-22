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

    if (!inputUrl.startsWith('https://') && !inputUrl.startsWith('https://')) {
      inputUrl = `https://${inputUrl}`;
    }

    setWebsiteUrl(inputUrl);
  };

  const validateUrl = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return urlRegex.test(url);
  };

  const handleAddClick = () => {
    if (!validateUrl(websiteUrl)) {
      toast.error('Please enter a valid main domain URL (e.g., https://www.mydomain.com)', { position: 'top-center' });
      return; 
    }
    setShowBacklinkBox(true);
  };

  const handleSubmit = () => {
    const urlRegex = /^(ftp|http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!urlRegex.test(websiteUrl)) {
      toast.error('Please enter a valid main domain URL (e.g., https://www.mydomain.com)', { position: 'top-center' });
      return;
    }

    const backlinkRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!backlinkRegex.test(backlink)) {
      toast.error('Please enter a valid backlink URL', { position: 'top-center' });
      return;
    }

    navigate(`/user/websiteinfo`, { state: { websiteUrl, backlink } });
  };

  return (
    <>
      <Page title="Add URL" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
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
              Please give a do-follow backlink to our Go Program page with the URL
              https://keybrainstech.com/go-project-by-key-brains/ (Anchor Text as Free Backlinks) . Once you add our
              link on any page of yours please enter the page URL where the backlink has been given. This is to prove
              that you have the authority to add or manage backlinks on your website. It should be the same website
              which you entered for backlink. Do not remove the URL until you wish to use our system.
            </Typography>
          </>
        )}

        <Toaster position="top-center" />
      </Page>
    </>
  );
}
