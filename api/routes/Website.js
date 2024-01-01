const express = require('express');
const router = express.Router();
const Website = require('../models/WebSite');

router.post('/website', async (req, res) => {
  try {
    const { url, formData } = req.body;

    const newWebsiteData = new Website({
      url,
      ...formData,
    });

    await newWebsiteData.save();

    res.json({
      success: true,
      message: 'Data saved successfully',
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
