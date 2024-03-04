const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const moment = require('moment');

router.post('/chat-messages', async (req, res) => {
  try {
    const { website_id, sender_id, receiver_id, message } = req.body;
    let participants = [sender_id, receiver_id].sort();
    const chat_id = participants.join('_');

    let chat = await ChatMessage.findOne({ chat_id });

    if (chat) {
      chat.messages.push({ sender_id, receiver_id, message });
      chat.updateAt = Date.now();
    } else {
      chat = new ChatMessage({
        chat_id,
        website_id,
        participants,
        messages: [{ sender_id, receiver_id, message }],
      });
    }

    const savedChatMessage = await chat.save();

    res.status(201).json({
      success: true,
      data: savedChatMessage,
      message: 'Chat message updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating chat message',
      error: error.message,
    });
  }
});


router.get('/chatuser/chat-messages/:userId/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params;

  let participants = [userId, otherUserId].sort();
  const chat_id = participants.join('_');

  try {
    const chat = await ChatMessage.findOne({ chat_id });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const sortedMessages = chat.messages.sort((a, b) => b.createAt - a.createAt).reverse();

    res.json({ data: sortedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/chatuser/unread-messages/:userId/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params;

  let participants = [userId, otherUserId].sort();
  const chat_id = participants.join('_');

  try {
    const chat = await ChatMessage.findOne({ chat_id });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found', unreadMessagesCount: 0 });
    }

    const unreadMessagesCount = chat.messages.reduce((count, message) => {
      if (message.receiver_id === userId && !message.read) {
        return count + 1;
      }
      return count;
    }, 0);

    res.json({ unreadMessagesCount });
  } catch (error) {
    console.error('Error fetching unread messages count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/chatuser/mark-messages-as-read/:userId/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params;

  let participants = [userId, otherUserId].sort();
  const chat_id = participants.join('_');

  try {
    const updateResult = await ChatMessage.updateOne(
      { chat_id },
      { $set: { "messages.$[elem].read": true } },
      {
        arrayFilters: [{ "elem.receiver_id": userId, "elem.read": false }],
        multi: true
      }
    );

    if (updateResult.nModified === 0) {
      return res.status(404).json({ message: 'No unread messages found or chat does not exist.' });
    }

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
