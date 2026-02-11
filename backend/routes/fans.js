const express = require('express');
const router = express.Router();
const FanStory = require('../models/fanstory');

// =======================
// Submit a new fan story
// =======================
router.post('/submit', async (req, res) => {
  try {
    const { name, story } = req.body;

    // Server-side validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name is required and must be at least 2 characters' });
    }
    if (!story || story.trim().length < 10) {
      return res.status(400).json({ error: 'Story is required and must be at least 10 characters' });
    }

    // Save to DB
    const fanStory = new FanStory({ name: name.trim(), story: story.trim() });
    await fanStory.save();

    res.status(201).json({
      message: 'Story submitted successfully',
      fanStory
    });
  } catch (err) {
    console.error('Error submitting fan story:', err);
    res.status(500).json({
      error: 'Submission failed',
      details: err.message
    });
  }
});

// =======================
// Get all fan stories
// =======================
router.get('/', async (req, res) => {
  try {
    const stories = await FanStory.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(stories);
  } catch (err) {
    console.error('Error fetching fan stories:', err);
    res.status(500).json({
      error: 'Failed to fetch stories',
      details: err.message
    });
  }
});

module.exports = router;
