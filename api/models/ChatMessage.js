const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  chat_id: { type: String, unique: true },
  website_id: String,
  participants: [String],
  messages: [
    {
      website_id: String,
      sender_id: String,
      receiver_id: String,
      message: String,
      read: {
        type: Boolean,
        default: false,
      },
      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now },
    },
  ],
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
