// NotificationItem.js

import PropTypes from 'prop-types';
import { ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import Iconify from '../../components/Iconify';

const NotificationItem = ({ notification }) => {
  const renderFirstLetter = () => {
    if (notification.sender && notification.sender.firstname && notification.sender.lastname) {
      const storedBackgroundColor = localStorage.getItem('avatarBackgroundColor');
      const storedTextColor = localStorage.getItem('avatarTextColor');

      const backgroundColor = storedBackgroundColor || getRandomLightColor();
      const textColor = storedTextColor || getRandomBrightColor();

      localStorage.setItem('avatarBackgroundColor', backgroundColor);
      localStorage.setItem('avatarTextColor', textColor);

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
          }}
        >
          {`${notification.sender.firstname.charAt(0)}${notification.sender.lastname.charAt(0)}`}
        </div>
      );
    }
    return 'U'; // Default letter
  };

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
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
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
        }
      />
    </ListItemButton>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default NotificationItem;

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
