const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Submit a fan story
router.post('/submit', async (req, res) => {
  try {
    const { name, story } = req.body;
    if (!name || name.trim().length < 2) return res.status(400).json({ error: 'Name is required' });
    if (!story || story.trim().length < 10) return res.status(400).json({ error: 'Story is required' });

    const insertQuery = `
      INSERT INTO fan_stories (name, story)
      VALUES ($1,$2)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [name.trim(), story.trim()]);
    res.status(201).json({ message: 'Story submitted', fanStory: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit story', details: err.message });
  }
});

// Get all fan stories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fan_stories ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stories', details: err.message });
  }
});

module.exports = router;
