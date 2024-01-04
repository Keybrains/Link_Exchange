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
  Tooltip,
} from '@mui/material';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/AxiosInstanceAdmin';

import Page from '../../components/Page';

export default function FreeWebsite() {
  const navigate = useNavigate();
  const [freeWebsites, setFreeWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');

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
        const updatedWebsites = freeWebsites.filter((website) => website._id !== selectedWebsite._id);
        setFreeWebsites(updatedWebsites);
        setOpenDeleteDialog(false);
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
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedWebsite(null);
    setActionType('');
  };

  const handleUpdate = (websiteId) => {
    navigate(`/admin/updatesite/${websiteId}`);
  };

  const handleToggleStatus = (websiteId, action) => {
    setSelectedWebsite(websiteId);
    setActionType(action);
    setOpenActionDialog(true);
  };

  const handleActionConfirm = async () => {
    try {
      const response = await axiosInstance.put(`website/toggle-status/${selectedWebsite}`);
      if (response.status === 200) {
        const updatedWebsites = freeWebsites.map((website) =>
          website._id === selectedWebsite ? { ...website, status: response.data.data.status } : website
        );
        setFreeWebsites(updatedWebsites);
      } else {
        throw new Error('Failed to toggle website status');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    } finally {
      setOpenActionDialog(false);
      setSelectedWebsite(null);
      setActionType('');
    }
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
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
                      {(() => {
                        switch (website.status) {
                          case 'deactivate':
                            return (
                              <Tooltip title="To Activate URL - Click Here">
                                <Button
                                  variant="outlined"
                                  onClick={() => handleToggleStatus(website._id, 'activate')}
                                  color="error"
                                >
                                  Deactivate
                                </Button>
                              </Tooltip>
                            );
                          case 'activate':
                            return (
                              <Tooltip title="To Deactivate URL - Click Here">
                                <Button
                                  variant="outlined"
                                  onClick={() => handleToggleStatus(website._id, 'deactivate')}
                                  style={{ color: 'green', borderColor: 'green' }}
                                >
                                  Activate
                                </Button>
                              </Tooltip>
                            );
                          default:
                            return (
                              <Tooltip title="This URL is not approved by admin">
                                <Button style={{ color: 'gray' }}>Pending</Button>
                              </Tooltip>
                            );
                        }
                      })()}
                    </TableCell>

                    <TableCell>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => handleUpdate(website._id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdate(website._id);
                          }
                        }}
                        style={{ cursor: 'pointer', marginRight: '10px', fontSize: '15px' }}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOpenDialog(website)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleOpenDialog(website);
                          }
                        }}
                        style={{ cursor: 'pointer', fontSize: '15px' }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
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
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button onClick={handleDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openActionDialog}
            onClose={() => setOpenActionDialog(false)}
            BackdropProps={{
              invisible: true,
              sx: { backdropFilter: 'blur(5px)' },
            }}
          >
            <DialogTitle>{actionType === 'activate' ? 'Activate Website' : 'Deactivate Website'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
              {`Are you sure you want to ${actionType === 'activate' ? 'activate' : 'deactivate'} this website?`}

              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenActionDialog(false)}>Cancel</Button>
              <Button onClick={handleActionConfirm} color="primary">
                Confirm
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
