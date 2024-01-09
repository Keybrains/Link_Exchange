const express = require('express');
const router = express.Router();
const ReportedWebsite = require('../models/ReportedWebsite');
const Website = require('../models/WebSite');
const Signup = require('../models/Signup');
const moment = require('moment');

// Endpoint to handle saving reported websites
router.post('/reportedwerbsites', async (req, res) => {
  try {
    const { url, message, website_id, user_id } = req.body;
    const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    const reportedWebsite = new ReportedWebsite({
      url,
      message,
      website_id,
      user_id,
      createAt: createTime,
      updateAt: updateTime,
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

//reported website url by user
router.get('/reported/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find reported websites for the user with reported status as true
    const reportedWebsites = await Website.find({
      user_id: userId,
      reported: true,
    });

    if (!reportedWebsites || reportedWebsites.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reported websites found for the user',
      });
    }

    const reversedReportedWebsites = reportedWebsites.reverse();

    return res.status(200).json({
      success: true,
      message: 'Reported websites with reported status retrieved successfully for the user',
      data: reversedReportedWebsites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

//get all reported website
// router.get('/reportedwebsites', async (req, res) => {
//   try {
//     // Find all reported websites
//     const reportedWebsites = await Website.find({ reported: true });

//     return res.status(200).json({
//       success: true,
//       message: 'Reported websites retrieved successfully',
//       data: reportedWebsites,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//     });
//   }
// });

router.get('/reportedwebsites', async (req, res) => {
  try {
    // Find all reported websites
    const reportedWebsites = await ReportedWebsite.find();

    const updatedReportedWebsites = await Promise.all(
      reportedWebsites.map(async (reportedWebsite) => {
        const userId = reportedWebsite.user_id;
        const user = await Signup.findOne({ user_id: userId });
        return { ...reportedWebsite.toObject(), user };
      })
    );

    res.json({
      statusCode: 200,
      data: updatedReportedWebsites,
      message: 'Reported websites retrieved successfully with associated user information',
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

// update report status
router.put('/updateReportedStatus/:websiteId', async (req, res) => {
  const { websiteId } = req.params;

  try {
    // Find the reported website by ID and update its reported status
    const updatedWebsite = await Website.findOneAndUpdate(
      { website_id: websiteId, reported: true },
      { $set: { reported: false } },
      { new: true }
    );

    if (!updatedWebsite) {
      return res.status(404).json({ success: false, message: 'Reported website not found or already updated' });
    }

    // Respond with the updated website
    res.status(200).json({ success: true, data: updatedWebsite });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update reported status', error: error.message });
  }
});

router.delete('/deletereportedwebsite/:websiteId', async (req, res) => {
  const { websiteId } = req.params;

  try {
    // Find the reported website by ID and delete it
    const deletedWebsite = await ReportedWebsite.findOneAndDelete({ website_id: websiteId });

    if (!deletedWebsite) {
      return res.status(404).json({ success: false, message: 'Reported website not found' });
    }

    // Respond with a success message
    res.status(200).json({ success: true, message: 'Reported website deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete reported website', error: error.message });
  }
});

module.exports = router;
