// backend/server.js

// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');

const ticketsRoutes = require('./routes/tickets');
const fansRoutes = require('./routes/fans');

const app = express();

// Middleware
app.use(cors());              // Enable CORS for all routes
app.use(express.json());      // Replace body-parser (built-in in Express >=4.16)

// API Routes
app.use('/api/tickets', ticketsRoutes);
app.use('/api/fans', fansRoutes);

// Serve frontend (optional, only if you want Express to serve your frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all route for frontend routing (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
