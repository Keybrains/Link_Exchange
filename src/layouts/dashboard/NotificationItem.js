// NotificationItem.js

import PropTypes from 'prop-types';
import { ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Button } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, navigate, onMarkRead, onClosePopover }) => {
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

  const getLightColor = () => {
    const letters = 'ABCDEF';
    let lightColor = '#';
    for (let i = 0; i < 3; i += 1) {
      lightColor += letters[Math.floor(Math.random() * 6)]; // Use only lighter colors (A to F)
    }
    return lightColor;
  };

  const getBrightColor = () => {
    const letters = '123456';
    let brightColor = '#';
    for (let i = 0; i < 3; i += 1) {
      brightColor += letters[Math.floor(Math.random() * 6)]; // Use only bright colors (1 to 6)
    }
    return brightColor;
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

      const backgroundColor = storedBackgroundColor || getLightColor(notification.sender_id);
      const textColor = storedTextColor || getBrightColor(notification.sender_id);

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

  NotificationItem.propTypes = {
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
                navigate('/user/chateduser', {
                  state: {
                    firstname: notification.sender?.firstname,
                    user_id: notification?.sender_id,
                    lastname: notification.sender?.lastname,
                  },
                });
                onClosePopover();
                window.location.reload();
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

export default NotificationItem;
