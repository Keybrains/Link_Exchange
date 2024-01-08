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

export default function ReportedWebsite() {
  const [reportedWebsites, setreportedWebsites] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);

  useEffect(() => {
    async function fetchWebsites() {
      try {
        const response = await axiosInstance.get('reportedwebsite/reportedwebsites');
        if (response.status === 200) {
          setreportedWebsites(response.data.data);
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
        setreportedWebsites(updatedWebsites);

        const deleteResponse = await axiosInstance.delete(`reportedwebsite/deletereportedwebsite/${selectedWebsiteId}`);

        if (deleteResponse.status === 200) {
          // After successful deletion, fetch the updated reported websites
          const response = await axiosInstance.get('/reportedwebsite/reportedwebsites');
          if (response.status === 200) {
            setreportedWebsites(response.data.data);
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

  return (
    <Page title="Reported Website" sx={{ padding: '25px', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
        Reported Websites
      </Typography>
      {reportedWebsites.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#C3E0E5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>URL</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportedWebsites.map((website) => (
                  <TableRow key={website._id}>
                    <TableCell>{website.url}</TableCell>
                    <TableCell>
                      {website.user?.firstname} {website.user?.lastname}
                    </TableCell>
                    <TableCell>{website.message}</TableCell>
                    <TableCell>
                      {!website.resolved && (
                        <Tooltip title="To Resolve - Click Here">
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => resolveReportedWebsite(website.website_id)}
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
    </Page>
  );
}
