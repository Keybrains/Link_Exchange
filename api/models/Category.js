const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  category_id: {
    type: String,
  },
  category: {
    type: String,
  },
  createAt: {
    type: String,
  },
  updateAt: {
    type: String,
  },
});

module.exports = mongoose.model('Category', ProjectSchema);
