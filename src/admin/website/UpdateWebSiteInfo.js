import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Autocomplete,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import axiosInstance from '../config/AxiosInstanceAdmin';
import Page from '../../components/Page';

export default function UpdateWebSiteInfo() {
  const countryCodes = Object.keys(countries);
  const languageCodes = iso6391.getAllCodes();
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [daysInput, setDaysInput] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const [formData, setFormData] = useState({
    _id: '',
    user_id: '',
    website_id: '',
    url: '',
    backlink: '',
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
          const countryShortName = Object.keys(countries).find(
            (code) => countries[code].name === response.data.data.country
          );
          const languageShortName = iso6391.getCode(response.data.data.language);

          setFormData({
            ...response.data.data,
            country: countryShortName,
            language: languageShortName,
          });

          setLoading(false);
        } else {
          throw new Error('Failed to fetch website data');
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    fetchWebsiteData();
  }, [websiteId]);

  const handleUpdate = async () => {
    try {
      const countryFullName = countries[formData.country].name;
      const languageFullName = iso6391.getName(formData.language);

      const updatedData = {
        ...formData,
        country: countryFullName,
        language: languageFullName,
      };

      const response = await axiosInstance.put(`website/updatewebsites/${websiteId}`, updatedData);
      if (response.status === 200) {
        navigate('/admin/freewebsite');
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categorys/categories');
        setCategoriesList(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

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
              label="Backlink"
              value={formData.backlink}
              onChange={(e) => setFormData({ ...formData, backlink: e.target.value })}
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
            <FormControl fullWidth margin="normal">
              <Autocomplete
                value={formData.country}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, country: newValue });
                }}
                id="country-combo-box"
                options={countryCodes}
                getOptionLabel={(option) => countries[option].name}
                renderInput={(params) => <TextField {...params} label="Country" />}
                sx={{ '& .MuiInput-root': { marginTop: '18px' } }}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Autocomplete
                value={formData.language}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, language: newValue });
                }}
                id="language-combo-box"
                options={languageCodes}
                getOptionLabel={(option) => iso6391.getName(option)}
                renderInput={(params) => <TextField {...params} label="Language" />}
                sx={{ '& .MuiInput-root': { marginTop: '18px' } }}
              />
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
                {categoriesList.map((category) => (
                  <MenuItem key={category.id} value={category.category}>
                    {category.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ '& .MuiInput-root': { marginTop: '18px' } }}>
              <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                Link time*
              </InputLabel>
              <Select
                value={formData.linkTime}
                onChange={(e) => {
                  setFormData({ ...formData, linkTime: e.target.value });
                  if (e.target.value === 'Specific time in days') {
                    setOpenDialog(true);
                  }
                }}
                labelId="linkTime"
                id="linkTime"
                label="linkTime"
              >
                <MenuItem value="Forever">Forever</MenuItem>
                <MenuItem value="Specific time in days">Specific time in days</MenuItem>
                {formData.linkTime !== 'Forever' && formData.linkTime !== 'Specific time in days' && (
                  <MenuItem value={formData.linkTime}>{formData.linkTime}</MenuItem>
                )}
              </Select>
            </FormControl>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>Enter Number of Days</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Days"
                  type="number"
                  fullWidth
                  value={daysInput}
                  onChange={(e) => setDaysInput(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button
                  onClick={() => {
                    setOpenDialog(false);
                    const specificTimeInDays = daysInput !== '' ? `${daysInput} days` : 'Forever';
                    setFormData({ ...formData, linkTime: specificTimeInDays });
                    setDaysInput('');
                  }}
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

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
              <Button variant="outlined" onClick={handleUpdate}>
                Update
              </Button>
            </Box>
          </Card>
        </>
      )}
    </Page>
  );
}
