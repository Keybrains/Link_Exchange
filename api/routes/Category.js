const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const moment = require('moment');

router.post('/category', async (req, res) => {
  const { category } = req.body;
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(5, 15);
  const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
    .toString()
    .padStart(10, '0');
  const uniqueId = `${timestamp}${randomString}${randomNumber}`;
  const categoryUniqueId = (req.body['category_id'] = uniqueId);
  const createTime = (req.body['createAt'] = moment().format('YYYY-MM-DD HH:mm:ss'));
  const updateTime = (req.body['updateAt'] = moment().format('YYYY-MM-DD HH:mm:ss'));

  try {
    const newCategory = new Category({
      category,
      createAt: createTime,
      updateAt: updateTime,
      category_id: categoryUniqueId,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error saving the category:', error);
    res.status(500).json({ message: 'Failed to save the category' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    let categories = await Category.find({});
    categories = categories.reverse();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

router.delete('/category/:category_id', async (req, res) => {
  const { category_id } = req.params;

  try {
    const deletedCategory = await Category.findOneAndDelete({ category_id: category_id });

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully', deletedCategory });
  } catch (error) {
    console.error('Error deleting the category:', error);
    res.status(500).json({ message: 'Failed to delete the category' });
  }
});

module.exports = router;
