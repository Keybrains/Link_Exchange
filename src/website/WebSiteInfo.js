import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

import Page from '../admin/components/Page';

export default function WebSiteInfo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  });

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handleSubmit = () => {
    console.log(formData);
    navigate('/user/mywebsite');
  };

  const handlePayment = () => {
    // Handle payment process (e.g., integrate PayPal)
    // Redirect to payment gateway or show payment modal
    console.log('Redirecting to payment gateway...');
  };

  return (
    <>
      <Page title="Add Web Site" sx={{ padding: '25px', overflow: 'hidden' }}>
        <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
          Add your website info
        </Typography>
        <Card style={{ padding: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <TextField
                  label="Monthly organic visits"
                  value={formData.monthlyVisits}
                  onChange={handleChange('monthlyVisits')}
                  required
                  fullWidth
                  margin="normal"
                />
                <TextField label="DA" value={formData.DA} onChange={handleChange('DA')} fullWidth margin="normal" />
                <TextField
                  label="Spam Score"
                  value={formData.spamScore}
                  onChange={handleChange('spamScore')}
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Number of Backlinks Allowed*
                  </InputLabel>
                  <Select value={formData.backlinksAllowed} onChange={handleChange('backlinksAllowed')}>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Cost of adding backlink*
                  </InputLabel>
                  <Select value={formData.costOfAddingBacklink} onChange={handleChange('costOfAddingBacklink')}>
                    <MenuItem value="Free">Free</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                  </Select>
                </FormControl>
                {formData.costOfAddingBacklink === 'Paid' && (
                  <TextField
                    label="Charges $"
                    value={formData.charges}
                    onChange={handleChange('charges')}
                    fullWidth
                    margin="normal"
                  />
                )}
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Category*
                  </InputLabel>
                  <Select value={formData.categories} onChange={handleChange('categories')} multiple>
                    <MenuItem value="Category1">Category1</MenuItem>
                    <MenuItem value="Category2">Category2</MenuItem>
                    {/* Add more categories */}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Link Type*
                  </InputLabel>
                  <Select value={formData.linkType} onChange={handleChange('linkType')}>
                    <MenuItem value="DoFollow">Do Follow</MenuItem>
                    <MenuItem value="NoFollow">No Follow</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Country*
                  </InputLabel>
                  <Select value={formData.country} onChange={handleChange('country')}>
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="UK">UK</MenuItem>
                    {/* Add more countries */}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Language*
                  </InputLabel>
                  <Select value={formData.language} onChange={handleChange('language')}>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                    {/* Add more languages */}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Link time*
                  </InputLabel>
                  <Select value={formData.linkTime} onChange={handleChange('linkTime')}>
                    <MenuItem value="Specific time in days">Specific time in days</MenuItem>
                    <MenuItem value="Forever">Forever</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Does your website surface in Google News
                  </InputLabel>
                  <Select value={formData.surfaceInGoogleNews} onChange={handleChange('surfaceInGoogleNews')}>
                    <MenuItem>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'end',
            }}
          >
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
          {formData.isPaid && (
            <Box
              sx={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* Payment related components */}
              <Typography>Please proceed to payment of ${formData.charges}</Typography>
              <Button variant="contained" onClick={handlePayment}>
                Proceed to Payment
              </Button>
            </Box>
          )}
        </Card>
      </Page>
    </>
  );
}
