import React, { useEffect, useState } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/AxiosInstanceAdmin';

import Page from '../../components/Page';

export default function FreeWebsite() {
  const navigate = useNavigate();
  const [freeWebsites, setFreeWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function fetchWebsites() {
      try {
        const response = await axiosInstance.get('website/websites/free');
        if (response.status === 200) {
          setFreeWebsites(response.data.data);
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

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`website/websites/free/${selectedWebsite._id}`);
      if (response.status === 200) {
        // Refresh free websites after deletion
        const updatedWebsites = freeWebsites.filter((website) => website._id !== selectedWebsite._id);
        setFreeWebsites(updatedWebsites);
        setOpenDialog(false);
        setSelectedWebsite(null);
      } else {
        throw new Error('Failed to delete website');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    }
  };

  const handleOpenDialog = (website) => {
    setSelectedWebsite(website);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWebsite(null);
  };

  const handleUpdate = (websiteId) => {
    navigate(`/admin/updatesite/${websiteId}`);
  };

  return (
    <Page title="All Free Websites" sx={{ padding: '25px', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        Free Websites
      </Typography>
      {freeWebsites.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#C3E0E5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>URL</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Country</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Language</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cost</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Approved</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {freeWebsites.map((website) => (
                  <TableRow key={website._id}>
                    <TableCell>{website.url}</TableCell>
                    <TableCell>
                      {website.users?.firstname} {website.users?.lastname}
                    </TableCell>
                    <TableCell>{website.country}</TableCell>
                    <TableCell>{website.language}</TableCell>
                    <TableCell>{website.costOfAddingBacklink}</TableCell>
                    <TableCell>{website.approved ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        sx={{ marginRight: '10px' }}
                        onClick={() => handleUpdate(website._id)} // Use handleUpdate function on button click
                      >
                        Update
                      </Button>
                      <Button variant="outlined" onClick={() => handleOpenDialog(website)} color="error">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            BackdropProps={{
              invisible: true,
              sx: { backdropFilter: 'blur(5px)' },
            }}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the website: {selectedWebsite && selectedWebsite.url}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography>No Free Website</Typography>
      )}
    </Page>
  );
}
