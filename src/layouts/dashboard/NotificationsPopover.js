// NotificationsPopover.js

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IconButton, Badge, Tooltip, Typography, Box, Divider, Button } from '@mui/material';
import Iconify from '../../components/Iconify';
import MenuPopover from '../../components/MenuPopover';
import Scrollbar from '../../components/Scrollbar';
import NotificationList from './NotificationList'; // Create NotificationList component
import axiosInstance from '../../config/AxiosInstance';

const NotificationsPopover = () => {
  const [notificationsData, setNotificationsData] = useState(null);
  const [open, setOpen] = useState(null);
  const loggedInUserId = JSON.parse(localStorage.getItem('decodedToken'))?.userId?.user_id;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`notification/unread-notifications/${loggedInUserId}`);
      const data = response.data;
      setNotificationsData(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    // Call fetchData on component mount
    fetchData();
  }, [loggedInUserId]);

  const handleMarkRead = async (senderId) => {
    try {
      await axiosInstance.put(`notification/mark-read/${senderId}/${loggedInUserId}`);
      // Fetch updated notifications after marking as read
      fetchData(); // Call fetchData to update notificationsData
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // Logic to mark all as read (replace with your actual API call)
  const handleMarkAllAsRead = () => {
    // Your logic here
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={notificationsData?.unreadNotificationsCount || 0} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">Notifications</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You have {notificationsData?.unreadNotificationsCount} unread messages
              </Typography>
            </Box>

            {/* {notificationsData?.unreadNotificationsCount > 0 && (
              <Tooltip title="Mark all as read">
                <Button color="primary" onClick={handleMarkAllAsRead}>
                  Mark All as Read
                </Button>
              </Tooltip>
            )} */}
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Scrollbar sx={{ height: '100%' }}>
            {notificationsData?.unreadNotifications && (
              <NotificationList
                notifications={notificationsData.unreadNotifications}
                navigate={navigate}
                onMarkRead={handleMarkRead}
                onClosePopover={handleClose}
              />
            )}
          </Scrollbar>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {/* <Box sx={{ p: 1 }}>
            <Button fullWidth disableRipple>
              View All
            </Button>
          </Box> */}
        </Box>
      </MenuPopover>
    </>
  );
};

export default NotificationsPopover;
