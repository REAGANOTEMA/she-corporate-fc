const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const ticketsRoutes = require('./routes/tickets');
const fansRoutes = require('./routes/fans');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api/tickets', ticketsRoutes);
app.use('/api/fans', fansRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Catch all route to serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
