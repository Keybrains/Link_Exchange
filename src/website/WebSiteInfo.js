import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import iso6391 from 'iso-639-1';
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
  Grid,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from '@mui/material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../config/AxiosInstance';
import Page from '../admin/components/Page';

export default function WebSiteInfo() {
  const countryCodes = Object.keys(countries);
  const countryNames = countryCodes.map((code) => countries[code].name);
  const languageCodes = iso6391.getAllCodes();
  const languageNames = languageCodes.map((code) => iso6391.getName(code));
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: '',
    url: '',
    monthlyVisits: '',
    DA: '',
    spamScore: '',
    categories: [],
    linkType: '',
    country: '',
    language: '',
    surfaceInGoogleNews: '',
    backlinksAllowed: '',
    costOfAddingBacklink: '',
    charges: '',
    linkTime: '',
    isPaid: false,
  });

  const schema = yup.object().shape({
    monthlyVisits: yup.string().required('Monthly organic visits is required'),
    DA: yup.number().required('DA is required').min(1, 'DA must be at least 1').max(100, 'DA must be at most 100'),
    spamScore: yup
      .number()
      .required('Spam Score is required')
      .min(1, 'Spam Score must be at least 1')
      .max(100, 'Spam Score must be at most 100'),
    backlinksAllowed: yup.string().required('Number of Backlinks Allowed is required'),
    costOfAddingBacklink: yup.string().required('Cost of adding backlink is required'),
    charges: yup.string().when('costOfAddingBacklink', {
      is: 'Paid',
      then: yup.string().required('Charges are required for paid backlinks'),
    }),
    categories: yup
      .array()
      .min(1, 'Please select at least one category')
      .required('Please select at least one category'),
    linkType: yup.string().required('Link Type is required'),
    country: yup.string().required('Country is required'),
    language: yup.string().required('Language is required'),
    linkTime: yup.string().required('Link time is required'),
  });

  const validateForm = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      return true;
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((e) => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  useEffect(() => {
    const decodedToken = localStorage.getItem('decodedToken');

    if (decodedToken) {
      const parsedToken = JSON.parse(decodedToken);
      const userId = parsedToken.userId?.user_id;
      setFormData((prevData) => ({ ...prevData, user_id: userId }));
    }

    const queryParams = new URLSearchParams(location.search);
    const urlParam = queryParams.get('url');

    if (urlParam) {
      setFormData((prevData) => ({ ...prevData, url: urlParam }));
    }
  }, [location.search]);

  const getCountryFullName = (countryCode) => {
    return countries[countryCode]?.name || '';
  };

  const getLanguageFullName = (languageCode) => {
    return iso6391.getName(languageCode) || '';
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        const fullCountryName = getCountryFullName(formData.country);
        const fullLanguageName = getLanguageFullName(formData.language);

        const dataToSend = {
          ...formData,
          country: fullCountryName,
          language: fullLanguageName,
        };

        const response = await axiosInstance.post('/website/website', dataToSend);
        console.log('Response:', response.data);
        navigate('/user/pendingapproval');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
          toast.error(`The URL is already exists`);
        } else {
          toast.error('Error occurred');
          console.error('Error:', error);
        }
      }
    }
  };

  const handlePayment = () => {
    console.log('Redirecting to payment gateway...');
  };

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setErrors({ ...errors, country: '' });
    setFormData({ ...formData, country: selectedCountry });
  };

  //--------------------------
  const [openDialog, setOpenDialog] = useState(false);
  const [daysInput, setDaysInput] = useState('');

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
    setErrors({ ...errors, [prop]: '' });

    if (event.target.value === 'Specific time in days') {
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDaysInputChange = (event) => {
    setDaysInput(event.target.value);
  };

  const handleDaysInputConfirm = () => {
    setOpenDialog(false);
    const specificTimeInDays = daysInput !== '' ? `${daysInput} days` : 'Forever';
    setFormData({ ...formData, linkTime: specificTimeInDays });
    setDaysInput('');
  };

  return (
    <>
      <Page title="Other Detail" sx={{ padding: '25px', overflow: 'hidden' }}>
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
                  required
                  onChange={handleChange('monthlyVisits')}
                  fullWidth
                  margin="normal"
                  error={Boolean(errors?.monthlyVisits)}
                  helperText={errors?.monthlyVisits || ''}
                />
                <TextField
                  label="DA"
                  required
                  value={formData.DA}
                  onChange={handleChange('DA')}
                  fullWidth
                  margin="normal"
                  error={Boolean(errors?.DA)}
                  helperText={errors?.DA || ''}
                />
                <TextField
                  label="Spam Score"
                  required
                  value={formData.spamScore}
                  onChange={handleChange('spamScore')}
                  fullWidth
                  margin="normal"
                  error={Boolean(errors?.spamScore)}
                  helperText={errors?.spamScore || ''}
                />
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Number of Backlinks Allowed*
                  </InputLabel>
                  <Select
                    value={formData.backlinksAllowed}
                    onChange={handleChange('backlinksAllowed')}
                    error={Boolean(errors?.backlinksAllowed)}
                    labelId="backlinksAllowed"
                    id="backlinksAllowed"
                    label="backlinksAllowed"
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                  </Select>
                  {errors?.backlinksAllowed && (
                    <Typography variant="caption" color="error">
                      {errors.backlinksAllowed}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Cost of adding backlink*
                  </InputLabel>
                  <Select
                    value={formData.costOfAddingBacklink}
                    onChange={handleChange('costOfAddingBacklink')}
                    error={Boolean(errors?.costOfAddingBacklink)} // Add error handling
                    labelId="costOfAddingBacklink"
                    id="costOfAddingBacklink"
                    label="costOfAddingBacklink"
                  >
                    <MenuItem value="Free">Free</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                  </Select>
                  {errors?.costOfAddingBacklink && ( // Display error message if present
                    <Typography variant="caption" color="error">
                      {errors.costOfAddingBacklink}
                    </Typography>
                  )}
                </FormControl>
                {formData.costOfAddingBacklink === 'Paid' && (
                  <TextField
                    label="Charges $"
                    value={formData.charges}
                    onChange={handleChange('charges')}
                    fullWidth
                    margin="normal"
                    error={Boolean(errors?.charges)} // Add error handling
                    helperText={errors?.charges || ''} // Display helper text for the error
                  />
                )}
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Category*
                  </InputLabel>
                  <Select
                    value={formData.categories}
                    onChange={handleChange('categories')}
                    multiple
                    error={Boolean(errors?.categories)} // Add error handling for categories
                    labelId="categories"
                    id="categories"
                    label="categories"
                  >
                    <MenuItem value="Category1">Category1</MenuItem>
                    <MenuItem value="Category2">Category2</MenuItem>
                    {/* Add more categories */}
                  </Select>
                  {errors?.categories && ( // Display error message if present
                    <Typography variant="caption" color="error">
                      {errors.categories}
                    </Typography>
                  )}
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Link Type*
                  </InputLabel>
                  <Select
                    value={formData.linkType}
                    onChange={handleChange('linkType')}
                    error={Boolean(errors?.linkType)} // Error handling for linkType
                    labelId="linkType"
                    id="linkType"
                    label="linkType"
                  >
                    <MenuItem value="DoFollow">Do Follow</MenuItem>
                    <MenuItem value="NoFollow">No Follow</MenuItem>
                  </Select>
                  {errors?.linkType && ( // Display error message if present
                    <Typography variant="caption" color="error">
                      {errors.linkType}
                    </Typography>
                  )}
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Country*
                  </InputLabel>
                  <Select
                    value={formData.country}
                    onChange={handleCountryChange}
                    error={Boolean(errors?.country)} // Error handling for country
                    labelId="country"
                    id="country"
                    label="country"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: '200px', // Set your desired height
                          width: '150px', // Set your desired width
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                  >
                    <MenuItem value="IN">India</MenuItem>
                    <MenuItem value="" aria-label="None" />

                    {countryCodes
                      .filter((code) => code !== 'IN') // Exclude India from the list
                      .map((code, index) => (
                        <MenuItem key={code} value={code}>
                          {countryNames[index]}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors?.country && (
                    <Typography variant="caption" color="error">
                      {errors.country}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Language*
                  </InputLabel>
                  <Select
                    value={formData.language}
                    onChange={handleChange('language')}
                    error={Boolean(errors?.language)} // Error handling for language
                    labelId="language"
                    id="language"
                    label="language"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: '200px', // Set your desired height
                          width: '150px', // Set your desired width
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                  >
                    {languageCodes.map((code, index) => (
                      <MenuItem key={code} value={code}>
                        {languageNames[index]}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors?.language && ( // Display error message if present
                    <Typography variant="caption" color="error">
                      {errors.language}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Link time*
                  </InputLabel>
                  <Select
                    value={formData.linkTime}
                    onChange={handleChange('linkTime')}
                    error={Boolean(errors?.linkTime)}
                    labelId="linkTime"
                    id="linkTime"
                    label="linkTime"
                  >
                    <MenuItem value="Specific time in days">Specific time in days</MenuItem>
                    <MenuItem value="Forever">Forever</MenuItem>
                    {formData.linkTime !== 'Forever' && formData.linkTime !== 'Specific time in days' && (
                      <MenuItem value={formData.linkTime}>{formData.linkTime}</MenuItem>
                    )}
                  </Select>

                  {errors?.linkTime && (
                    <Typography variant="caption" color="error">
                      {errors.linkTime}
                    </Typography>
                  )}
                </FormControl>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>Enter Number of Days</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Days"
                      type="number"
                      fullWidth
                      value={daysInput}
                      onChange={handleDaysInputChange}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleDaysInputConfirm}>Confirm</Button>
                  </DialogActions>
                </Dialog>

                <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
                  <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                    Does your website surface in Google News
                  </InputLabel>
                  <Select
                    value={formData.surfaceInGoogleNews}
                    onChange={handleChange('surfaceInGoogleNews')}
                    labelId="surfaceInGoogleNews"
                    id="surfaceInGoogleNews"
                    label="surfaceInGoogleNews"
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
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
      <Toaster />
    </>
  );
}
