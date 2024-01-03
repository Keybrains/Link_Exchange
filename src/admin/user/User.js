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
  DialogTitle,
} from '@mui/material';
import axiosInstance from '../config/AxiosInstanceAdmin';
import Page from '../../components/Page';

export default function User() {
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get('/signup/users');
        if (response.status === 200) {
          setUsers(response.data.data);
        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (error) {
        console.error(error);
        // Handle error state if needed
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    if (deleteUserId) {
      const userToDelete = users.find((user) => user.user_id === deleteUserId);
      setDeleteUser(userToDelete);
      setOpenDialog(true);
    }
  }, [deleteUserId, users]);

  const handleDeleteUser = async () => {
    try {
      const response = await axiosInstance.delete(`/signup/users/${deleteUserId}`);
      if (response.status === 200) {
        // Remove the deleted user from the users state
        setUsers(users.filter((user) => user.user_id !== deleteUserId));
        setDeleteUserId(null);
        setOpenDialog(false);
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    }
  };

  return (
    <Page title="User" sx={{ padding: '25px', overflow: 'hidden' }}>
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
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phonenumber}</TableCell>
                    <TableCell>
                      {/* <Button
                        variant="contained"
                      
                        onClick={() => setDeleteUserId(user.user_id)}
                        sx={{ backgroundColor: '#38AEEC', color: 'white' }}
                      >
                        Delete
                      </Button> */}

                      <Button variant="outlined" onClick={() => setDeleteUserId(user.user_id)} color="error">
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
              <Typography>
                Are you sure you want to delete {deleteUser && deleteUser.firstname} {deleteUser && deleteUser.lastname}
                ?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteUser} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography>No User</Typography>
      )}
    </Page>
  );
}
