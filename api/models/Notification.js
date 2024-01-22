const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notification_id: {
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
  isUnRead: {
    type: Boolean,
    default: true,
  },
  createAt: {
    type: String,
  },
  updateAt: {
    type: String,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
