const express = require('express');
const router = express.Router();
const ReportedWebsite = require('../models/ReportedWebsite');
const Website = require('../models/WebSite');
const Signup = require('../models/Signup');
const moment = require('moment');

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

router.get('/reported/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

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


router.get('/reportedwebsites', async (req, res) => {
  try {
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
      data: updatedReportedWebsites.reverse(),
      message: 'Reported websites retrieved successfully with associated user information',
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.put('/updateReportedStatus/:websiteId', async (req, res) => {
  const { websiteId } = req.params;

  try {

    const updatedWebsite = await Website.findOneAndUpdate(
      { website_id: websiteId, reported: true },
      { $set: { reported: false } },
      { new: true }
    );

    if (!updatedWebsite) {
      return res.status(404).json({ success: false, message: 'Reported website not found or already updated' });
    }

    res.status(200).json({ success: true, data: updatedWebsite });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update reported status', error: error.message });
  }
});

router.delete('/deletereportedwebsite/:websiteId', async (req, res) => {
  const { websiteId } = req.params;

  try {
 
    const deletedWebsite = await ReportedWebsite.findOneAndDelete({ website_id: websiteId });

    if (!deletedWebsite) {
      return res.status(404).json({ success: false, message: 'Reported website not found' });
    }

    res.status(200).json({ success: true, message: 'Reported website deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete reported website', error: error.message });
  }
});

router.put('/reportedwebsite/toggle-status/:websiteId', async (req, res) => {
  try {
    const websiteId = req.params.websiteId;
    const website = await Website.findOne({ website_id: websiteId });

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
      });
    }

    const { reason } = req.body;

    website.approved = false;
    website.status = 'pending';

    website.reported = false;

    website.reason = reason || 'No reason provided';

    await website.save();

    res.status(200).json({
      success: true,
      message: 'Website details updated successfully',
      data: website,
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
