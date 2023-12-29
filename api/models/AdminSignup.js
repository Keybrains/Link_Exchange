const mongoose = require('mongoose');
// const generateLongUniqueId= require('../routes/UniqueIdGenerator');

// const longUniqueId = generateLongUniqueId();

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  companyname: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
  },
  phonenumber: {
    type: Number,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  createAt: {
    type: String,
  },
  updateAt: {
    type: String,
  },
});

module.exports = mongoose.model('AdminSignup', UserSchema);
