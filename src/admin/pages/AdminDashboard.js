import { useEffect, useState } from 'react';

// @mui
// import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import axiosInstance from '../config/AxiosInstanceAdmin';

// components
import Page from '../components/Page';

// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  // const theme = useTheme();
  const [websiteCounts, setWebsiteCounts] = useState({});

  useEffect(() => {
    async function fetchWebsiteCounts() {
      try {
        const response = await axiosInstance.get('/website/websites/website-count');
        if (response.status === 200) {
          setWebsiteCounts(response.data); // Update to set the entire response data
        } else {
          throw new Error('Failed to fetch website counts');
        }
      } catch (error) {
        console.error(error);
        // Handle error state if needed
      }
    }

    fetchWebsiteCounts();
  }, []);

  return (
    <Page title="Admin Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Website"
              total={websiteCounts?.totalCount}
              icon={'teenyicons:layers-intersect-solid'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Paid Website"
              total={websiteCounts?.paidCount}
              color="info"
              icon={'teenyicons:adjust-vertical-solid'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Free Website"
              total={websiteCounts?.freeCount}
              color="success"
              icon={'teenyicons:bag-alt-solid'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Pending Website"
              total={websiteCounts?.pendingCount}
              color="secondary"
              icon={'mdi:lan-pending'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Rejected Website"
              total={websiteCounts?.rejectedCount}
              color="warning"
              icon={'icon-park-outline:reject'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Reported Website"
              total={websiteCounts?.reportedCount}
              color="error"
              icon={'ant-design:bug-filled'}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
