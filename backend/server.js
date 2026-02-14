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
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
