const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const moment = require('moment');

router.post('/chat-messages', async (req, res) => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, '0');
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;

    const chatUniqueId = (req.body['chat_id'] = uniqueId);
    const createTime = (req.body['createAt'] = moment().format('YYYY-MM-DD HH:mm:ss'));
    const updateTime = (req.body['updateAt'] = moment().format('YYYY-MM-DD HH:mm:ss'));

    const { website_id, sender_id, receiver_id, message } = req.body;

    const newChatMessage = new ChatMessage({
      chat_id: chatUniqueId,
      website_id,
      sender_id,
      receiver_id,
      message,
      createAt: createTime,
      updateAt: updateTime,
    });

    const savedChatMessage = await newChatMessage.save();

    res.status(201).json({
      success: true,
      data: savedChatMessage,
      message: 'Chat message created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating chat message',
      error: error.message,
    });
  }
});

router.get('/chatuser/chat-messages/:userId/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender_id: userId, receiver_id: otherUserId },
        { sender_id: otherUserId, receiver_id: userId },
      ],
    }).sort({ createdAt: -1 });

    res.json({ data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/chatuser/unread-messages/:userId/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const unreadMessagesCount = await ChatMessage.countDocuments({
      receiver_id: userId,
      sender_id: otherUserId,
      read: false,
    });

    res.json({ unreadMessagesCount });
  } catch (error) {
    console.error('Error fetching unread messages count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/chatuser/mark-messages-as-read/:userId/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const updateResult = await ChatMessage.updateMany(
      {
        receiver_id: userId,
        sender_id: otherUserId,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    res.json({
      success: true,
      message: 'Unread messages marked as read successfully',
      updatedCount: updateResult.nModified,
    });
  } catch (error) {
    console.error('Error updating unread messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
