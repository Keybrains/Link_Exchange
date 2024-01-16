const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage'); // Adjust the path based on your project structure
const moment = require('moment');

// POST a new chat message
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

    // Extract data from the request body
    const { website_id, sender_id, receiver_id, message } = req.body;

    // Create a new ChatMessage instance
    const newChatMessage = new ChatMessage({
      chat_id: chatUniqueId,
      website_id,
      sender_id,
      receiver_id,
      message,
      createAt: createTime,
      updateAt: updateTime,
    });

    // Save the new chat message to the database
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

// router.get('/chat-messages', async (req, res) => {
//   try {
//     // Retrieve all chat messages from the database
//     const chatMessages = await ChatMessage.find();

//     res.status(200).json({
//       success: true,
//       data: chatMessages,
//       message: 'Chat messages retrieved successfully',
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving chat messages',
//       error: error.message,
//     });
//   }
// });

// router.get('/chatuser/chat-messages/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Fetch chat messages for the specified user
//     const messages = await ChatMessage.find({
//       $or: [{ sender_id: userId }, { receiver_id: userId }],
//     }).sort({ createdAt: 1 });

//     res.json({ data: messages });
//   } catch (error) {
//     console.error('Error fetching chat messages:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// router.get('/chatuser/chat-messages/:otherUserId', async (req, res) => {
//   const { otherUserId } = req.params;
//   const userId = req.user.user_id;

//   try {
//     const messages = await ChatMessage.find({
//       $or: [
//         { sender_id: userId, receiver_id: otherUserId },
//         { sender_id: otherUserId, receiver_id: userId },
//       ],
//     }).sort({ createdAt: -1 });

//     res.json({ data: messages });
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

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

module.exports = router;
