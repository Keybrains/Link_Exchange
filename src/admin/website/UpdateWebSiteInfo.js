import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Grid,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from '../config/AxiosInstanceAdmin';

import Page from '../../components/Page';

export default function UpdateWebSiteInfo() {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    _id: '',
    user_id: '',
    website_id: '',
    url: '',
    monthlyVisits: '',
    DA: '',
    spamScore: '',
    categories: [],
    linkType: '',
    country: '',
    language: '',
    surfaceInGoogleNews: false,
    backlinksAllowed: '',
    costOfAddingBacklink: '',
    charges: '',
    linkTime: '',
    isPaid: false,
    createAt: '',
    updateAt: '',
    approved: false,
    __v: 0,
  });

  useEffect(() => {
    async function fetchWebsiteData() {
      try {
        const response = await axiosInstance.get(`website/websites/${websiteId}`);
        if (response.status === 200) {
          setFormData(response.data.data);
          console.log(response.data.data, 'response.data.data');
          setLoading(false);
        } else {
          throw new Error('Failed to fetch website data');
        }
      } catch (error) {
        console.error(error);
        setLoading(false);

        // Handle error state if needed
      }
    }

    fetchWebsiteData();
  }, [websiteId]);

  const handleUpdate = async () => {
    try {
      const response = await axiosInstance.put(`website/websites/${websiteId}`, formData);
      if (response.status === 200) {
        navigate('/admin/freewebsite');
      } else {
        throw new Error('Failed to update website');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    }
  };
  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous location
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
              label="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Monthly organic visits"
              value={formData.monthlyVisits}
              onChange={(e) => setFormData({ ...formData, monthlyVisits: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="DA"
              value={formData.DA}
              onChange={(e) => setFormData({ ...formData, DA: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Spam Score"
              value={formData.spamScore}
              onChange={(e) => setFormData({ ...formData, spamScore: e.target.value })}
              fullWidth
              margin="normal"
            />
            {/* Add other form fields */}

            <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
              <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                Number of Backlinks Allowed*
              </InputLabel>
              <Select
                value={formData.backlinksAllowed}
                onChange={(e) => setFormData({ ...formData, backlinksAllowed: e.target.value })}
                labelId="backlinksAllowed"
                id="backlinksAllowed"
                label="backlinksAllowed"
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
              <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                Cost of adding backlink*
              </InputLabel>
              <Select
                value={formData.costOfAddingBacklink}
                onChange={(e) => setFormData({ ...formData, costOfAddingBacklink: e.target.value })}
                labelId="costOfAddingBacklink"
                id="costOfAddingBacklink"
                label="costOfAddingBacklink"
              >
                <MenuItem value="Free">Free</MenuItem>

                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
            </FormControl>
            {formData.costOfAddingBacklink === 'Paid' && (
              <TextField
                label="Charges $"
                value={formData.charges}
                onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                fullWidth
                margin="normal"
              />
            )}

            <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
              <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                Link Type
              </InputLabel>
              <Select
                value={formData.linkType}
                onChange={(e) => setFormData({ ...formData, linkType: e.target.value })}
                labelId="linkType"
                id="linkType"
                label="linkType"
              >
                <MenuItem value="DoFollow">Do Follow</MenuItem>
                <MenuItem value="NoFollow">No Follow</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
              <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                Country
              </InputLabel>
              <Select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                labelId="country"
                id="country"
                label="country"
              >
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="UK">UK</MenuItem>
                <MenuItem value="India">India</MenuItem>
                {/* Add more countries */}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
              <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                Language
              </InputLabel>
              <Select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                labelId="language"
                id="language"
                label="language"
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="Spanish">Hindi</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
              <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                Category*
              </InputLabel>
              <Select
                value={formData.categories}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                multiple
                labelId="categories"
                id="categories"
                label="categories"
              >
                <MenuItem value="Category1">Category1</MenuItem>
                <MenuItem value="Category2">Category2</MenuItem>
                {/* Add more categories */}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
              <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                Link time*
              </InputLabel>
              <Select
                value={formData.linkTime}
                onChange={(e) => setFormData({ ...formData, linkTime: e.target.value })}
                labelId="linkTime"
                id="linkTime"
                label="linkTime"
              >
                <MenuItem value="Specific time in days">Specific time in days</MenuItem>
                <MenuItem value="Forever">Forever</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
              <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                Does your website surface in Google News
              </InputLabel>
              <Select
                value={formData.surfaceInGoogleNews}
                onChange={(e) => setFormData({ ...formData, surfaceInGoogleNews: e.target.value })}
                labelId="surfaceInGoogleNews"
                id="surfaceInGoogleNews"
                label="surfaceInGoogleNews"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
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
              <Button
                variant="outlined"
                onClick={handleUpdate}
                // sx={{
                //   backgroundColor: 'lightblue', // Change this to the color you prefer
                //   color: 'black', // Text color
                //   '&:hover': {
                //     // backgroundColor: 'black', // Change this to the color you prefer on hover
                //     color:"white"
                //   },
                // }}
              >
                Update
              </Button>
            </Box>
          </Card>
        </>
      )}
    </Page>
  );
}
