const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  monthlyVisits: {
    type: Number,
    required: true,
  },
  DA: {
    type: Number,
    required: true,
  },
  spamScore: {
    type: Number,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
  },
  linkType: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  surfaceInGoogleNews: {
    type: Boolean,
    required: true,
  },
  backlinksAllowed: {
    type: Number,
    required: true,
  },
  costOfAddingBacklink: {
    type: String,
    required: true,
  },
  charges: {
    type: Number,
  },
  linkTime: {
    type: String,
    required: true,
  },
  isPaid: {
    type: Boolean,
    required: true,
  },
  createAt: {
    type: String,
  },
  updateAt: {
    type: String,
  },
});

module.exports = mongoose.model('Website', WebsiteSchema);
