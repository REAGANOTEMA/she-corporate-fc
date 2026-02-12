// backend/models/fanstory.js

const pool = require('../config/db');

// =======================
// Create new fan story
// =======================
const createFanStory = async ({ name, story }) => {
  try {
    // Validation
    if (!name || name.trim().length < 2 || name.trim().length > 50) {
      throw new Error('Name must be between 2 and 50 characters');
    }

    if (!story || story.trim().length < 10 || story.trim().length > 1000) {
      throw new Error('Story must be between 10 and 1000 characters');
    }

    // Simple sanitization (remove HTML tags)
    const cleanStory = story.replace(/<\/?[^>]+(>|$)/g, '');

    const query = `
      INSERT INTO fan_stories (name, story)
      VALUES ($1, $2)
      RETURNING id, name, story, created_at;
    `;

    const values = [name.trim(), cleanStory.trim()];

    const { rows } = await pool.query(query, values);

    return rows[0];
  } catch (error) {
    console.error('Create Fan Story Error:', error.message);
    throw error;
  }
};

// =======================
// Get all fan stories
// =======================
const getFanStories = async () => {
  try {
    const query = `
      SELECT id, name, story, created_at
      FROM fan_stories
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Fetch Fan Stories Error:', error.message);
    throw error;
  }
};

module.exports = {
  createFanStory,
  getFanStories,
};
