import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import axiosInstance from '../config/AxiosInstanceAdmin';

import Page from '../../components/Page';

export default function AllWebsite() {
  const [websites, setWebsites] = useState([]);

  const fetchWebsites = async () => {
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
  };

  useEffect(() => {
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

        // Fetch websites again after approving
        fetchWebsites();
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
        Approve Request
      </Typography>
      {websites.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#C3E0E5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>URL</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Country</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Language</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cost</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Is Paid</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Approved</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {websites.map((website) => (
                <TableRow key={website.website_id}>
                  <TableCell>{website.url}</TableCell>
                  <TableCell>{`${website.users?.firstname} ${website.users?.lastname}`}</TableCell>
                  <TableCell>{website.country}</TableCell>
                  <TableCell>{website.language}</TableCell>
                  <TableCell>
                    {website.costOfAddingBacklink} (${website.charges || 0})
                  </TableCell>
                  <TableCell>{website.isPaid ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{website.approved ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {!website.approved && (
                      <Button
                        variant="outlined"
                        onClick={() => handleApprove(website.website_id)}
                        // sx={{ backgroundColor: '#38AEEC', color: 'white' }} // Set the background color using sx prop
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No Approve Request</Typography>
      )}
    </Page>
  );
}
