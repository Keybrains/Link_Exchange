import { useState, useEffect } from 'react';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import axiosInstance from '../config/AxiosInstance';
import Page from '../admin/components/Page';

export default function FreeWebsite() {
  const [PaidWebsites, setPaidWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPaidWebsites() {
      try {
        const decodedToken = localStorage.getItem('decodedToken');

        if (decodedToken) {
          const parsedToken = JSON.parse(decodedToken);
          const userId = parsedToken.userId?.user_id;

          const response = await axiosInstance.get(`/website/websites/paid/${userId}`, {
            params: { page, itemsPerPage },
          });

          if (response.status === 200) {
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedWebsites = response.data.data.slice(startIndex, endIndex);

            setPaidWebsites(paginatedWebsites);
            setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
          } else {
            throw new Error('Failed to fetch paid websites');
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

    fetchPaidWebsites();
  }, [page, itemsPerPage]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setPage(1);
  };

  //--------------------------------------------------------------------
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportedURL, setReportedURL] = useState('');
  const [reportMessage, setReportMessage] = useState('');

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

      const websiteToReport = PaidWebsites.find((website) => website.url === reportedURL);

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
        setPaidWebsites((prevWebsites) => prevWebsites.filter((website) => website.url !== reportedURL));
      } else {
        throw new Error('Failed to report website');
      }

      if (response.status === 201) {
        handleCloseReportDialog();
      } else {
        throw new Error('Failed to report website');
      }
    } catch (error) {
      console.error('Error reporting website:', error);
    }
  };

  const handleNavigate = () => {
    navigate('/user/terms');
  };

  return (
    <Page title="My Paid Website" style={{ paddingLeft: '10px', paddingRight: '10px' }}  sx={{ mt: 3, pt: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        My Paid Website
      </Typography>
      <Box
        className="green-line"
        sx={{
          backgroundColor: '#E0F2F1',
          padding: '20px',
          marginY: '20px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="body1"
          className="green-line__text"
          sx={{
            flexGrow: 1,
            marginBottom: { xs: '20px', md: 0 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Want to monetize your site while placing or creating unique and relevant content?
        </Typography>
        <Button
          variant="contained"
          className="button button--black green-line__button"
          onClick={handleNavigate}
          sx={{
            marginLeft: { xs: 0, md: '20px' },
          }}
        >
          Add website
        </Button>
      </Box>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          {PaidWebsites.length > 0 ? (
            PaidWebsites.map((website) => (
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
                        Cost: ${website.charges || 0}
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
                      {/* Other Grid items */}
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
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No Paid Websites</Typography>
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
        </>
      )}
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
            <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} color="primary" />
          </Stack>
        )}
      </div>
    </Page>
  );
}