const express = require('express');
const router = express.Router();
const moment = require('moment');
const AdminSignup = require('../models/AdminSignup');
const { hashPassword, hashCompare, createToken } = require('../utils/authhelper');

router.post('/adminsignup', async (req, res) => {
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

    const newUser = new AdminSignup({
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
      message: 'Admin SignUp Successful',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

router.post('/adminlogin', async (req, res) => {
  try {
    const user = await AdminSignup.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin does not exist',
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

router.put('/adminchangepassword/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await AdminSignup.findOne({ user_id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    const compare = await hashCompare(oldPassword, user.password);

    if (!compare) {
      return res.status(422).json({
        success: false,
        message: 'Incorrect old password',
      });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    user.updateAt = moment().format('YYYY-MM-DD HH:mm:ss');

    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
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
