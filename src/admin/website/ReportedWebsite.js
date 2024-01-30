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

export default function ReportedWebsite() {
  const [reportedWebsites, setReportedWebsites] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    async function fetchWebsites() {
      try {
        const response = await axiosInstance.get('reportedwebsite/reportedwebsites');
        if (response.status === 200) {
          setReportedWebsites(response.data.data);
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

  const resolveReportedWebsite = async (websiteId) => {
    setSelectedWebsiteId(websiteId);
    setOpenDialog(true);
  };

  const handleResolveConfirmation = async () => {
    try {
      const resolveResponse = await axiosInstance.put(`reportedwebsite/updateReportedStatus/${selectedWebsiteId}`);

      if (resolveResponse.status === 200) {
        const updatedWebsites = reportedWebsites.map((website) =>
          website._id === selectedWebsiteId ? { ...website, reported: false } : website
        );
        setReportedWebsites(updatedWebsites);

        const deleteResponse = await axiosInstance.delete(`reportedwebsite/deletereportedwebsite/${selectedWebsiteId}`);

        if (deleteResponse.status === 200) {
          // After successful deletion, fetch the updated reported websites
          const response = await axiosInstance.get('/reportedwebsite/reportedwebsites');
          if (response.status === 200) {
            setReportedWebsites(response.data.data);
          } else {
            throw new Error('Failed to fetch updated reported websites');
          }
        } else {
          throw new Error('Failed to delete reported website');
        }
      } else {
        throw new Error('Failed to resolve reported website');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRowClick = (websiteId) => {
    navigate(`/admin/reportedwebsitedetail/${websiteId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to filter reported websites based on search query
  const filteredReportedWebsites = reportedWebsites.filter(
    (website) =>
      website.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${website.user?.firstname} ${website.user?.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(website.createAt).toLocaleDateString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (!website.resolved && 'Resolve'.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Page title="Reported Website" sx={{ paddingX: '10px', overflow: 'hidden' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
            Reported Websites
          </Typography>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginBottom: '15px' }}
          />
          {filteredReportedWebsites.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#C3E0E5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>URL</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Reported by</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? filteredReportedWebsites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredReportedWebsites
                    ).map((website) => (
                      <TableRow
                        key={website._id}
                        onClick={() => handleRowClick(website.website_id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell>{website.url}</TableCell>
                        <TableCell>
                          {website.user?.firstname} {website.user?.lastname}
                        </TableCell>
                        <TableCell>{new Date(website.createAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {!website.resolved && (
                            <Tooltip title="To Resolve - Click Here">
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  resolveReportedWebsite(website.website_id);
                                }}
                              >
                                Resolve
                              </Button>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <hr style={{ borderTop: '1px solid black', width: '100%', margin: '20px 0' }} />

              <TablePagination
                component="div"
                count={filteredReportedWebsites.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 15, 25, { label: 'All', value: -1 }]}
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
            </>
          ) : (
            <Typography>No Reported Website</Typography>
          )}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to resolve this reported website?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleResolveConfirmation} color="primary">
                Resolve
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Page>
  );
}
