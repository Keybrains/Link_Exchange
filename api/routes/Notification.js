const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const moment = require('moment');
const Signup = require('../models/Signup');
const AdminSignup = require('../models/AdminSignup');

router.post('/notifications', async (req, res) => {
  try {
    const { website_id, sender_id, receiver_id } = req.body;
    
    const notification_id = [sender_id, receiver_id].sort().join('_');

    const newNotificationDetail = {
      website_id,
      sender_id,
      receiver_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let notificationThread = await Notification.findOne({ notification_id });

    if (notificationThread) {
      notificationThread.notifications.push(newNotificationDetail);
      notificationThread.updatedAt = new Date();
    } else {
      notificationThread = new Notification({
        notification_id,
        participants: [sender_id, receiver_id].sort(),
        notifications: [newNotificationDetail],
      });
    }

    await notificationThread.save();

    res.status(201).json({
      success: true,
      message: 'Notification created/updated successfully',
    });
  } catch (error) {
    console.error('Error creating/updating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating/updating notification',
      error: error.message,
    });
  }
});


router.get('/unread-notifications/:userId', async (req, res) => {
  const { userId } = req.params;

  try {

    const threads = await Notification.find({
      participants: userId,
      "notifications.isUnRead": true,
    });

    let unreadNotificationsCount = 0;
    const senderDetailsMap = {};
    const response = {};

    for (const thread of threads) {
      const unreadNotifications = thread.notifications.filter(notification => notification.receiver_id === userId && notification.isUnRead);

      unreadNotificationsCount += unreadNotifications.length;

      for (const notification of unreadNotifications) {
        const senderId = notification.sender_id;

        if (!senderDetailsMap[senderId]) {
          const sender = await Signup.findOne({ user_id: senderId }, 'user_id firstname lastname') ||
                         await AdminSignup.findOne({ user_id: senderId }, 'user_id firstname lastname');

          if (sender) {
            senderDetailsMap[senderId] = {
              firstname: sender.firstname,
              lastname: sender.lastname,
            };
          }
        }

        if (!response[senderId]) {
          response[senderId] = {
            sender_id: senderId,
            sender: senderDetailsMap[senderId],
            count: 1,
          };
        } else {
          response[senderId].count++;
        }
      }
    }

    res.json({ unreadNotificationsCount, unreadNotifications: Object.values(response) });
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/mark-read/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const threads = await Notification.find({
      participants: userId,
      "messages.isUnRead": true,
      "messages.receiver_id": userId,
    });

    await Promise.all(threads.map(async (thread) => {
      thread.messages.forEach((message) => {
        if (message.receiver_id === userId && message.isUnRead) {
          message.isUnRead = false;
        }
      });
      await thread.save();
    }));

    res.json({ message: 'All notifications marked as read successfully' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/mark-read/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
  
    const thread = await Notification.findOne({
      participants: { $all: [senderId, receiverId] },
      notifications: {
        $elemMatch: {
          sender_id: senderId,
          receiver_id: receiverId,
          isUnRead: true,
        },
      },
    });

    if (!thread) {
      return res.status(404).json({ error: 'Notification thread not found or no unread messages' });
    }

    thread.notifications.forEach((notification) => {
      if (notification.sender_id === senderId && notification.receiver_id === receiverId && notification.isUnRead) {
        notification.isUnRead = false;
      }
    });

    await thread.save();

    res.json({ message: 'Notifications marked as read successfully' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
