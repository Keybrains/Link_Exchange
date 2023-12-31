import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  // ...other imports
} from '@mui/material';
import axios from 'axios';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosInstance from '../config/AxiosInstance';

import Page from '../admin/components/Page';

export default function ReportedWebsite() {
  const [ReportedWebsite, setReportedWebsite] = useState([]);

  useEffect(() => {
    async function fetchReportedWebsite() {
      try {
        // Retrieve the decodedToken from localStorage
        const decodedToken = localStorage.getItem('decodedToken');

        if (decodedToken) {
          const parsedToken = JSON.parse(decodedToken);
          const userId = parsedToken.userId?.user_id; // Extracting user_id from decodedToken

          // Update formData with the user_id
          //   setFormData((prevData) => ({ ...prevData, user_id: userId }));

          const response = await axiosInstance.get(`/reportedwebsite/reported/${userId}`);
          if (response.status === 200) {
            setReportedWebsite(response.data.data);
            console.log('response.data.data', response.data.data);
          } else {
            throw new Error('Failed to fetch reported websites');
          }
        } else {
          throw new Error('User ID not found in decoded token');
        }
      } catch (error) {
        console.error(error);
        // Handle error state if needed
      }
    }

    fetchReportedWebsite();
  }, []);

  return (
    <Page title="Reported Website" sx={{ padding: '25px', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        Reported Website
      </Typography>
      {ReportedWebsite.length > 0 ? (
        ReportedWebsite.map((website) => (
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
                        color: website.reported ? 'red' : 'gray',
                        fontSize: '0.9em', // Adjust the size as needed
                        marginRight: '5px',
                      }}
                    />
                    <span style={{ color: website.reported ? 'red' : 'gray' }}>
                      {website.reported ? 'Reported' : 'Pending'}
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
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                    <div style={{ margin: '15px' }}>
                      <Button variant="contained" color="primary" sx={{ marginRight: '10px' }}>
                        Contact
                      </Button>
                      {/* <Button variant="contained" color="secondary" sx={{ backgroundColor: '#FF7F7F' }}>
                        Report
                      </Button> */}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No Reported Websites</Typography>
      )}
    </Page>
  );
}
