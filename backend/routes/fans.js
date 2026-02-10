const express = require('express');
const router = express.Router();
const FanStory = require('../models/FanStory');

router.post('/submit', async (req, res) => {
  try {
    const { name, story } = req.body;
    const fanStory = new FanStory({ name, story });
    await fanStory.save();
    res.status(200).json({ message: 'Story submitted successfully', fanStory });
  } catch (err) {
    res.status(500).json({ error: 'Submission failed', details: err.message });
  }
});

module.exports = router;
