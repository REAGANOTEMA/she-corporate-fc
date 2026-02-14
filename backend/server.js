const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// =======================
// PostgreSQL connection
// =======================
const pool = require('./config/db');

// =======================
// Routes
// =======================
const ticketsRoutes = require('./routes/tickets');
const fansRoutes = require('./routes/fan');

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// API Routes
// =======================
app.use('/api/tickets', ticketsRoutes);
app.use('/api/fans', fansRoutes);

// =======================
// Serve Frontend
// =======================
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// =======================
// Catch-all route (Express v5 FIX)
// =======================
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// =======================
// Auto-create Tables
// =======================
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(120) NOT NULL,
        match VARCHAR(150) NOT NULL,
        seat_type VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        ticket_code VARCHAR(20) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS fan_stories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        story TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tables ready");
  } catch (err) {
    console.error("❌ Table creation error:", err);
  }
};

// Run table creation
createTables();

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
