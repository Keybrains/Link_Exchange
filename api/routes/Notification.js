// notificationRoutes.js

const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const moment = require('moment');
const Signup = require('../models/Signup');
const AdminSignup = require('../models/AdminSignup');

router.post('/notifications', async (req, res) => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, '0');
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;

    const notificationUniqueId = (req.body['chat_id'] = uniqueId);
    // Extract necessary fields from the request body
    const { website_id, sender_id, receiver_id } = req.body;

    const newNotification = new Notification({
      notification_id: notificationUniqueId,
      website_id,
      sender_id,
      receiver_id,
      createAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updateAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      // Add any other notification-related fields as needed
    });

    const savedNotification = await newNotification.save();

    res.status(201).json({
      success: true,
      data: savedNotification,
      message: 'Notification created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message,
    });
  }
});

router.get('/unread-notifications/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const unreadNotificationsCount = await Notification.countDocuments({
      receiver_id: userId,
      isUnRead: true,
    });

    const unreadNotifications = await Notification.find({
      receiver_id: userId,
      isUnRead: true,
    });

    const senderIds = unreadNotifications.map((notification) => notification.sender_id);

    const senders = await Promise.all([
      Signup.find({ user_id: { $in: senderIds } }, 'user_id firstname lastname'),
      AdminSignup.find({ user_id: { $in: senderIds } }, 'user_id firstname lastname'),
    ]);

    const senderDetailsMap = {};

    // Process sender details from Signup collection
    senders[0].forEach((sender) => {
      senderDetailsMap[sender.user_id] = {
        firstname: sender.firstname,
        lastname: sender.lastname,
      };
    });

    // Process sender details from AdminSignup collection
    senders[1].forEach((sender) => {
      senderDetailsMap[sender.user_id] = {
        firstname: sender.firstname,
        lastname: sender.lastname,
      };
    });

    const response = {};

    unreadNotifications.forEach((notification) => {
      const senderId = notification.sender_id.toString();
      if (!response[senderId]) {
        response[senderId] = {
          sender_id: senderId,
          sender: senderDetailsMap[senderId],
          count: 1,
        };
      } else {
        response[senderId].count++;
      }
    });

    res.json({ unreadNotificationsCount, unreadNotifications: Object.values(response) });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/mark-read/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all unread notifications for the given user
    const unreadNotifications = await Notification.find({
      receiver_id: userId,
      isUnRead: true,
    });

    // Update the isUnRead status for each notification to false
    await Promise.all(
      unreadNotifications.map(async (notification) => {
        notification.isUnRead = false;
        await notification.save();
      })
    );

    res.json({ message: 'Notifications marked as read successfully' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/mark-read/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    // Find the specific notification using sender_id and receiver_id
    const notification = await Notification.findOne({
      sender_id: senderId,
      receiver_id: receiverId,
      isUnRead: true,
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or already marked as read' });
    }

    // Update the isUnRead status for the notification to false
    notification.isUnRead = false;
    await notification.save();

    res.json({ message: 'Notification marked as read successfully' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
