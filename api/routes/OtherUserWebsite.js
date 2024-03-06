const express = require('express');
const router = express.Router();
const Website = require('../models/WebSite');

router.get('/websites-not-matching-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const websites = await Website.find({ user_id: { $ne: userId }, status: 'activate', reported: false });

    res.json({
      success: true,
      data: websites.reverse(),
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

    const paidWebsites = await Website.find({
      user_id: { $ne: userId },
      costOfAddingBacklink: { $ne: 'Free' },
      status: 'activate',
    });

    res.json({
      success: true,
      data: paidWebsites.reverse(),
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

    const freeWebsites = await Website.find({
      user_id: { $ne: userId },
      costOfAddingBacklink: 'Free',
      status: 'activate',
    });

    res.json({
      success: true,
      data: freeWebsites.reverse(),
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
