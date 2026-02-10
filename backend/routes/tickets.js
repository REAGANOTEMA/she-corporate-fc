const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

router.post('/purchase', async (req, res) => {
  try {
    const { match, quantity, phoneNumber, provider } = req.body;
    const ticket = new Ticket({ match, quantity, phoneNumber, provider });
    await ticket.save();
    res.status(200).json({ message: 'Ticket purchase successful', ticket });
  } catch (err) {
    res.status(500).json({ error: 'Purchase failed', details: err.message });
  }
});

module.exports = router;
