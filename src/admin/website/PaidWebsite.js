import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import axiosInstance from '../config/AxiosInstanceAdmin';
import Page from '../../components/Page';

export default function PaidWebsite() {
  const [paidWebsites, setPaidWebsites] = useState([]);
  const [deleteWebsiteId, setDeleteWebsiteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchWebsites() {
      try {
        const response = await axiosInstance.get('website/websites/paid');
        if (response.status === 200) {
          setPaidWebsites(response.data.data);
          console.log(response.data.data);
        } else {
          throw new Error('Failed to fetch paid websites');
        }
      } catch (error) {
        console.error(error);
        // Handle error state if needed
      }
    }

    fetchWebsites();
  }, []);

  const handleDeleteWebsite = async () => {
    try {
      const response = await axiosInstance.delete(`/website/websites/paid/${deleteWebsiteId}`);
      if (response.status === 200) {
        // Remove the deleted website from the paidWebsites state
        setPaidWebsites(paidWebsites.filter((website) => website.website_id !== deleteWebsiteId));
        setDeleteWebsiteId(null);
        setOpenDialog(false);
      } else {
        throw new Error('Failed to delete website');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    }
  };

  const openDeleteDialog = (websiteId) => {
    setDeleteWebsiteId(websiteId);
    const selected = paidWebsites.find((website) => website.website_id === websiteId);
    setSelectedWebsite(selected);
    setOpenDialog(true);
  };

  const handleUpdate = (websiteId) => {
    navigate(`/admin/updatesite/${websiteId}`);
  };

  return (
    <Page title="All paidWebsites" sx={{ padding: '25px', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        Paid Websites
      </Typography>
      {paidWebsites.length > 0 ? (
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Is Paid</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Approved</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>{' '}
                  {/* Added Actions column for delete button */}
                </TableRow>
              </TableHead>
              <TableBody>
                {paidWebsites.map((website) => (
                  <TableRow key={website.website_id}>
                    <TableCell>{website.url}</TableCell>
                    <TableCell>
                      {website.users?.firstname} {website.users?.lastname}
                    </TableCell>
                    <TableCell>{website.country}</TableCell>
                    <TableCell>{website.language}</TableCell>
                    <TableCell>
                      {website.costOfAddingBacklink} (${website.charges})
                    </TableCell>
                    <TableCell>{website.isPaid ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{website.approved ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        sx={{ marginRight: '10px' }}
                        onClick={() => handleUpdate(website._id)} // Use handleUpdate function on button click
                      >
                        Update
                      </Button>
                      <Button variant="outlined" onClick={() => openDeleteDialog(website.website_id)} color="error">
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
              sx: { backdropFilter: 'blur(4px)' },
            }}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography> Are you sure you want to delete the website: {selectedWebsite?.url}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteWebsite} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography>No Paid Websites</Typography>
      )}
    </Page>
  );
}
