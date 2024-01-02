const express = require('express');
const router = express.Router();
const Website = require('../models/WebSite');
const Signup = require('../models/Signup');
const moment = require('moment');

//post all website
router.post('/website', async (req, res) => {
  try {
    const existingWebsite = await Website.findOne({ url: req.body.url });

    if (existingWebsite) {
      return res.status(400).json({
        statusCode: 400,
        message: `The URL '${req.body.url}' already exists in the database.`,
      });
    } else {
      const countDocuments = await Website.countDocuments({});
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substr(5, 15);
      const uniqueId = `${timestamp}${randomString}${countDocuments + 1}`;
      const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const { url } = req.body;

      const newWebsiteData = new Website({
        url,
        website_id: uniqueId,
        createAt: createTime,
        updateAt: updateTime,
        ...req.body,
      });

      const savedData = await newWebsiteData.save();

      console.log('uniqueId', uniqueId);
      return res.status(200).json({
        statusCode: 200,
        message: 'URL added successfully.',
        data: savedData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});



router.get("/websites", async (req, res) => {
  try {
    const data = await Website.aggregate([
      { $match: {} } // This stage will match all documents in the collection
    ]);

    const count = await Website.countDocuments();

    for (let i = 0; i < data.length; i++) {
      const userId = data[i].user_id;

      const users = await Signup.findOne({ user_id: userId });

      data[i].users = users;
    }

    data.reverse(); // Reverse the order of the data array

    res.json({
      statusCode: 200,
      data: data,
      count: count,
      message: "Read All Request",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});




// Get all websites
// router.get('/websites', async (req, res) => {
//   try {
//     const websites = await Website.find();

//     if (!websites || websites.length === 0) {
//       return res.status(404).json({
//         statusCode: 404,
//         message: 'No websites found in the database.',
//       });
//     }

//     const reversedWebsites = websites.reverse();

//     return res.status(200).json({
//       statusCode: 200,
//       message: 'Websites retrieved successfully.',
//       data: reversedWebsites, // Send the reversed array
//     });
//   } catch (error) {
//     return res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

router.put('/approve/:websiteId', async (req, res) => {
  try {
    const websiteId = req.params.websiteId;
    const updatedWebsite = await Website.findOneAndUpdate(
      { website_id: websiteId },
      { $set: { approved: true } },
      { new: true }
    );

    if (!updatedWebsite) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Website approved successfully',
      data: updatedWebsite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

router.get('/approved-websites/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const approvedWebsites = await Website.find({ user_id: userId, approved: true });

    if (!approvedWebsites || approvedWebsites.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No approved websites found for the user',
      });
    }

    const reversedApprovedWebsites = approvedWebsites.reverse(); // Reverse the order of approvedWebsites

    return res.status(200).json({
      success: true,
      message: 'Approved websites retrieved successfully for the user',
      data: reversedApprovedWebsites, // Send the reversed array
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
