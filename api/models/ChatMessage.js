const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  chat_id: {
    type: String,
  },
  website_id: {
    type: String,
  },
  sender_id: {
    type: String,
  },
  receiver_id: {
    type: String,
  },
  message: {
    type: String,
  },
  createAt: {
    type: String,
  },
  updateAt: {
    type: String,
  },
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
