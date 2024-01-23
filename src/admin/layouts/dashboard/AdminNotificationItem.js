// AdminNotificationItem.js

import PropTypes from 'prop-types';
import { ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Button } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const AdminNotificationItem = ({ notification, navigate, onMarkRead, onClosePopover }) => {
  const getTimeDistance = () => {
    try {
      const createdAtDate = new Date(notification.createAt);
      if (!Number.isNaN(createdAtDate.getTime())) {
        return formatDistanceToNow(createdAtDate);
      }
    } catch (error) {
      console.error('Error formatting time distance:', error);
    }
    return '';
  };

  const getRandomLightColor = () => {
    const letters = 'ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * 6)];
    }
    return color;
  };

  const getRandomBrightColor = () => {
    const letters = '89ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * 8)];
    }
    return color;
  };

  const renderFirstLetter = () => {
    if (
      notification.sender &&
      notification.sender.firstname &&
      notification.sender.lastname &&
      notification.sender_id
    ) {
      const storedBackgroundColor = localStorage.getItem(`avatarBackgroundColor-${notification.sender_id}`);
      const storedTextColor = localStorage.getItem(`avatarTextColor-${notification.sender_id}`);

      const backgroundColor = storedBackgroundColor || getRandomLightColor(notification.sender_id);
      const textColor = storedTextColor || getRandomBrightColor(notification.sender_id);

      localStorage.setItem(`avatarBackgroundColor-${notification.sender_id}`, backgroundColor);
      localStorage.setItem(`avatarTextColor-${notification.sender_id}`, textColor);

      return (
        <div
          className="circle-avatar me-2"
          style={{
            fontSize: '1.2em',
            color: textColor,
            textTransform: 'uppercase',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: backgroundColor,
            cursor: 'pointer',
          }}
        >
          {`${notification.sender.firstname.charAt(0)}${notification.sender.lastname.charAt(0)}`}
        </div>
      );
    }

    return (
      <div
        className="circle-avatar me-2"
        style={{
          fontSize: '1.2em',
          color: 'white',
          textTransform: 'uppercase',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'gray',
          cursor: 'pointer',
        }}
      >
        A
      </div>
    );
  };

  AdminNotificationItem.propTypes = {
    notification: PropTypes.object.isRequired,
    onClosePopover: PropTypes.func.isRequired,
  };

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>{renderFirstLetter()}</ListItemAvatar>
      <ListItemText
        primary={notification.sender ? `${notification.sender.firstname} ${notification.sender.lastname}` : ''}
        secondary={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                color: 'text.disabled',
              }}
            >
              {/* <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} /> */}
              {/* {getTimeDistance()} */}
              {notification.count && (
                <span style={{ marginLeft: '1px', fontSize: '15px' }}>{`${notification.count} ${
                  notification.count === 1 ? 'Message' : 'Messages'
                }`}</span>
              )}
            </Typography>
            {/* Add your button here */}
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead(notification.sender_id, notification.receiver_id);
                navigate('/admin/discussions', {
                  state: {
                    firstname: notification.sender?.firstname,
                    user_id: notification?.sender_id,
                    lastname: notification.sender?.lastname,
                  },
                });
                window.location.reload();
                onClosePopover();
              }}
            >
              View
            </Button>
          </div>
        }
      />
    </ListItemButton>
  );
};

export default AdminNotificationItem;
