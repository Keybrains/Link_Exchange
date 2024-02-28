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
  TablePagination,
  TextField,
} from '@mui/material';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from '../config/AxiosInstanceAdmin';

import Page from '../../components/Page';

export default function FreeWebsite() {
  const navigate = useNavigate();
  const [freeWebsites, setFreeWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  useEffect(() => {
    async function fetchWebsites() {
      try {
        const response = await axiosInstance.get('website/websites/free');
        if (response.status === 200) {
          setFreeWebsites(response.data.data);
          setLoading(false);
        } else {
          throw new Error('Failed to fetch websites');
        }
      } catch (error) {
        console.error(error);
        setLoading(false);

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

  const handleRowClick = (websiteId) => {
    navigate(`/admin/websitedetail/${websiteId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to filter websites based on search query
  const filteredWebsites = freeWebsites.filter(
    (website) =>
      website.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${website.users?.firstname} ${website.users?.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.costOfAddingBacklink.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.approved.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.reported.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.status.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );
    
  return (
    <Page title="Free Websites" sx={{ paddingX: '10px', overflow: 'hidden' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Typography variant="h4">Free Websites</Typography>

          {/* Search Input */}
          <TextField
            label="Search"
            variant="outlined"
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {filteredWebsites.length > 0 ? (
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Reported</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? filteredWebsites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredWebsites
                    ).map((website) => (
                      <TableRow
                        key={website._id}
                        onClick={() => handleRowClick(website.website_id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell>{website.url}</TableCell>
                        <TableCell>
                          {website.users?.firstname} {website.users?.lastname}
                        </TableCell>
                        <TableCell>{website.country}</TableCell>
                        <TableCell>{website.language}</TableCell>
                        <TableCell>{website.costOfAddingBacklink}</TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ marginBottom: '5px' }}>{website.approved ? 'Yes' : 'No'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ marginBottom: '5px', color: website.reported ? 'red' : 'initial' }}>
                              {website.reported ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {(() => {
                            switch (website.status) {
                              case 'deactivate':
                                return (
                                  <Tooltip title="To Activate URL - Click Here">
                                    <Button
                                      variant="outlined"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleStatus(website._id, 'activate');
                                      }}
                                      color="error"
                                    >
                                      Inactive
                                    </Button>
                                  </Tooltip>
                                );
                              case 'activate':
                                return (
                                  <Tooltip title="To Deactivate URL - Click Here">
                                    <Button
                                      variant="outlined"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleStatus(website._id, 'deactivate');
                                      }}
                                      style={{ color: 'green', borderColor: 'green' }}
                                    >
                                      Active
                                    </Button>
                                  </Tooltip>
                                );
                              case 'rejected':
                                return (
                                  <Tooltip title="This URL is rejected">
                                    <Button
                                      style={{ color: 'red' }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      Rejected
                                    </Button>
                                  </Tooltip>
                                );
                              default:
                                return (
                                  <Tooltip title="This URL is not approved by admin">
                                    <Button
                                      style={{ color: 'gray' }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      Pending
                                    </Button>
                                  </Tooltip>
                                );
                            }
                          })()}
                        </TableCell>

                        <TableCell>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate(website._id);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdate(website._id);
                              }
                            }}
                            style={{
                              cursor: website.status === 'rejected' ? 'not-allowed' : 'pointer',
                              marginRight: '10px',
                              fontSize: '15px',
                              opacity: website.status === 'rejected' ? 0.5 : 1,
                            }}
                          >
                            {website.status === 'rejected' ? (
                              <Tooltip title="This website is rejected">
                                <span>
                                  <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Edit">
                                <FontAwesomeIcon icon={faPencilAlt} />
                              </Tooltip>
                            )}
                          </span>
                          <Tooltip title="Delete">
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog(website);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleOpenDialog(website);
                                }
                              }}
                              style={{ cursor: 'pointer', fontSize: '15px' }}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <hr style={{ borderTop: '1px solid black', width: '100%', margin: '20px 0' }} />

              <TablePagination
                component="div"
                count={filteredWebsites.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 15, 20, 25, { label: 'All', value: -1 }]}s
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) => (
                  <div style={{ fontSize: '14px', fontStyle: 'italic', marginTop: '5px' }}>
                    Showing {from}-{to} of {count !== -1 ? count : 'more than'}
                  </div>
                )}
                SelectProps={{
                  style: { marginBottom: '10px' },
                  renderValue: (value) => `${value} rows`,
                }}
                nextIconButtonProps={{
                  style: {
                    marginBottom: '5px',
                  },
                }}
                backIconButtonProps={{
                  style: {
                    marginBottom: '5px',
                  },
                }}
              />
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
        </>
      )}
    </Page>
  );
}
