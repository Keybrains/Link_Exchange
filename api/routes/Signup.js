const express = require('express');
const router = express.Router();
const moment = require('moment');
const Signup = require('../models/Signup');
const { hashPassword, hashCompare, createToken } = require('../utils/authhelper');

router.post('/signup', async (req, res) => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, '0');
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;
    const userUniqueId = (req.body['user_id'] = uniqueId);
    const createTime = (req.body['createAt'] = moment().format('YYYY-MM-DD HH:mm:ss'));
    const updateTime = (req.body['updateAt'] = moment().format('YYYY-MM-DD HH:mm:ss'));
    const hashedPassword = await hashPassword(req.body.password);

    const newUser = new Signup({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      companyname: req.body.companyname,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      username: req.body.username,
      password: hashedPassword,
      createAt: createTime,
      updateAt: updateTime,
      user_id: userUniqueId,
    });

    await newUser.save();

    res.json({
      success: true,
      message: 'User SignUp Successful',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await Signup.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist',
      });
    }

    const compare = await hashCompare(req.body.password, user.password);

    if (!compare) {
      return res.status(422).json({
        success: false,
        message: 'Wrong password',
      });
    }

    const { token, expiresIn } = await createToken(user);

    res.json({
      success: true,
      data: user,
      expiresAt: expiresIn,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
});

router.get('/users', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await Signup.find();

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found',
      });
    }

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

//delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by user_id and delete it
    const deletedUser = await Signup.findOneAndDelete({ user_id: userId });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;
