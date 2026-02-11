const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket.');

// =======================
// POST /api/tickets/purchase
// Purchase a ticket
// =======================
router.post('/purchase', async (req, res) => {
  try {
    let { match, quantity, phoneNumber, provider } = req.body;

    // Trim strings
    match = match ? match.trim() : '';
    provider = provider ? provider.trim() : '';
    phoneNumber = phoneNumber ? phoneNumber.trim() : '';

    // Validate match
    if (!match) {
      return res.status(400).json({ error: 'Match name is required' });
    }

    // Validate quantity
    quantity = Number(quantity);
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    // Validate phone number (Uganda: 077, 078, 075 prefixes)
    const phoneRegex = /^(?:\+?256|0)?(7[78]|75)\d{7}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: 'Enter a valid Ugandan phone number' });
    }

    // Validate provider
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }

    // Create and save ticket
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

// =======================
// GET /api/tickets
// Get all tickets
// =======================
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ purchasedAt: -1 }); // newest first
    res.status(200).json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({
      error: 'Failed to fetch tickets',
      details: err.message
    });
  }
});

module.exports = router;
