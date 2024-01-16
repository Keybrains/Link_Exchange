const express = require('express');
const router = express.Router();
const moment = require('moment');
const Signup = require('../models/Signup');
const { hashPassword, hashCompare, createToken } = require('../utils/authhelper');

router.post('/signup', async (req, res) => {
  try {
    const existingEmailUser = await Signup.findOne({
      email: req.body.email,
    });

    const existingPhoneUser = await Signup.findOne({
      phonenumber: req.body.phonenumber,
    });

    const existingUserName = await Signup.findOne({
      username: req.body.username,
    });

    if (existingEmailUser) {
      return res.status(201).json({
        success: false,
        message: 'Email already exists',
      });
    }

    if (existingPhoneUser) {
      return res.status(202).json({
        success: false,
        message: 'Phone number already exists.',
      });
    }

    if (existingUserName) {
      return res.status(203).json({
        success: false,
        message: 'User Name already exists.',
      });
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, '0');
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;
    const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
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
      user_id: uniqueId,
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
    const { identifier, password } = req.body;

    // Check if the user exists by email or username
    const user = await Signup.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) ? 'email' : 'username'} '${identifier}' does not exist`,
      });
    }

    const compare = await hashCompare(password, user.password);

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
      message: error.message || 'Internal Server Error',
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
      data: users.reverse(), // Reverse the order of the array
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

router.put('/users/:userId/updateStatus', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by user_id
    const user = await Signup.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Toggle the status based on the current status
    const updatedStatus = user.status === 'activate' ? 'deactivate' : 'activate';

    // Update the user's status
    const updatedUser = await Signup.findOneAndUpdate(
      { user_id: userId },
      { $set: { status: updatedStatus } },
      { new: true }
    );

    res.json({
      success: true,
      message: `User status updated successfully to ${updatedStatus}`,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

//get one user details
router.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by user_id
    const user = await Signup.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

router.put('/signup/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { receiver_id } = req.body;

  try {
    // Find the sender by userId and update the chateduser field
    const updatedSender = await Signup.findOneAndUpdate(
      { user_id: userId },
      { $addToSet: { chateduser: receiver_id } },
      { new: true }
    );

    if (!updatedSender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Find the receiver by receiver_id and update the chateduser field
    const updatedReceiver = await Signup.findOneAndUpdate(
      { user_id: receiver_id },
      { $addToSet: { chateduser: userId } },
      { new: true }
    );

    if (!updatedReceiver) {
      // If the receiver is not found, you may want to handle this case accordingly
      return res.status(404).json({ message: 'Receiver not found' });
    }

    return res.json({
      message: 'Users updated successfully',
      sender: updatedSender,
      receiver: updatedReceiver,
    });
  } catch (error) {
    console.error('Error updating users:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/signup/users/:userId/chatedusers', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by userId and get the chateduser field
    const user = await Signup.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the list of chated users
    const chatedUsers = user.chateduser;

    return res.json({ chatedUsers });
  } catch (error) {
    console.error('Error getting chated users:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
