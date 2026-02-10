const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Purchase a ticket
router.post('/purchase', async (req, res) => {
  try {
    const { match, quantity, phoneNumber, provider } = req.body;

    // Basic validation
    if (!match || !quantity || !phoneNumber || !provider) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const ticket = new Ticket({ match, quantity, phoneNumber, provider });
    await ticket.save();

    res.status(201).json({
      message: 'Ticket purchase successful',
      ticket
    });
  } catch (err) {
    console.error('Error purchasing ticket:', err);
    res.status(500).json({
      error: 'Purchase failed',
      details: err.message
    });
  }
});

// Get all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ purchasedAt: -1 }); // latest first
    res.status(200).json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: 'Failed to fetch tickets', details: err.message });
  }
});

module.exports = router;
