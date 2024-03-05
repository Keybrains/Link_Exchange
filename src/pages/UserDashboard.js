import { useState, useEffect } from 'react';
import { Grid, Typography, Card, CardContent, Box, Icon, Button, ButtonGroup, Container } from '@mui/material';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MessageIcon from '@mui/icons-material/Message';
import BlockIcon from '@mui/icons-material/Block';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Page from '../components/Page';
import axiosInstance from '../config/AxiosInstance';

export default function UserDashboard() {
  const dataMonthly = [
    { name: 'Jan', Free: 4, Paid: 2 },
    { name: 'Feb', Free: 3, Paid: 1 },
    { name: 'Mar', Free: 2, Paid: 9 },
    { name: 'Apr', Free: 2, Paid: 3 },
    { name: 'May', Free: 1, Paid: 4 },
    { name: 'Jun', Free: 2, Paid: 3 },
    { name: 'Jul', Free: 3, Paid: 4 },
    { name: 'Aug', Free: 2, Paid: 3 },
    { name: 'sep', Free: 1, Paid: 4 },
    { name: 'oct', Free: 2, Paid: 3 },
    { name: 'nov', Free: 3, Paid: 4 },
    { name: 'dec', Free: 3, Paid: 4 },
  ];
  const dataYearly = [
    { name: '2020', Free: 20, Paid: 12 },
    { name: '2021', Free: 30, Paid: 15 },
    { name: '2022', Free: 20, Paid: 12 },
    { name: '2023', Free: 30, Paid: 15 },
  ];
  const CustomLegend = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="5" fill="#C7CAFF" />
        </svg>
        <span style={{ marginLeft: '5px' }}>Free Website</span>
      </div>
      <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="5" fill="#010ED0" />
        </svg>
        <span style={{ marginLeft: '5px' }}>Paid Website</span>
      </div>
    </div>
  );
  const CustomLegend1 = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="5" fill="#C7CAFF" />
        </svg>
        <span style={{ marginLeft: '5px' }}>Pending Approval</span>
      </div>
      <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="5" fill="#010ED0" />
        </svg>
        <span style={{ marginLeft: '5px' }}>Approved Website</span>
      </div>
    </div>
  );
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const userId = parsedToken.userId?.user_id;
  const [viewMode, setViewMode] = useState('monthly');
  const [viewMode1, setViewMode1] = useState('monthly');
  const [websiteCounts, setWebsiteCounts] = useState({});

  useEffect(() => {
    async function fetchWebsiteCounts() {
      try {
        const response = await axiosInstance.get(`/websites/websites/count/${userId}`);
        if (response.status === 200) {
          setWebsiteCounts(response.data.data);
          console.log('response.data', response.data);
        } else {
          throw new Error('Failed to fetch website counts');
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchWebsiteCounts();
  }, [userId]);

  return (
    <Page title="User Dashboard" sx={{ mt: 3, pt: { xs: 15, sm: 15, md: 15, lg: 10, xl: 10 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    mb: { xs: 5, sm: 5, md: 5, lg: 5, xl: 5 },
                    boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
                    border: '0.5px solid #C7CAFF',
                    background: '#FFFFFF',
                    borderRadius: '12px 12px 0 0',
                    position: 'relative',
                    overflow: 'visible',
                    ':hover': {
                      background: 'linear-gradient(180deg, #C7CAFF 0%, #010ED0 100%)',
                      '.iconBackground': {
                        background: '#010ED0',
                        border: 'none',
                      },
                      '.iconColor, .textColor': {
                        color: '#FFFFFF',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', height: '100%', pt: '68px' }}>
                    <Box
                      className="iconBackground"
                      sx={{
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        width: '48px',
                        height: '48px',
                        position: 'absolute',
                        top: '20px',
                        left: '25%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #010ED0',
                      }}
                    >
                      <MoneyOffIcon className="iconColor" sx={{ color: '#010ED0' }} />
                    </Box>
                    <Typography
                      className="textColor"
                      // variant="h6"
                      sx={{
                        mt: 5,
                        color: '#010ED0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}
                    >
                      My Free Website
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                      border: '0.5px solid #C7CAFF',
                      background: '#FFFFFF',
                      width: '100%',
                      height: '50px',
                      position: 'absolute',
                      borderRadius: '0 0 20px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" style={{ color: '#010ED0' }}>
                      {websiteCounts?.countFreeWebsites || 0}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    mb: { xs: 5, sm: 5, md: 5, lg: 5, xl: 5 },
                    boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
                    border: '0.5px solid #C7CAFF',
                    background: '#FFFFFF',
                    borderRadius: '12px 12px 0 0',
                    position: 'relative',
                    overflow: 'visible',
                    ':hover': {
                      background: 'linear-gradient(180deg, #C7CAFF 0%, #010ED0 100%)',
                      '.iconBackground': {
                        background: '#010ED0',
                        border: 'none',
                      },
                      '.iconColor, .textColor': {
                        color: '#FFFFFF',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', height: '100%', pt: '68px' }}>
                    <Box
                      className="iconBackground"
                      sx={{
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        width: '48px',
                        height: '48px',
                        position: 'absolute',
                        top: '20px',
                        left: '25%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #010ED0',
                      }}
                    >
                      <AttachMoneyIcon className="iconColor" sx={{ color: '#010ED0' }} />
                    </Box>
                    <Typography
                      className="textColor"
                      // variant="h6"
                      sx={{
                        mt: 5,
                        color: '#010ED0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}
                    >
                      My Paid Website
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                      border: '0.5px solid #C7CAFF',
                      background: '#FFFFFF',
                      width: '100%',
                      height: '50px',
                      position: 'absolute',
                      borderRadius: '0 0 20px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" style={{ color: '#010ED0' }}>
                      {websiteCounts?.countPaidWebsites || 0}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    mb: { xs: 5, sm: 5, md: 5, lg: 5, xl: 5 },
                    boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
                    border: '0.5px solid #C7CAFF',
                    background: '#FFFFFF',
                    borderRadius: '12px 12px 0 0',
                    position: 'relative',
                    overflow: 'visible',
                    ':hover': {
                      background: 'linear-gradient(180deg, #C7CAFF 0%, #010ED0 100%)',
                      '.iconBackground': {
                        background: '#010ED0',
                        border: 'none',
                      },
                      '.iconColor, .textColor': {
                        color: '#FFFFFF',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', height: '100%', pt: '68px' }}>
                    <Box
                      className="iconBackground"
                      sx={{
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        width: '48px',
                        height: '48px',
                        position: 'absolute',
                        top: '20px',
                        left: '25%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #010ED0',
                      }}
                    >
                      <PendingActionsIcon className="iconColor" sx={{ color: '#010ED0' }} />
                    </Box>
                    <Typography
                      className="textColor"
                      // variant="h6"
                      sx={{
                        mt: 5,
                        color: '#010ED0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}
                    >
                      My Pending Approval
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                      border: '0.5px solid #C7CAFF',
                      background: '#FFFFFF',
                      width: '100%',
                      height: '50px',
                      position: 'absolute',
                      borderRadius: '0 0 20px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" style={{ color: '#010ED0' }}>
                      {websiteCounts?.countPendingWebsites || 0}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    mb: { xs: 5, sm: 5, md: 5, lg: 5, xl: 5 },
                    boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
                    border: '0.5px solid #C7CAFF',
                    background: '#FFFFFF',
                    borderRadius: '12px 12px 0 0',
                    position: 'relative',
                    overflow: 'visible',
                    ':hover': {
                      background: 'linear-gradient(180deg, #C7CAFF 0%, #010ED0 100%)',
                      '.iconBackground': {
                        background: '#010ED0',
                        border: 'none',
                      },
                      '.iconColor, .textColor': {
                        color: '#FFFFFF',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', height: '100%', pt: '68px' }}>
                    <Box
                      className="iconBackground"
                      sx={{
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        width: '48px',
                        height: '48px',
                        position: 'absolute',
                        top: '20px',
                        left: '25%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #010ED0',
                      }}
                    >
                      <CheckCircleOutlineIcon className="iconColor" sx={{ color: '#010ED0' }} />
                    </Box>
                    <Typography
                      className="textColor"
                      // variant="h6"
                      sx={{
                        mt: 5,
                        color: '#010ED0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}
                    >
                      My Approve Website
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                      border: '0.5px solid #C7CAFF',
                      background: '#FFFFFF',
                      width: '100%',
                      height: '50px',
                      position: 'absolute',
                      borderRadius: '0 0 20px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" style={{ color: '#010ED0' }}>
                      {websiteCounts?.countAprovedWebsites || 0}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Card
                  sx={{
                    mb: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
                    boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
                    border: '0.5px solid #C7CAFF',
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    <ButtonGroup
                      variant="contained"
                      aria-label="outlined primary button group"
                      style={{
                        backgroundColor: '#010ED0',
                        padding: '5px',
                      }}
                    >
                      <Button
                        onClick={() => setViewMode('monthly')}
                        style={{
                          backgroundColor: viewMode === 'monthly' ? '#FFFFFF' : 'transparent',
                          color: viewMode === 'monthly' ? '#010ED0' : '#FFFFFF',
                        }}
                      >
                        Monthly
                      </Button>
                      <Button
                        onClick={() => setViewMode('yearly')}
                        style={{
                          backgroundColor: viewMode === 'yearly' ? '#FFFFFF' : 'transparent',
                          color: viewMode === 'yearly' ? '#010ED0' : '#FFFFFF',
                        }}
                      >
                        Yearly
                      </Button>
                    </ButtonGroup>
                  </div>

                  <ResponsiveContainer width="100%" height={170}>
                    <BarChart
                      data={viewMode === 'monthly' ? dataMonthly : dataYearly}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis
                        dataKey="name"
                        interval={0}
                        tick={{ fontSize: '12px', fill: '#010ED0', fontWeight: 'bold' }}
                      />
                      <Tooltip />
                      <Bar dataKey="Paid" stackId="a" fill="#010ED0" barSize={20} />
                      <Bar dataKey="Free" stackId="a" fill="#C7CAFF" radius={[10, 10, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                  <CustomLegend />
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Card
                  sx={{
                    mb: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
                    boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
                    border: '0.5px solid #C7CAFF',
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    <ButtonGroup
                      variant="contained"
                      aria-label="outlined primary button group"
                      style={{
                        backgroundColor: '#010ED0',
                        padding: '5px',
                      }}
                    >
                      <Button
                        onClick={() => setViewMode1('monthly')}
                        style={{
                          backgroundColor: viewMode1 === 'monthly' ? '#FFFFFF' : 'transparent',
                          color: viewMode1 === 'monthly' ? '#010ED0' : '#FFFFFF',
                        }}
                      >
                        Monthly
                      </Button>
                      <Button
                        onClick={() => setViewMode1('yearly')}
                        style={{
                          backgroundColor: viewMode1 === 'yearly' ? '#FFFFFF' : 'transparent',
                          color: viewMode1 === 'yearly' ? '#010ED0' : '#FFFFFF',
                        }}
                      >
                        Yearly
                      </Button>
                    </ButtonGroup>
                  </div>

                  <ResponsiveContainer width="100%" height={170}>
                    <BarChart
                      data={viewMode1 === 'monthly' ? dataMonthly : dataYearly}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis
                        dataKey="name"
                        interval={0}
                        tick={{ fontSize: '12px', fill: '#010ED0', fontWeight: 'bold' }}
                      />
                      <Tooltip />
                      <Bar dataKey="Paid" stackId="a" fill="#010ED0" barSize={20} />
                      <Bar dataKey="Free" stackId="a" fill="#C7CAFF" radius={[10, 10, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                  <CustomLegend1 />
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={0.5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <hr style={{ borderLeft: '2px solid #010ED0', height: '100%', minHeight: '300px' }} />
          </Grid>
          <Grid item xs={12} md={2}>
            <Grid container direction="column" spacing={8} sx={{ pt: { xs: 5, sm: 0 } }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
                    border: '0.5px solid #C7CAFF',
                    background: '#FFFFFF',
                    borderRadius: '12px 12px 0 0',
                    position: 'relative',
                    overflow: 'visible',
                    ':hover': {
                      background: 'linear-gradient(180deg, #C7CAFF 0%, #010ED0 100%)',
                      '.iconBackground': {
                        background: '#010ED0',
                        border: 'none',
                      },
                      '.iconColor, .textColor': {
                        color: '#FFFFFF',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', height: '100%', pt: '68px' }}>
                    <Box
                      className="iconBackground"
                      sx={{
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        width: '48px',
                        height: '48px',
                        position: 'absolute',
                        top: '20px',
                        left: '25%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #010ED0',
                      }}
                    >
                      <MessageIcon className="iconColor" sx={{ color: '#010ED0' }} />
                    </Box>
                    <Typography
                      className="textColor"
                      // variant="h6"
                      sx={{
                        mt: 5,
                        color: '#010ED0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}
                    >
                      My Chatted Users
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                      border: '0.5px solid #C7CAFF',
                      background: '#FFFFFF',
                      width: '100%',
                      height: '50px',
                      position: 'absolute',
                      borderRadius: '0 0 20px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" style={{ color: '#010ED0' }}>
                      {websiteCounts?.countChatedUsers || 0}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.25)',
                    border: '0.5px solid #C7CAFF',
                    background: '#FFFFFF',
                    borderRadius: '12px 12px 0 0',
                    position: 'relative',
                    overflow: 'visible',
                    ':hover': {
                      background: 'linear-gradient(180deg, #C7CAFF 0%, #010ED0 100%)',
                      '.iconBackground': {
                        background: '#010ED0',
                        border: 'none',
                      },
                      '.iconColor, .textColor': {
                        color: '#FFFFFF',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', height: '100%', pt: '68px' }}>
                    <Box
                      className="iconBackground"
                      sx={{
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        width: '48px',
                        height: '48px',
                        position: 'absolute',
                        top: '20px',
                        left: '25%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #010ED0',
                      }}
                    >
                      <BlockIcon className="iconColor" sx={{ color: '#010ED0' }} />
                    </Box>
                    <Typography
                      className="textColor"
                      // variant="h6"
                      sx={{
                        mt: 5,
                        color: '#010ED0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}
                    >
                      My Blocked Websites
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                      border: '0.5px solid #C7CAFF',
                      background: '#FFFFFF',
                      width: '100%',
                      height: '50px',
                      position: 'absolute',
                      borderRadius: '0 0 20px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" style={{ color: '#010ED0' }}>
                      {websiteCounts?.countReportedWebsites || 0}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
