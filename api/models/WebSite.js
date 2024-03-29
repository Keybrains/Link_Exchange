const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  website_id: {
    type: String,
    unique: true,
  },
  url: {
    type: String,
  },
  image: {
    type: String,
  },
  backlink: {
    type: String,
  },
  monthlyVisits: {
    type: Number,
  },
  DA: {
    type: Number,
  },
  spamScore: {
    type: Number,
  },
  categories: {
    type: [String],
  },
  linkType: {
    type: String,
  },
  country: {
    type: String,
  },
  reason: {
    type: String,
  },
  language: {
    type: String,
  },
  surfaceInGoogleNews: {
    type: String,
  },
  backlinksAllowed: {
    type: Number,
  },
  costOfAddingBacklink: {
    type: String,
  },
  charges: {
    type: Number,
  },
  linkTime: {
    type: String,
  },
  isPaid: {
    type: Boolean,
  },
  createAt: {
    type: String,
  },
  updateAt: {
    type: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'pending',
  },
  reported: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Website', WebsiteSchema);
