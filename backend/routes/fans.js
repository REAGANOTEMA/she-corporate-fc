const express = require('express');
const router = express.Router();
const { createFanStory, getFanStories } = require('../models/fan');

// =======================
// Submit a new fan story
// =======================
router.post('/submit', async (req, res) => {
  try {
    const { name, story } = req.body;
    const fanStory = await createFanStory(name, story);
    res.status(201).json({
      message: 'Story submitted successfully',
      fanStory
    });
  } catch (err) {
    console.error('Error submitting fan story:', err);
    res.status(400).json({ error: err.message });
  }
});

// =======================
// Get all fan stories
// =======================
router.get('/', async (req, res) => {
  try {
    const stories = await getFanStories();
    res.status(200).json(stories);
  } catch (err) {
    console.error('Error fetching fan stories:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
