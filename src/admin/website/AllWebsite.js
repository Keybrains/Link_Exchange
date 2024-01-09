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
  Tooltip,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/AxiosInstanceAdmin';
import Page from '../../components/Page';

export default function AllWebsite() {
  const [websites, setWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleApprove = (websiteId) => {
    const selected = websites.find((website) => website.website_id === websiteId);
    setSelectedWebsite(selected);
    setApproveDialogOpen(true);
  };

  const handleReject = (websiteId) => {
    const selected = websites.find((website) => website.website_id === websiteId);
    setSelectedWebsite(selected);
    setRejectDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    try {
      const response = await axiosInstance.put(`/website/approve/${selectedWebsite.website_id}`);
      if (response.status === 200) {
        const updatedWebsites = websites.map((website) => {
          if (website.website_id === selectedWebsite.website_id) {
            return { ...website, approved: true };
          }
          return website;
        });
        setWebsites(updatedWebsites);
        setApproveDialogOpen(false);
        fetchWebsites();
      } else {
        throw new Error('Failed to approve website');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    }
  };

  const handleConfirmReject = async () => {
    try {
      const response = await axiosInstance.put(`/website/reject/${selectedWebsite.website_id}`);
      if (response.status === 200) {
        setRejectDialogOpen(false);
        fetchWebsites();
      } else {
        throw new Error('Failed to reject website');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    }
  };
  const handleRowClick = (websiteId) => {
    navigate(`/admin/websitedetail/${websiteId}`);
  };

  return (
    <Page title="Approve Request" sx={{ padding: '25px', overflow: 'hidden' }}>
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
                <TableRow
                  key={website.website_id}
                  onClick={() => handleRowClick(website.website_id)}
                  style={{ cursor: 'pointer' }}
                >
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
                      <>
                        <Tooltip title="To Approve - Click Here">
                          <Button
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(website.website_id);
                            }}
                            style={{ marginRight: '10px' }}
                          >
                            Approve
                          </Button>
                        </Tooltip>
                        <Tooltip title="To Reject - Click Here">
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(website.website_id);
                            }}
                          >
                            Reject
                          </Button>
                        </Tooltip>
                      </>
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
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        aria-labelledby="approve-dialog-title"
        aria-describedby="approve-dialog-description"
      >
        <DialogTitle id="approve-dialog-title">Confirm Approve</DialogTitle>
        <DialogContent>
          <DialogContentText id="approve-dialog-description">
            Are you sure you want to approve this website?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmApprove} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        aria-labelledby="reject-dialog-title"
        aria-describedby="reject-dialog-description"
      >
        <DialogTitle id="reject-dialog-title">Confirm Reject</DialogTitle>
        <DialogContent>
          <DialogContentText id="reject-dialog-description">
            Are you sure you want to reject this website?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmReject} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
