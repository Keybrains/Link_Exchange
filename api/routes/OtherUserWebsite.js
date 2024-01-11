const express = require('express');
const router = express.Router();
const Website = require('../models/WebSite');
const Signup = require('../models/Signup');
const moment = require('moment');
const ReportedWebsite = require('../models/ReportedWebsite');

router.get('/websites-not-matching-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from route parameters

    const websites = await Website.find({ user_id: { $ne: userId } });

    res.json({
      success: true,
      data: websites.reverse(), // Reverse the order of the array
      message: 'Websites retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving websites',
      error: error.message,
    });
  }
});

router.get('/paid-websites-not-matching-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const paidWebsites = await Website.find({ user_id: { $ne: userId }, costOfAddingBacklink: { $ne: 'Free' } });

    res.json({
      success: true,
      data: paidWebsites.reverse(), // Reverse the order of the array
      message: 'Paid websites retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving paid websites',
      error: error.message,
    });
  }
});

router.get('/free-websites-not-matching-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const freeWebsites = await Website.find({ user_id: { $ne: userId }, costOfAddingBacklink: 'Free' });

    res.json({
      success: true,
      data: freeWebsites.reverse(), // Reverse the order of the array
      message: 'Free websites retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving free websites',
      error: error.message,
    });
  }
});

module.exports = router;
