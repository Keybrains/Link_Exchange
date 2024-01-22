// NotificationList.js

import { Box, Divider, Button } from '@mui/material';
import Scrollbar from '../../components/Scrollbar';
import NotificationItem from './AdminNotificationItem'; // Create NotificationItem component

const NotificationList = ({ notifications }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Divider sx={{ borderStyle: 'dashed' }} />

      <Scrollbar sx={{ height: '100%' }}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.sender_id} notification={notification} />
        ))}
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* <Box sx={{ p: 1 }}>
        <Button fullWidth disableRipple>
          View All
        </Button>
      </Box> */}
    </Box>
  );
};

export default NotificationList;
