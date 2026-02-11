// =======================
// server.js
// =======================

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import API routes
const ticketsRoutes = require('./routes/tickets');
const fansRoutes = require('./routes/fans');

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json()); // replaces bodyParser

// =======================
// API Routes
// =======================
app.use('/api/tickets', ticketsRoutes);
app.use('/api/fans', fansRoutes);

// =======================
// MongoDB Connection
// =======================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// =======================
// Serve Frontend
// =======================
const frontendPath = path.join(__dirname, '../frontend');

app.use(express.static(frontendPath));

// IMPORTANT: must be AFTER API routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// =======================
// Global Error Handler
// =======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong on the server'
  });
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
