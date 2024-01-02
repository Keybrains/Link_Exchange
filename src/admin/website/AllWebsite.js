import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper ,Button } from '@mui/material';
import axiosInstance from '../config/AxiosInstanceAdmin';

import Page from '../../components/Page';

export default function AllWebsite() {
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    async function fetchWebsites() {
      try {
        const response = await axiosInstance.get('/website/websites');
        if (response.status === 200) {
          setWebsites(response.data.data);
          console.log(response.data.data); // Add this line for debugging
        } else {
          throw new Error('Failed to fetch websites');
        }
      } catch (error) {
        console.error(error);
        // Handle error state if needed
      }
    }

    fetchWebsites();
  }, []);

  const handleApprove = async (websiteId) => {
    try {
      const response = await axiosInstance.put(`/website/approve/${websiteId}`);
      if (response.status === 200) {
        // Update the approved status locally if needed
        const updatedWebsites = websites.map((website) => {
          if (website.website_id === websiteId) {
            return { ...website, approved: true };
          }
          return website;
        });
        setWebsites(updatedWebsites);
      } else {
        throw new Error('Failed to approve website');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    }
  };


  return (
    <Page title="All Websites" sx={{ padding: '25px', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        All Websites
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Cost of Adding Backlink</TableCell>
              <TableCell>Is Paid</TableCell>
              <TableCell>Approved</TableCell>
              {/* <TableCell>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {websites.map((website) => (
              <TableRow key={website.website_id}>
                <TableCell>{website.url}</TableCell>
                <TableCell>{website.users?.firstname} {website.users?.lastname}</TableCell>
                <TableCell>{website.country}</TableCell>
                <TableCell>{website.language}</TableCell>
                <TableCell>{website.costOfAddingBacklink}</TableCell>
                <TableCell>{website.isPaid ? 'Yes' : 'No'}</TableCell>
                <TableCell>{website.approved ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {!website.approved && (
                    <Button variant="contained" color="primary" onClick={() => handleApprove(website.website_id)}>
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  );
}
