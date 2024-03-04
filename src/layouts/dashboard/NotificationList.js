import { Box, Divider, Button } from '@mui/material';
import Scrollbar from '../../components/Scrollbar';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications, navigate, onMarkRead, onClosePopover }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Divider sx={{ borderStyle: 'dashed' }} />

      <Scrollbar sx={{ height: '100%' }}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.sender_id}
            notification={notification}
            navigate={navigate}
            onMarkRead={onMarkRead}
            onClosePopover={onClosePopover}
          />
        ))}
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Box>
  );
};

export default NotificationList;
