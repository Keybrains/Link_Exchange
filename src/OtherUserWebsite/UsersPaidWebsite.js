import { useState, useEffect } from 'react';

import { faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import iso6391 from 'iso-639-1';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Stack,
  Pagination,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Autocomplete,
} from '@mui/material';
import { differenceInDays, parseISO } from 'date-fns';
import CircularProgress from '@mui/material/CircularProgress';
import axiosInstance from '../config/AxiosInstance';
import Page from '../admin/components/Page';

export default function UsersWebsite() {
  const countryCodes = Object.keys(countries);
  // const countryNames = countryCodes.map((code) => countries[code].name);
  const languageCodes = iso6391.getAllCodes();
  // const languageNames = languageCodes.map((code) => iso6391.getName(code));

  const [PaidWebsite, setAllWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportedURL, setReportedURL] = useState('');
  const [reportMessage, setReportMessage] = useState('');

  const [filters, setFilters] = useState({
    country: '',
    language: '',
    monthlyVisits: '',
    DA: '',
    spamScore: '',
    costOfAddingBacklink: '',
    categories: [],
    surfaceInGoogleNews: '',
    // Add more filters as needed
  });

  const handleFilterChange = (fieldName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [fieldName]: value,
    }));
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setPage(1);
  };

  // const handleFilterButtonClick = () => {
  //   // Function to filter data based on entered values
  //   const filteredData = PaidWebsite.filter((website) => {
  //     const countryFilter = !filters.country || website.country.toLowerCase() === filters.country.toLowerCase();
  //     const languageFilter = !filters.language || website.language.toLowerCase() === filters.language.toLowerCase();
  //     const costOfaddingbacklinkfilter =
  //       !filters.costOfAddingBacklink ||
  //       website.costOfAddingBacklink.toLowerCase() === filters.costOfAddingBacklink.toLowerCase();
  //     const monthlyVisitsFilter =
  //       !filters.monthlyVisits || website.monthlyVisits === parseInt(filters.monthlyVisits, 10);
  //     const DAFiter = !filters.DA || website.DA === parseInt(filters.DA, 10);
  //     const spamScoreFilter = !filters.spamScore || website.spamScore === parseInt(filters.spamScore, 10);

  //     // Add more filters as needed

  //     return (
  //       costOfaddingbacklinkfilter &&
  //       countryFilter &&
  //       languageFilter &&
  //       monthlyVisitsFilter &&
  //       DAFiter &&
  //       spamScoreFilter
  //     );
  //   });

  //   // Set the filtered data and reset the page to 1
  //   setAllWebsites(filteredData);
  //   setPage(1);
  // };

  useEffect(() => {
    // Function to fetch all websites
    async function fetchAllWebsites() {
      try {
        const decodedToken = localStorage.getItem('decodedToken');
        if (decodedToken) {
          const parsedToken = JSON.parse(decodedToken);
          const userId = parsedToken.userId?.user_id;

          const response = await axiosInstance.get(`/otheruserwebsite/paid-websites-not-matching-user/${userId}`);

          if (response.status === 200) {
            // Filter data based on entered values
            const filteredData = response.data.data.filter((website) => {
              // const countryFilter = !filters.country || website.country.toLowerCase() === filters.country.toLowerCase();
              const countryFilter =
                !filters.country || website.country.toLowerCase().includes(filters.country.toLowerCase());

              const languageFilter =
                !filters.language || website.language.toLowerCase().includes(filters.language.toLowerCase());

              const monthlyVisitsFilter =
                !filters.monthlyVisits || website.monthlyVisits === parseInt(filters.monthlyVisits, 10);
              const DAFiter = !filters.DA || website.DA === parseInt(filters.DA, 10);
              const spamScoreFilter = !filters.spamScore || website.spamScore === parseInt(filters.spamScore, 10);
              const linkTypeFilter =
                !filters.linkType || website.linkType.toLowerCase() === filters.linkType.toLowerCase();
              // Add more filters as needed
              const categoryFilter =
                filters.categories.length === 0 ||
                filters.categories.some((category) => website.categories.includes(category));
              const surfaceingooglenewseFilter =
                !filters.surfaceInGoogleNews ||
                website.surfaceInGoogleNews.toLowerCase() === filters.surfaceInGoogleNews.toLowerCase();
              const costOfaddingbacklinkfilter =
                !filters.costOfAddingBacklink ||
                website.costOfAddingBacklink.toLowerCase() === filters.costOfAddingBacklink.toLowerCase();
              const newWebsiteFilter = !filters.newOnly || isNewWebsite(website.createAt);
              return (
                costOfaddingbacklinkfilter &&
                countryFilter &&
                languageFilter &&
                monthlyVisitsFilter &&
                DAFiter &&
                spamScoreFilter &&
                linkTypeFilter &&
                categoryFilter &&
                surfaceingooglenewseFilter &&
                newWebsiteFilter
              );
            });

            const paginatedWebsites = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

            setAllWebsites(paginatedWebsites);
            setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
          } else {
            throw new Error('Failed to fetch approved websites');
          }
        } else {
          throw new Error('User ID not found in decoded token');
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    fetchAllWebsites();
  }, [page, itemsPerPage, filters]);

  const handleOpenReportDialog = (url) => {
    setReportedURL(url);
    setOpenReportDialog(true);
  };

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
    setReportedURL('');
    setReportMessage('');
  };

  const handleReportWebsite = async () => {
    try {
      const decodedToken = localStorage.getItem('decodedToken');
      if (!decodedToken) {
        throw new Error('User ID not found in decoded token');
      }

      const parsedToken = JSON.parse(decodedToken);
      const userId = parsedToken.userId?.user_id;

      const websiteToReport = PaidWebsite.find((website) => website.url === reportedURL);

      if (!websiteToReport) {
        throw new Error('Website not found for the reported URL');
      }

      const response = await axiosInstance.post('/reportedwebsite/reportedwerbsites', {
        user_id: userId,
        website_id: websiteToReport.website_id,
        url: reportedURL,
        message: reportMessage,
      });

      if (response.status === 201) {
        handleCloseReportDialog();
        await axiosInstance.put(`website/updateReportedStatus/${websiteToReport.website_id}`);
        setAllWebsites((prevWebsites) => prevWebsites.filter((website) => website.url !== reportedURL));
      } else {
        throw new Error('Failed to report website');
      }
    } catch (error) {
      console.error('Error reporting website:', error);
    }
  };

  const isNewWebsite = (createAt) => {
    const difference = differenceInDays(new Date(), parseISO(createAt));
    return difference <= 5;
  };

  const navigate = useNavigate();

  return (
    <Page title="Purchase Paid Website" sx={{ paddingX: '20px', overflow: 'hidden' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
            Find Paid Website URL
          </Typography>

          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6} sm={4}>
              <TextField
                label="Monthly Visits"
                value={filters.monthlyVisits}
                onChange={(e) => handleFilterChange('monthlyVisits', e.target.value)}
                fullWidth
                sx={{ backgroundColor: 'rgba(177, 212, 224, 0.2)' }}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Domain Authority"
                value={filters.DA}
                onChange={(e) => handleFilterChange('DA', e.target.value)}
                fullWidth
                sx={{ backgroundColor: 'rgba(177, 212, 224, 0.2)' }}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Spam Score"
                value={filters.spamScore}
                onChange={(e) => handleFilterChange('spamScore', e.target.value)}
                fullWidth
                sx={{ backgroundColor: 'rgba(177, 212, 224, 0.2)' }}
              />
            </Grid>
            {/* <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Free or Paid</InputLabel>
                <Select
                  value={filters.costOfAddingBacklink}
                  onChange={(e) => handleFilterChange('costOfAddingBacklink', e.target.value)}
                  // labelId="costOfAddingBacklink"
                  // id="costOfAddingBacklink"
                  label="Free Or Paid"
                >
                  <MenuItem value="Free">Free</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
            <Grid item xs={6} sm={4}>
              <FormControl fullWidth>
                <Autocomplete
                  fullWidth
                  value={filters.country}
                  onChange={(event, newValue) => {
                    handleFilterChange('country', newValue);
                  }}
                  id="country-autocomplete"
                  options={countryCodes.map((code) => countries[code].name)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      variant="outlined"
                      fullWidth
                      sx={{ backgroundColor: 'rgba(177, 212, 224, 0.2)' }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={4}>
              <FormControl fullWidth>
                <Autocomplete
                  fullWidth
                  value={filters.language}
                  onChange={(event, newValue) => {
                    handleFilterChange('language', newValue);
                  }}
                  id="language-autocomplete"
                  options={languageCodes.map((code) => iso6391.getName(code))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Language"
                      variant="outlined"
                      fullWidth
                      sx={{ backgroundColor: 'rgba(177, 212, 224, 0.2)' }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Link Type</InputLabel>
                <Select
                  value={filters.linkType}
                  onChange={(e) => handleFilterChange('linkType', e.target.value)}
                  labelId="linkType"
                  id="linkType"
                  label="link Type"
                  sx={{ backgroundColor: 'rgba(177, 212, 224, 0.2)' }}
                >
                  <MenuItem value="DoFollow">Do Follow</MenuItem>
                  <MenuItem value="NoFollow">No Follow</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={filters.categories}
                  onChange={(e) => handleFilterChange('categories', e.target.value)}
                  renderValue={(selected) => selected.join(', ')}
                  label="Categories"
                  sx={{ backgroundColor: 'rgba(177, 212, 224, 0.2)' }}
                >
                  {/* Add your categories here */}
                  <MenuItem value="Category1">Category 1</MenuItem>
                  <MenuItem value="Category2">Category 2</MenuItem>
                  {/* Add more categories as needed */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Surface In Google News</InputLabel>
                <Select
                  value={filters.surfaceInGoogleNews}
                  onChange={(e) => handleFilterChange('surfaceInGoogleNews', e.target.value)}
                  labelId="surfaceInGoogleNews"
                  id="surfaceInGoogleNews"
                  label="surface In Google News"
                  sx={{ backgroundColor: 'rgba(177, 212, 224, 0.2)' }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={4} className="pt-2">
            <FormControl fullWidth>
              {/* <InputLabel>New Websites</InputLabel> */}
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.newOnly}
                      onChange={(e) => handleFilterChange('newOnly', e.target.checked)}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.5rem',
                        },
                        '&.Mui-checked': {
                          color: '#2ecc71', // Color when checked
                        },
                      }}
                    />
                  }
                  label="Show only new websites"
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <hr style={{ borderTop: '1px solid black', width: '100%', margin: '20px 0' }} />

          {/* Filter button */}
          {/* <Button variant="contained" color="primary" onClick={handleFilterButtonClick} className="my-4">
            Apply Filters
          </Button> */}
          {PaidWebsite.length > 0 ? (
            <>
              {PaidWebsite.map((website) => (
                <Card key={website._id} sx={{ marginBottom: '20px' }}>
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '30px',
                    }}
                  >
                    <Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Typography style={{ paddingBottom: '10px' }}>
                          {isNewWebsite(website.createAt) && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'lightgreen',
                                color: 'white',
                                padding: '5px',
                                borderRadius: '5px',
                              }}
                            >
                              NEW
                            </div>
                          )}
                          <FontAwesomeIcon
                            icon={faDotCircle}
                            style={{
                              color: website.status === 'activate' ? 'green' : 'red',
                              fontSize: '0.9em',
                              marginRight: '5px',
                            }}
                          />
                          <span style={{ color: website.status === 'activate' ? 'green' : 'red' }}>
                            {website.status === 'activate' ? 'Active' : 'Inactive'}
                          </span>
                        </Typography>
                        <Typography style={{ fontSize: '1.2em' }}>
                          <span style={{ fontWeight: 'bold' }}>URL: </span>
                          {website.url}
                        </Typography>
                        <Typography style={{ color: '#0E86D4', paddingTop: '10px' }}>
                          {website.costOfAddingBacklink} Cost: ${website.charges || 0}
                        </Typography>
                      </Grid>
                      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                          <Typography style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', Bottom: '50px' }}>Organic Visits : </span>
                            {website.monthlyVisits}
                          </Typography>
                          <Typography style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>Domain Authority : </span>
                            {website.DA}
                          </Typography>
                          <Typography style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>Spam Score : </span>
                            {website.spamScore}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                          <Typography style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>Link Period : </span>
                            {website.linkTime}
                          </Typography>
                          <Typography style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>Link Type : </span>
                            {website.linkType}
                          </Typography>
                          <Typography style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>Link Quantity : </span>
                            {website.backlinksAllowed}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                          <Typography style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>Country : </span>
                            {website.country}
                          </Typography>
                          <Typography style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>Language : </span>
                            {website.language}
                          </Typography>
                          <Typography style={{ marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>Google News : </span>
                            {website.surfaceInGoogleNews ? 'Yes' : 'No'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                          <div style={{ margin: '15px' }}>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ marginRight: '10px' }}
                              onClick={() => {
                                navigate(`/user/chat/${website.user_id}?url=${encodeURIComponent(website.url)}`, {
                                  state: { website_id: website.website_id },
                                });
                              }}
                            >
                              Contact
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{ backgroundColor: '#FF7F7F' }}
                              onClick={() => handleOpenReportDialog(website.url)}
                            >
                              Report
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <Typography>No Websites</Typography>
          )}
          <Dialog open={openReportDialog} onClose={handleCloseReportDialog}>
            <DialogTitle>Report Website</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please provide a message to report the website: <strong>{reportedURL}</strong>
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Message"
                fullWidth
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseReportDialog}>Cancel</Button>
              <Button onClick={handleReportWebsite} color="secondary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <hr style={{ borderTop: '1px solid black', width: '100%', margin: '20px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <>
              <FormControl margin="normal" sx={{ '& .MuiInput-root': { paddingTop: '18px' } }}>
                <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>Page</InputLabel>
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  label="Items per Page"
                  sx={{ fontSize: '0.9rem' }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                </Select>
              </FormControl>
            </>
            {totalPages > 1 && (
              <Stack spacing={2} sx={{ justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                />
              </Stack>
            )}
          </div>
        </>
      )}
    </Page>
  );
}
