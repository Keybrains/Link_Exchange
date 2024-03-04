import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Stack,
  Pagination,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  DialogContent,
  Dialog,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';
import axiosInstance from '../config/AxiosInstance';
import Page from '../admin/components/Page';

const StyledDialog = styled(Dialog)({
  '& .MuiDialogTitle-root': {
    backgroundColor: '#2196F3',
    color: '#ffffff',
    borderBottom: '1px solid #1565c0',
    paddingBottom: '8px',
  },
  '& .MuiDialogContent-root': {
    padding: '16px',
  },
  '& .MuiTextField-root': {
    marginBottom: '16px',
  },
  '& .MuiButton-root': {
    marginRight: '8px',
  },
  '& .MuiDialog-paper': {
    minWidth: '400px',
    minHeight: '300px',
    borderRadius: '10px',
  },
});

export default function PendingApproval() {
  const [PendingApproval, setPendingApproval] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;
  const navigate = useNavigate();
  const staticUserId = '1703861822774ebrhy1rn2626664125';

  useEffect(() => {
    async function fetchPendingApproval() {
      try {
        const decodedToken = localStorage.getItem('decodedToken');

        if (decodedToken) {
          const parsedToken = JSON.parse(decodedToken);
          const userId = parsedToken.userId?.user_id;
          const response = await axiosInstance.get(`/website/websites/not-approved/${userId}`, {
            params: { page, itemsPerPage },
          });

          if (response.status === 200) {
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedWebsites = response.data.data.slice(startIndex, endIndex);

            setPendingApproval(paginatedWebsites);
            setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
          } else {
            throw new Error('Failed to fetch not approved websites');
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

    fetchPendingApproval();
  }, [page, itemsPerPage]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setPage(1);
  };

  return (
    <Page title="My Pending Approval" style={{ paddingLeft: '10px', paddingRight: '10px' }} sx={{ mt: 0.2, pt: 6 }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
            My Pending Approval
          </Typography>
          {PendingApproval.length > 0 ? (
            PendingApproval.map((website) => (
              <Card key={website._id} sx={{ marginBottom: '15px' }}>
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
                            color: website.status === 'pending' ? 'gray' : 'red',
                            fontSize: '0.9em',
                            marginRight: '5px',
                          }}
                        />
                        <span style={{ color: website.status === 'pending' ? 'gray' : 'red' }}>
                          {website.status === 'pending' ? 'Pending' : 'Rejected'}
                        </span>
                        {website.status === 'rejected' && website.reason && (
                          <Typography style={{ marginBottom: '10px', marginTop: '15px' }}>
                            <span style={{ fontWeight: 'bold' }}>Rejection Reason: </span>
                            {website.reason}
                          </Typography>
                        )}
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
                              navigate(`/user/adminchat/${staticUserId}?url=${encodeURIComponent(website.url)}`, {
                                state: { website_id: website.website_id },
                              });
                            }}
                          >
                            Contact Admin
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No Pending Approval</Typography>
          )}
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