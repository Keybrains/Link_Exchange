import { useState, useEffect } from 'react';
import { faSquareCheck, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import iso6391 from 'iso-639-1';
import {
  Typography,
  Card,
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
  Box,
  Tooltip,
} from '@mui/material';
import { differenceInDays, parseISO } from 'date-fns';
import CircularProgress from '@mui/material/CircularProgress';
import axiosInstance from '../config/AxiosInstance';
import Page from '../admin/components/Page';

export default function UsersWebsite() {
  const countryCodes = Object.keys(countries);
  const languageCodes = iso6391.getAllCodes();

  const [PaidWebsite, setAllWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportedURL, setReportedURL] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    language: '',
    monthlyVisits: '',
    DA: '',
    spamScore: '',
    costOfAddingBacklink: '',
    categories: [],
    surfaceInGoogleNews: '',
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

  async function fetchAllWebsites() {
    try {
      const decodedToken = localStorage.getItem('decodedToken');
      if (decodedToken) {
        const parsedToken = JSON.parse(decodedToken);
        const userId = parsedToken.userId?.user_id;

        const response = await axiosInstance.get(`/otheruserwebsite/paid-websites-not-matching-user/${userId}`);

        if (response.status === 200) {
          const filteredData = response.data.data.filter((website) => {
            const countryFilter =
              !filters.country || website.country.toLowerCase().includes(filters.country.toLowerCase());

            const languageFilter =
              !filters.language || website.language.toLowerCase().includes(filters.language.toLowerCase());

            const monthlyVisitsFilter =
              !filters.monthlyVisits || website.monthlyVisits >= parseInt(filters.monthlyVisits, 10);

            const DAFiter = !filters.DA || website.DA >= parseInt(filters.DA, 10);

            const spamScoreFilter = !filters.spamScore || website.spamScore >= parseInt(filters.spamScore, 10);

            const linkTypeFilter =
              !filters.linkType || website.linkType.toLowerCase() === filters.linkType.toLowerCase();

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

  useEffect(() => {
    fetchAllWebsites();
  }, [page, itemsPerPage, filters]);

  const [reportedWebsiteId, setReportedWebsiteId] = useState('');

  const handleOpenReportDialog = (websiteId, websiteUrl) => {
    setReportedWebsiteId(websiteId);
    setReportedURL(websiteUrl);
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

      const response = await axiosInstance.post('/reportedwebsite/reportedwerbsites', {
        user_id: userId,
        website_id: reportedWebsiteId,
        url: reportedURL,
        message: reportMessage,
      });

      if (response.status === 201) {
        const updateResponse = await axiosInstance.put(`/website/updateReportedStatus/${reportedWebsiteId}`);
        if (updateResponse.status === 200) {
          handleCloseReportDialog();
          fetchAllWebsites();
          console.log('Reported status updated successfully', updateResponse.data);
        } else {
          throw new Error('Failed to update reported status');
        }
      } else {
        throw new Error('Failed to report website');
      }
    } catch (error) {
      console.error('Error in reporting or updating website status:', error);
    }
  };

  const isNewWebsite = (createAt) => {
    const difference = differenceInDays(new Date(), parseISO(createAt));
    return difference <= 15;
  };
  const navigate = useNavigate();

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
    <Page title="Purchase Paid Website" style={{ paddingLeft: '10px', paddingRight: '10px' }} sx={{ mt: 3, pt: 10 }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <div>
            <Typography variant="h5" gutterBottom sx={{ paddingBottom: '0px', color: '#010ED0' }}>
              Find Paid Website URL
            </Typography>
            <hr style={{ color: '#010ED0' }} />
          </div>

          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6} sm={4} style={{ padding: '5px' }}>
              <TextField
                label="Monthly Visits..."
                value={filters.monthlyVisits}
                onChange={(e) => handleFilterChange('monthlyVisits', e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{
                  style: { color: '#010ED0' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#010ED0',
                    },
                    '& fieldset': {
                      borderColor: '#010ED0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#010ED0',
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} sm={4} style={{ padding: '5px' }}>
              <TextField
                label="Domain Authority..."
                value={filters.DA}
                onChange={(e) => handleFilterChange('DA', e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{
                  style: { color: '#010ED0' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#010ED0',
                    },
                    '& fieldset': {
                      borderColor: '#010ED0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#010ED0',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} sm={4} style={{ padding: '5px' }}>
              <TextField
                label="Spam Score..."
                value={filters.spamScore}
                onChange={(e) => handleFilterChange('spamScore', e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{
                  style: { color: '#010ED0' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#010ED0',
                    },
                    '& fieldset': {
                      borderColor: '#010ED0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#010ED0',
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} sm={4} style={{ padding: '5px' }}>
              <FormControl fullWidth>
                <Autocomplete
                  fullWidth
                  size="small"
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
                      InputLabelProps={{
                        style: { color: '#010ED0' },
                      }}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: '#010ED0',
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '0px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#010ED0',
                          },
                          '& fieldset': {
                            borderColor: '#010ED0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#010ED0',
                          },
                        },
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={4} style={{ padding: '5px' }}>
              <FormControl fullWidth>
                <Autocomplete
                  fullWidth
                  size="small"
                  value={filters.language}
                  onChange={(event, newValue) => {
                    handleFilterChange('language', newValue);
                  }}
                  id="language-autocomplete"
                  options={languageCodes.map((code) => iso6391.getName(code))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Language..."
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        style: { color: '#010ED0' },
                      }}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: '#010ED0',
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '0px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#010ED0',
                          },
                          '& fieldset': {
                            borderColor: '#010ED0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#010ED0',
                          },
                        },
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} style={{ padding: '5px' }}>
              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#010ED0',
                    },
                    '& fieldset': {
                      borderColor: '#010ED0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#010ED0',
                    },
                  },
                }}
              >
                <InputLabel
                  sx={{
                    color: '#010ED0',
                    '&.Mui-focused': {
                      color: '#010ED0',
                    },
                  }}
                >
                  Link Type...
                </InputLabel>
                <Select
                  value={filters.linkType}
                  onChange={(e) => handleFilterChange('linkType', e.target.value)}
                  labelId="linkType"
                  id="linkType"
                  label="link Type"
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: '#010ED0',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#010ED0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#010ED0',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#010ED0',
                    },
                    '& .MuiSelect-select': {
                      '&:focus': {
                        backgroundColor: 'transparent',
                      },
                    },
                  }}
                >
                  <MenuItem value="DoFollow">Do Follow</MenuItem>
                  <MenuItem value="NoFollow">No Follow</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} style={{ padding: '5px' }}>
              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#010ED0',
                    },
                    '& fieldset': {
                      borderColor: '#010ED0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#010ED0',
                    },
                  },
                }}
              >
                <InputLabel
                  sx={{
                    color: '#010ED0',
                    '&.Mui-focused': {
                      color: '#010ED0',
                    },
                  }}
                >
                  Categories...
                </InputLabel>
                <Select
                  multiple
                  value={filters.categories}
                  onChange={(e) => handleFilterChange('categories', e.target.value)}
                  renderValue={(selected) => selected.join(', ')}
                  label="Categories"
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: '#010ED0',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#010ED0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#010ED0',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#010ED0',
                    },
                    '& .MuiSelect-select': {
                      '&:focus': {
                        backgroundColor: 'transparent',
                      },
                    },
                  }}
                >
                  {categoriesList.map((category) => (
                    <MenuItem key={category.id} value={category.category}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} style={{ padding: '5px' }}>
              <FormControl
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#010ED0',
                    },
                    '& fieldset': {
                      borderColor: '#010ED0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#010ED0',
                    },
                  },
                }}
              >
                <InputLabel
                  sx={{
                    color: '#010ED0',
                    '&.Mui-focused': {
                      color: '#010ED0',
                    },
                  }}
                >
                  Surface In Google News...
                </InputLabel>
                <Select
                  value={filters.surfaceInGoogleNews}
                  onChange={(e) => handleFilterChange('surfaceInGoogleNews', e.target.value)}
                  labelId="surfaceInGoogleNews"
                  id="surfaceInGoogleNews"
                  label="surface In Google News"
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: '#010ED0',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#010ED0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#010ED0',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#010ED0',
                    },
                    '& .MuiSelect-select': {
                      '&:focus': {
                        backgroundColor: 'transparent',
                      },
                    },
                  }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.newOnly}
                      onChange={(e) => handleFilterChange('newOnly', e.target.checked)}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.5rem',
                          color: '#010ED0',
                        },
                        '&.Mui-checked .MuiSvgIcon-root': {
                          color: '#010ED0',
                        },
                      }}
                    />
                  }
                  label="Show only new websites"
                  sx={{
                    '& .MuiTypography-root': {
                      color: '#010ED0',
                    },
                  }}
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <hr style={{ width: '100%', margin: '10px 0', color: '#010ED0' }} />

          {PaidWebsite.length > 0 ? (
            <>
              <div style={{ backgroundColor: '#C7CAFF', padding: '10px' }}>
                {PaidWebsite.map((website) => (
                  <Card
                    key={website._id}
                    sx={{
                      marginBottom: '20px',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      },
                      borderRadius: '10px',
                      padding: '5px',
                    }}
                  >
                    {isNewWebsite(website.createAt) && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          width: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#0B9010',
                          zIndex: 1,
                          transform: 'rotate(0deg)',
                        }}
                      >
                        <span
                          style={{
                            transform: 'rotate(90deg)',
                            display: 'block',
                            fontFamily: 'Poppins',
                            fontSize: '12px',
                            fontWeight: 700,
                            lineHeight: '18px',
                            letterSpacing: '0.06em',
                            textAlign: 'left',
                            color: 'white',
                          }}
                        >
                          NEW
                        </span>
                      </div>
                    )}

                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={7}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            component="div"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, fontWeight: 'medium' }}
                          >
                            <FontAwesomeIcon
                              icon={website.status === 'activate' ? faSquareCheck : faRectangleXmark}
                              style={{
                                color: website.status === 'activate' ? '#4CAF50' : '#E57373',
                                fontSize: '1.1rem',
                              }}
                            />
                            <span
                              style={{
                                marginLeft: '0px',
                                color: website.status === 'activate' ? '#4CAF50' : '#E57373',
                              }}
                            >
                              {website.status === 'activate' ? 'Active' : 'Inactive'}
                            </span>
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            URL: {website.url}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#010ED0', fontWeight: 'bold' }}>
                            Cost: ${website.charges || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <Box display="flex" flexDirection={{ xs: 'row', sm: 'column' }} alignItems="flex-end" gap={1}>
                          <Tooltip title="Contact Owner - Click Here">
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                textTransform: 'none',
                                fontSize: '0.7rem',
                                backgroundColor: '#F6D358',
                                '&:hover': {
                                  backgroundColor: '#F6D358',
                                },
                                width: 100,
                                borderRadius: '15px 0 0 15px',
                                marginRight: '20px',
                                paddingRight: '20px',
                              }}
                              onClick={() => {
                                navigate(`/user/chat/${website.user_id}?url=${encodeURIComponent(website.url)}`, {
                                  state: { website_id: website.website_id },
                                });
                              }}
                            >
                              Contact
                            </Button>
                          </Tooltip>

                          <Tooltip title="Report URL - Click Here">
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                textTransform: 'none',
                                fontSize: '0.7rem',
                                backgroundColor: '#F5938D',
                                '&:hover': {
                                  backgroundColor: '#F5938D',
                                },
                                width: 100,
                                borderRadius: '15px 0 0 15px',
                                marginRight: '20px',
                                paddingRight: '20px',
                              }}
                              onClick={() => handleOpenReportDialog(website.website_id, website.url)}
                            >
                              Report
                            </Button>
                          </Tooltip>

                          <Tooltip title="For More Detail - Click Here">
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                textTransform: 'none',
                                fontSize: '0.7rem',
                                backgroundColor: '#90DCF6',
                                '&:hover': {
                                  backgroundColor: '#90DCF6',
                                },
                                width: 100,
                                borderRadius: '15px 0 0 15px',
                                marginRight: '20px',
                                paddingRight: '20px',
                              }}
                              onClick={() => {
                                navigate(`/user/userwebsitedetail/${website.website_id}`, {});
                              }}
                            >
                              Detail
                            </Button>
                          </Tooltip>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Typography variant="body2" sx={{ fontSize: '0.85em', textAlign: 'center', marginTop: '20px' }}>
              No Websites Found
            </Typography>
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
            <FormControl margin="normal" sx={{ '& .MuiInput-root': { paddingTop: '18px' } }}>
              <InputLabel sx={{ backgroundColor: 'white', paddingRight: '5px', paddingLeft: '5px' }}>
                Items per Page
              </InputLabel>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Items per Page"
                sx={{ fontSize: '0.9rem' }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
            </FormControl>
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
