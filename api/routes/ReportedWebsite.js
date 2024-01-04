const express = require('express');
const router = express.Router();
const ReportedWebsite = require('../models/ReportedWebsite');

// Endpoint to handle saving reported websites
router.post('/reportedwerbsites', async (req, res) => {
  try {
    const { url, message, website_id, user_id } = req.body;

    const reportedWebsite = new ReportedWebsite({
      url,
      message,
      website_id,
      user_id,
    });

    await reportedWebsite.save();

    res.status(201).json({
      success: true,
      message: 'Reported website saved successfully',
      data: reportedWebsite,
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

module.exports = router;
