const express = require('express');
const router = express.Router();
const moment = require('moment');
const Signup = require('../models/Signup');
const AdminSignup = require('../models/AdminSignup');
const { createToken } = require('../utils/authhelper');
const crypto = require('crypto');

const encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', 'vaibhav');
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (text) => {
  const decipher = crypto.createDecipher('aes-256-cbc', 'vaibhav');
  let decrypted = decipher.update(text, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};

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
    const hashedPassword = encrypt(req.body.password);

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

    const user = await Signup.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ${
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) ? 'email' : 'username'
        } '${identifier}' does not exist`,
      });
    }

    const decryptedPassword = decrypt(user.password);

    if (password !== decryptedPassword) {
      return res.status(422).json({ message: 'Old password is incorrect.' });
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
    const users = await Signup.find();

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found',
      });
    }

    res.json({
      success: true,
      data: users.reverse(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

router.get('/allusers', async (req, res) => {
  try {
    const usersSignup = await Signup.find();

    const usersAdminSignup = await AdminSignup.find();

    const allUsers = [...usersSignup, ...usersAdminSignup];

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found',
      });
    }

    res.json({
      success: true,
      data: allUsers.reverse(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

router.delete('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

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

    const user = await Signup.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updatedStatus = user.status === 'activate' ? 'deactivate' : 'activate';

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

router.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Signup.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = decrypt(user.password);

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

router.get('/allusers/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const userSignup = await Signup.findOne({ user_id: userId });

    const userAdminSignup = await AdminSignup.findOne({ user_id: userId });

    if (!userSignup && !userAdminSignup) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userData = userSignup || userAdminSignup;

    res.json({
      success: true,
      data: userData,
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
    const updatedSender = await Signup.findOneAndUpdate(
      { user_id: userId },
      { $addToSet: { chateduser: receiver_id } },
      { new: true }
    );

    if (!updatedSender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    const updatedReceiver = await Signup.findOneAndUpdate(
      { user_id: receiver_id },
      { $addToSet: { chateduser: userId } },
      { new: true }
    );

    if (!updatedReceiver) {
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

router.put('/signup/allusers/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { receiver_id } = req.body;

  try {
    const updatedSender = await Signup.findOneAndUpdate(
      { user_id: userId },
      { $addToSet: { chateduser: receiver_id } },
      { new: true }
    );

    if (!updatedSender) {
      const updatedSenderAdmin = await AdminSignup.findOneAndUpdate(
        { user_id: userId },
        { $addToSet: { chateduser: receiver_id } },
        { new: true }
      );

      if (!updatedSenderAdmin) {
        return res.status(404).json({ message: 'Sender not found' });
      }

      return res.json({
        message: 'Users updated successfully',
        sender: updatedSenderAdmin,
        receiver: null,
      });
    }

    const updatedReceiver = await Signup.findOneAndUpdate(
      { user_id: receiver_id },
      { $addToSet: { chateduser: userId } },
      { new: true }
    );

    if (!updatedReceiver) {
      const updatedReceiverAdmin = await AdminSignup.findOneAndUpdate(
        { user_id: receiver_id },
        { $addToSet: { chateduser: userId } },
        { new: true }
      );

      if (!updatedReceiverAdmin) {
        return res.status(404).json({ message: 'Receiver not found' });
      }

      return res.json({
        message: 'Users updated successfully',
        sender: updatedSender,
        receiver: updatedReceiverAdmin,
      });
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
    const user = await Signup.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const chatedUsers = user.chateduser;

    return res.json({ chatedUsers });
  } catch (error) {
    console.error('Error getting chated users:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/signup/users/:userId/chatedallusers', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userSignup = await Signup.findOne({ user_id: userId });

    if (!userSignup) {
      const userAdminSignup = await AdminSignup.findOne({ user_id: userId });

      if (!userAdminSignup) {
        return res.status(404).json({ message: 'User not found' });
      }

      const chatedUsersAdmin = userAdminSignup.chateduser.reverse();

      return res.json({ chatedUsers: chatedUsersAdmin });
    }

    const chatedUsersSignup = userSignup.chateduser.reverse();

    return res.json({ chatedUsers: chatedUsersSignup });
  } catch (error) {
    console.error('Error getting chated users:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/editusers/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    let updatedUserData = req.body;

    if (updatedUserData.hasOwnProperty('password') && updatedUserData.password) {
      updatedUserData.password = encrypt(updatedUserData.password);
    }

    const updatedUser = await Signup.findOneAndUpdate({ user_id: userId }, updatedUserData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found for update',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

router.post('/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const user = await Signup.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const decryptedOldPassword = decrypt(user.password);
    if (oldPassword !== decryptedOldPassword) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    const encryptedNewPassword = encrypt(newPassword);
    user.password = encryptedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
