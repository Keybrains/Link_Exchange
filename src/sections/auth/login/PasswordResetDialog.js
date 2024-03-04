import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../../config/AxiosInstance';

const PasswordResetDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      await axiosInstance.post('/Signup/change-password', { email, oldPassword, newPassword });
      toast.success('Password changed successfully');
      onClose();
    } catch (error) {
      console.error(error.response?.data?.message);

      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data.message;

        if (statusCode === 404) {
          toast.error('User not found.');
        } else if (statusCode === 401) {
          toast.error('Old password is incorrect.');
        } else {
          toast.error(errorMessage || 'Failed to change password. Please try again later.');
        }
      } else {
        toast.error('An error occurred while processing your request.');
      }
    }
  };

  const handleHelpClick = () => {
    window.open('https://swapalink.com/contact', '_blank');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            variant="standard"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="standard"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <Typography
            style={{
              color: '#010ED0',
              cursor: 'pointer',
              fontWeight: 'normal',
              fontSize: '16px',
              transition: 'color 0.3s ease-in-out',
            }}
          >
            If you forgot your password, contact{' '}
            <span
              style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onClick={handleHelpClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleHelpClick();
              }}
            >
               admin
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleChangePassword}>Reset Password</Button>
        </DialogActions>
      </Dialog>
      <Toaster />
    </>
  );
};
export default PasswordResetDialog;
