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
  DialogTitle,
  Tooltip,
} from '@mui/material';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from '../config/AxiosInstanceAdmin';
import Page from '../../components/Page';

export default function User() {
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [activateUserId, setActivateUserId] = useState(null);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get('/signup/users');
        if (response.status === 200) {
          setUsers(response.data.data);
        } else {
          throw new Error('Failed to fetch users');
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        // Handle error state if needed
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    if (deleteUserId) {
      const userToDelete = users.find((user) => user.user_id === deleteUserId);
      setDeleteUser(userToDelete);
      setOpenDeleteDialog(true);
    }
  }, [deleteUserId, users]);

  const handleDeleteUser = async () => {
    try {
      const response = await axiosInstance.delete(`/signup/users/${deleteUserId}`);
      if (response.status === 200) {
        // Remove the deleted user from the users state
        setUsers(users.filter((user) => user.user_id !== deleteUserId));
        setDeleteUserId(null);
        setOpenDeleteDialog(false);
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    }
  };

  // ... (previous code remains unchanged)

  const handleStatusToggle = async (userId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/signup/users/${userId}/updateStatus`, { status: newStatus });

      if (response.status === 200) {
        // Fetch the updated user data after status change
        const updatedResponse = await axiosInstance.get(`/signup/users`);

        if (updatedResponse.status === 200) {
          // Update the local state with the fetched updated user data
          setUsers(updatedResponse.data.data);
        } else {
          throw new Error('Failed to fetch updated user data');
        }
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    }
  };

  const handleRowClick = (userId) => {
    navigate(`/admin/userdetail/${userId}`);
  };

  return (
    <Page title="User" sx={{ padding: '25px', overflow: 'hidden' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
            All User
          </Typography>
          {users.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#C3E0E5' }}>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.user_id}
                        onClick={() => handleRowClick(user.user_id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell>{user.firstname}</TableCell>
                        <TableCell>{user.lastname}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phonenumber}</TableCell>
                        <TableCell>
                          {user.status === 'deactivate' ? (
                            <Tooltip title="To Activate - Click Here">
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivateUserId(user.user_id);
                                  setOpenActivateDialog(true);
                                }}
                              >
                                Inactive
                              </Button>
                            </Tooltip>
                          ) : (
                            <Tooltip title="To Deactivate - Click Here">
                              <Button
                                variant="outlined"
                                style={{ color: 'green', borderColor: 'green' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivateUserId(user.user_id);
                                  setOpenActivateDialog(true);
                                }}
                              >
                                Active
                              </Button>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Delete">
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteUserId(user.user_id);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setDeleteUserId(user.user_id);
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
              <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                BackdropProps={{
                  invisible: true,
                  sx: { backdropFilter: 'blur(4px)' },
                }}
              >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                  <Typography>
                    Are you sure you want to delete {deleteUser && deleteUser.firstname}{' '}
                    {deleteUser && deleteUser.lastname}?
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteUser} color="secondary">
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={openActivateDialog}
                onClose={() => setOpenActivateDialog(false)}
                BackdropProps={{
                  invisible: true,
                  sx: { backdropFilter: 'blur(4px)' },
                }}
              >
                {/* Content for activate/deactivate dialog */}
                <DialogTitle>Confirm Status Change</DialogTitle>
                <DialogContent>
                  <Typography>
                    {activateUserId &&
                      `Are you sure you want to ${
                        users.find((user) => user.user_id === activateUserId)?.status === 'activate'
                          ? 'deactivate'
                          : 'activate'
                      } this user?`}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenActivateDialog(false)} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusToggle(activateUserId, users.find((user) => user.user_id === activateUserId)?.status);
                      setOpenActivateDialog(false);
                    }}
                    color="secondary"
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <Typography>No User</Typography>
          )}
        </>
      )}
    </Page>
  );
}
