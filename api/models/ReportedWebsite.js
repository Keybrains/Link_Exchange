const mongoose = require('mongoose');

const ReportedWebsiteSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  website_id: {
    type: String,
  },
  url: {
    type: String,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model('ReportedWebsite', ReportedWebsiteSchema);
