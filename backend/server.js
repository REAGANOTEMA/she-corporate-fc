const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// =======================
// PostgreSQL connection
// =======================
const pool = require('./config/db'); // Make sure db.js exports the Pool instance

// =======================
// Routes
// =======================
const ticketsRoutes = require('./routes/tickets');
const fansRoutes = require('./routes/fan'); // make sure file name matches

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Catch-all route (for SPA or plain HTML)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
