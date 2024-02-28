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
  TablePagination,
  TextField, // Import TextField for search input
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  // Function to filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phonenumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Page title="User" sx={{ paddingX: '10px', overflowY: 'hidden' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Typography variant="h4" gutterBottom sx={{ paddingBottom: '15px' }}>
            All User
          </Typography>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginBottom: '15px' }}
          />
          {filteredUsers.length > 0 ? (
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
                    {(rowsPerPage > 0
                      ? filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredUsers
                    ).map((user) => (
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

              <hr style={{ borderTop: '1px solid black', width: '100%', margin: '20px 0' }} />

              <TablePagination
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 15, 20, 25, { label: 'All', value: -1 }]}
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
