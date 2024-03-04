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
  TextField,
  Box
} from '@mui/material';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from 'xlsx';
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
  const [searchQuery, setSearchQuery] = useState('');

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
        setUsers(users.filter((user) => user.user_id !== deleteUserId));
        setDeleteUserId(null);
        setOpenDeleteDialog(false);
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusToggle = async (userId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/signup/users/${userId}/updateStatus`, { status: newStatus });

      if (response.status === 200) {
        const updatedResponse = await axiosInstance.get(`/signup/users`);
        if (updatedResponse.status === 200) {
          setUsers(updatedResponse.data.data);
        } else {
          throw new Error('Failed to fetch updated user data');
        }
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowClick = (userId) => {
    navigate(`/admin/userdetail/${userId}`);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phonenumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (userId) => {
    navigate(`/admin/edituserdetail/${userId}`);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user) => ({
        'First Name': user.firstname,
        'Last Name': user.lastname,
        Email: user.email,
        'Phone Number': user.phonenumber,
        Status: user.status,
        'Created On': formatDate(user.createAt),
      }))
    );

    const wscols = [
      { wch: Math.max(...users.map((user) => user.firstname.length)) },
      { wch: Math.max(...users.map((user) => user.lastname.length)) },
      { wch: Math.max(...users.map((user) => user.email.length)) },
      { wch: Math.max(...users.map((user) => user.phonenumber.length)) },
      { wch: 10 },
      { wch: 15 },
    ];

    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    XLSX.writeFile(workbook, 'UsersData.xlsx');
  };

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
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="15px">
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginBottom: '15px' }}
          />
            <Button onClick={downloadExcel} variant="contained" color="primary">
              Download Excel
            </Button>
          </Box>
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
                          <Tooltip title="edit">
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate(user.user_id);
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') handleNavigate();
                              }}
                              style={{ cursor: 'pointer', fontSize: '15px', paddingLeft: '10px' }}
                            >
                              <FontAwesomeIcon icon={faPencilAlt} />
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
