const express = require('express');
const router = express.Router();
const { createFanStory, getFanStories } = require('../models/fanstory');

// =======================
// POST /api/fans
// Submit a new fan story
// =======================
router.post('/', async (req, res) => {
  try {
    const { name, story } = req.body;

    // Pass as object
    const newStory = await createFanStory({ name, story });

    res.status(201).json(newStory);
  } catch (err) {
    console.error('Error creating fan story:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// =======================
// GET /api/fans
// Get all fan stories
// =======================
router.get('/', async (req, res) => {
  try {
    const stories = await getFanStories();
    res.status(200).json(stories);
  } catch (err) {
    console.error('Error fetching fan stories:', err.message);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

module.exports = router;
