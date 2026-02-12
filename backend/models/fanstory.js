// backend/models/fanstory.js

const pool = require('../config/db');

// =======================
// Create new fan story
// =======================
const createFanStory = async ({ name, story }) => {
  try {
    // Trim inputs first
    name = name?.trim();
    story = story?.trim();

    // Validation
    if (!name || name.length < 2 || name.length > 50) {
      throw new Error('Name must be between 2 and 50 characters');
    }

    if (!story || story.length < 10 || story.length > 1000) {
      throw new Error('Story must be between 10 and 1000 characters');
    }

    // Remove HTML tags (basic sanitization)
    const cleanStory = story.replace(/<\/?[^>]+(>|$)/g, '');

    const query = `
      INSERT INTO fan_stories (name, story)
      VALUES ($1, $2)
      RETURNING id, name, story, created_at;
    `;

    const values = [name, cleanStory];

    const result = await pool.query(query, values);

    return result.rows[0];

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

    const result = await pool.query(query);
    return result.rows;

  } catch (error) {
    console.error('Fetch Fan Stories Error:', error.message);
    throw error;
  }
};

module.exports = {
  createFanStory,
  getFanStories
};
