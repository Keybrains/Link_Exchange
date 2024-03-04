const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notification_id: {
    type: String,
    required: true,
    unique: true,
  },
  participants: [String],
  notifications: [
    {
      website_id: String,
      sender_id: String,
      receiver_id: String,
      isUnRead: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

notificationSchema.index({ notification_id: 1 }, { unique: true });

module.exports = mongoose.model('Notification', notificationSchema);
