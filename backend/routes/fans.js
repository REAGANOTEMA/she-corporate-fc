const express = require('express'); 
const router = express.Router();
const FanStory = require('../models/FanStory');

// Submit a new fan story
router.post('/submit', async (req, res) => {
  try {
    const { name, story } = req.body;

    // Basic validation
    if (!name || !story) {
      return res.status(400).json({ error: 'Name and story are required' });
    }

    const fanStory = new FanStory({ name, story });
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

// Get all fan stories
router.get('/', async (req, res) => {
  try {
    const stories = await FanStory.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(stories);
  } catch (err) {
    console.error('Error fetching fan stories:', err);
    res.status(500).json({ error: 'Failed to fetch stories', details: err.message });
  }
});

module.exports = router;
