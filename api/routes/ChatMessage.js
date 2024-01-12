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

router.get('/chat-messages', async (req, res) => {
  try {
    // Retrieve all chat messages from the database
    const chatMessages = await ChatMessage.find();

    res.status(200).json({
      success: true,
      data: chatMessages,
      message: 'Chat messages retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving chat messages',
      error: error.message,
    });
  }
});

router.get('/chatuser/chat-messages/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch chat messages for the specified user
    const messages = await ChatMessage.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }],
    }).sort({ createdAt: 1 });

    res.json({ data: messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/chatuser/chat-messages/:otherUserId', async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user.user_id;

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

// Assuming you have a model named `ChatMessage` for your messages
// router.get('/sender-ids', async (req, res) => {
//   try {
//     const senderIds = await ChatMessage.distinct('sender_id');
//     res.status(200).json({
//       success: true,
//       data: senderIds,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error getting sender IDs',
//       error: error.message,
//     });
//   }
// });

// router.get('/messages/:senderId', async (req, res) => {
//   try {
//     const senderId = req.params.senderId;
//     const messages = await ChatMessage.find({ sender_id: senderId });
//     res.status(200).json({
//       success: true,
//       data: messages,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error getting messages',
//       error: error.message,
//     });
//   }
// });

// router.get('/messages/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Find messages where the sender_id is the provided user_id or the receiver_id is the provided user_id
//     const messages = await ChatMessage.find({
//       $or: [
//         { sender_id: userId, receiver_id: userId },
//         { sender_id: userId, receiver_id: userId },
//       ],
//     });

//     res.status(200).json({
//       success: true,
//       data: messages,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error getting messages',
//       error: error.message,
//     });
//   }
// });

// router.get('/messages/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Find all messages where the sender_id or receiver_id is the provided user_id
//     const messages = await ChatMessage.find({
//       $or: [
//         { sender_id: userId },
//         { receiver_id: userId },
//       ],
//     });

//     res.status(200).json({
//       success: true,
//       data: messages,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error getting messages',
//       error: error.message,
//     });
//   }
// });

// router.get('/unique-ids/:user_id', async (req, res) => {
//   try {
//     const user_id = req.params.user_id;

//     // Find unique sender and receiver IDs based on user_id
//     const uniqueIds = await ChatMessage.distinct('receiver_id', {
//       $or: [{ sender_id: user_id }, { receiver_id: user_id }],
//     });

//     res.status(200).json({
//       success: true,
//       data: uniqueIds,
//       message: 'Unique sender and receiver IDs retrieved successfully',
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving unique sender and receiver IDs',
//       error: error.message,
//     });
//   }
// });

// router.get('/abc/:user_id', async (req, res) => {
//   try {
//     const user_id = req.params.user_id;

//     // Find messages excluding sender_id or receiver_id matching user_id
//     const messages = await ChatMessage.find({
//       $nor: [

//           { sender_id: { $ne: user_id } },
//           { receiver_id: { $ne: user_id } }

//       ]
//     });

//     res.json(messages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

module.exports = router;
