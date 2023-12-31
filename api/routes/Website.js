const express = require('express');
const router = express.Router();
const Website = require('../models/WebSite');
const Signup = require('../models/Signup');
const moment = require('moment');
const ReportedWebsite = require('../models/ReportedWebsite');

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

//get website all in admin
// router.get('/websites', async (req, res) => {
//   try {
//     const data = await Website.aggregate([
//       { $match: {} }, // This stage will match all documents in the collection
//     ]);

//     const count = await Website.countDocuments();

//     for (let i = 0; i < data.length; i++) {
//       const userId = data[i].user_id;

//       const users = await Signup.findOne({ user_id: userId });

//       data[i].users = users;
//     }

//     data.reverse(); // Reverse the order of the data array

//     res.json({
//       statusCode: 200,
//       data: data,
//       count: count,
//       message: 'Read All Request',
//     });
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

//get unapproved website in admin
router.get('/websites', async (req, res) => {
  try {
    const data = await Website.aggregate([
      { $match: { approved: false, status: 'pending' } }, // Match documents with approved: false
    ]);

    const count = await Website.countDocuments({ approved: false });

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
      message: 'Read Unapproved Websites Request',
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//get website free in admin
router.get('/websites/free', async (req, res) => {
  try {
    const freeWebsites = await Website.aggregate([
      { $match: { costOfAddingBacklink: 'Free' } }, // Match documents with costOfAddingBacklink as 'Free'
    ]);

    const count = await Website.countDocuments({ costOfAddingBacklink: 'Free' });

    for (let i = 0; i < freeWebsites.length; i++) {
      const userId = freeWebsites[i].user_id;

      const users = await Signup.findOne({ user_id: userId });

      freeWebsites[i].users = users;
    }

    freeWebsites.reverse(); // Reverse the order of the free websites array

    res.json({
      statusCode: 200,
      data: freeWebsites,
      count: count,
      message: 'Free websites retrieved successfully',
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//get website paid in admin
router.get('/websites/paid', async (req, res) => {
  try {
    const paidWebsites = await Website.aggregate([
      { $match: { costOfAddingBacklink: 'Paid' } }, // Match documents with costOfAddingBacklink as 'Paid'
    ]);

    const count = await Website.countDocuments({ costOfAddingBacklink: 'Paid' });

    for (let i = 0; i < paidWebsites.length; i++) {
      const userId = paidWebsites[i].user_id;

      const users = await Signup.findOne({ user_id: userId });

      paidWebsites[i].users = users;
    }

    paidWebsites.reverse(); // Reverse the order of the paid websites array

    res.json({
      statusCode: 200,
      data: paidWebsites,
      count: count,
      message: 'Paid websites retrieved successfully',
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

//put approve website in admin
router.put('/approve/:websiteId', async (req, res) => {
  try {
    const websiteId = req.params.websiteId;
    const updatedWebsite = await Website.findOneAndUpdate(
      { website_id: websiteId },
      { $set: { approved: true, status: 'activate' } },
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

// Update website status to activate or deactivate
router.put('/toggle-status/:websiteId', async (req, res) => {
  try {
    const websiteId = req.params.websiteId;
    const website = await Website.findById(websiteId);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
      });
    }

    // Toggle status between 'activate' and 'deactivate'
    const newStatus = website.status === 'activate' ? 'deactivate' : 'activate';
    website.status = newStatus;
    await website.save();

    res.status(200).json({
      success: true,
      message: `Website status updated to ${newStatus}`,
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

// router.get('/approved-websites/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const approvedWebsites = await Website.find({ user_id: userId, approved: true });

//     if (!approvedWebsites || approvedWebsites.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No approved websites found for the user',
//       });
//     }

//     const reversedApprovedWebsites = approvedWebsites.reverse(); // Reverse the order of approvedWebsites

//     return res.status(200).json({
//       success: true,
//       message: 'Approved websites retrieved successfully for the user',
//       data: reversedApprovedWebsites, // Send the reversed array
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//     });
//   }
// });

//get website all paid in user
router.get('/websites/paid/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find paid websites for the user based on the approved status
    const paidWebsites = await Website.find({
      user_id: userId,
      costOfAddingBacklink: 'Paid',
      approved: true, // Filter based on the approved status
      reported: false,
    });

    if (!paidWebsites || paidWebsites.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No approved paid websites found for the user',
      });
    }

    const reversedPaidWebsites = paidWebsites.reverse();

    return res.status(200).json({
      success: true,
      message: 'Approved paid websites retrieved successfully for the user',
      data: reversedPaidWebsites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

//get website all free in user
router.get('/websites/free/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const freeWebsites = await Website.find({
      user_id: userId,
      costOfAddingBacklink: 'Free',
      approved: true,
      reported: false,
    });

    if (!freeWebsites || freeWebsites.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No free websites found for the user',
      });
    }

    const reversedFreeWebsites = freeWebsites.reverse(); // Reverse the order of freeWebsites

    return res.status(200).json({
      success: true,
      message: 'Free websites retrieved successfully for the user',
      data: reversedFreeWebsites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

//get count
router.get('/website-count', async (req, res) => {
  try {
    const totalCount = await Website.countDocuments();

    const paidCount = await Website.countDocuments({ costOfAddingBacklink: 'Paid' });
    const freeCount = await Website.countDocuments({ costOfAddingBacklink: 'Free' });
    const reportedCount = await Website.countDocuments({ reported: true });

    res.json({
      statusCode: 200,
      totalCount,
      paidCount,
      freeCount,
      reportedCount,
      message: 'Website Counts',
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});
//get count by user id
router.get('/websites/count/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Count Free Websites
    const countFreeWebsites = await Website.countDocuments({
      user_id: userId,
      costOfAddingBacklink: 'Free',
      approved: true,
      reported: false,
    });

    // Count Paid Websites
    const countPaidWebsites = await Website.countDocuments({
      user_id: userId,
      costOfAddingBacklink: 'Paid',
      approved: true,
      reported: false,
    });

    // Count Total Websites
    const countTotalWebsites = await Website.countDocuments({ user_id: userId });

    // Count Pending Websites
    const countPendingWebsites = await Website.countDocuments({
      user_id: userId,
      status: { $in: ['pending', 'rejected'] },
    });

    // Count Reported Websites
    const countReportedWebsites = await Website.countDocuments({ user_id: userId, reported: true });

    return res.status(200).json({
      success: true,
      message: 'Website counts retrieved successfully',
      data: {
        countFreeWebsites,
        countPaidWebsites,
        countTotalWebsites,
        countPendingWebsites,
        countReportedWebsites,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});
//delete api for free and paid website

// Delete free websites by ID
router.delete('/websites/free/:id', async (req, res) => {
  try {
    const websiteId = req.params.id;
    const deletedWebsite = await Website.findByIdAndDelete(websiteId);

    if (!deletedWebsite) {
      return res.status(404).json({
        success: false,
        message: 'Free website not found for deletion',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Free website deleted successfully',
      data: deletedWebsite,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

// Delete paid websites by ID
router.delete('/websites/paid/:id', async (req, res) => {
  try {
    const websiteId = req.params.id;
    const deletedWebsite = await Website.findByIdAndDelete(websiteId);

    if (!deletedWebsite) {
      return res.status(404).json({
        success: false,
        message: 'Paid website not found for deletion',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Paid website deleted successfully',
      data: deletedWebsite,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

// Update a free or paid website by ID
router.put('/websites/:id', async (req, res) => {
  try {
    const websiteId = req.params.id;
    const updatedWebsiteData = req.body;

    // Assuming the 'isPaid' property in the website schema determines whether it's a paid website or not
    const isPaidWebsite = updatedWebsiteData.isPaid;

    const updatedWebsite = await Website.findByIdAndUpdate(websiteId, updatedWebsiteData, { new: true });

    if (!updatedWebsite) {
      return res.status(404).json({
        success: false,
        message: 'Website not found for update',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Website updated successfully',
      data: updatedWebsite,
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

// Get a particular website data by ID
router.get('/websites/:id', async (req, res) => {
  try {
    const websiteId = req.params.id;

    // Fetch website data by ID from the database
    const website = await Website.findById(websiteId);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
      });
    }

    res.status(200).json({
      success: true,
      data: website,
      message: 'Website retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

//reprt website status update
router.put('/updateReportedStatus/:websiteId', async (req, res) => {
  const { websiteId } = req.params;

  try {
    const updatedWebsite = await Website.findOneAndUpdate(
      { website_id: websiteId },
      { $set: { reported: true } },
      { new: true }
    );

    if (!updatedWebsite) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }

    res.status(200).json({ success: true, data: updatedWebsite });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update reported status' });
  }
});

//unapproved website by userid
router.get('/websites/not-approved/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find websites where approved status is false or status is 'rejected' and matches the user_id
    const notApprovedWebsites = await Website.find({
      user_id: userId,
      $or: [{ approved: false }, { status: 'rejected' }],
    });

    if (!notApprovedWebsites || notApprovedWebsites.length === 0) {
      return res.status(404).json({ success: false, message: 'No not approved or rejected websites found' });
    }

    res.status(200).json({ success: true, data: notApprovedWebsites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch not approved or rejected websites' });
  }
});

//reject website
router.put('/reject/:websiteId', async (req, res) => {
  const { websiteId } = req.params;

  try {
    // Assuming 'Website' is your Mongoose model representing websites in your database
    const updatedWebsite = await Website.findOneAndUpdate(
      { website_id: websiteId },
      { $set: { status: 'rejected' } }, // Update 'status' to 'rejected'
      { new: true }
    );

    if (!updatedWebsite) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }

    res.status(200).json({ success: true, data: updatedWebsite });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status to rejected' });
  }
});

// Get website details by ID
router.get('/websitesdetail', async (req, res) => {
  try {
    const websiteId = req.query.website_id;

    // Fetch website data by website_id from the database
    const website = await Website.findOne({ website_id: websiteId });

    // Check if the website is not found
    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
      });
    }

    const userId = website.user_id;

    // Fetch user details using the user_id from the website
    const user = await Signup.findOne({ user_id: userId });

    const reportedwebsiteId = website.website_id;

    const reportedWebsites = await ReportedWebsite.findOne({ website_id: reportedwebsiteId });

    // Combine website and user data into one response object
    const responseData = {
      website: website,
      user: user,
      reportedWebsites: reportedWebsites,
    };

    res.status(200).json({
      success: true,
      data: responseData,
      message: 'Website and User details retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

module.exports = router;
