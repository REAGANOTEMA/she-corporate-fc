const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const generateTicketPDF = require('../utils/generateTicketPDF'); // make sure this file exists
const { createTicket, getTickets } = require('../models/ticket');

// =======================
// Email transporter
// =======================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// =======================
// POST /api/tickets/purchase
// =======================
router.post('/purchase', async (req, res) => {
  try {
    let { full_name, email, match, seat_type, quantity, phoneNumber, provider } = req.body;

    // ===================
    // Clean inputs
    // ===================
    full_name = full_name?.trim();
    email = email?.trim();
    match = match?.trim();
    seat_type = seat_type?.trim();
    phoneNumber = phoneNumber?.trim();
    provider = provider?.trim();

    // ===================
    // Validation
    // ===================
    if (!full_name || full_name.length < 2)
      return res.status(400).json({ error: 'Full name is required' });

    if (!email || !/.+@.+\..+/.test(email))
      return res.status(400).json({ error: 'Valid email is required' });

    if (!match)
      return res.status(400).json({ error: 'Match name is required' });

    if (!seat_type)
      return res.status(400).json({ error: 'Seat type is required' });

    quantity = Number(quantity);
    if (!quantity || quantity < 1)
      return res.status(400).json({ error: 'Quantity must be at least 1' });

    const phoneRegex = /^(07[78]\d{7}|075\d{7}|\+2567[78]\d{7})$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber))
      return res.status(400).json({ error: 'Valid Ugandan phone number required' });

    if (!provider)
      return res.status(400).json({ error: 'Provider is required' });

    // ===================
    // Generate ticket code
    // ===================
    const ticket_code = crypto.randomBytes(4).toString('hex').toUpperCase();

    // ===================
    // Save to PostgreSQL
    // ===================
    const ticket = await createTicket({
      full_name,
      email,
      match,
      seat_type,
      quantity,
      phoneNumber,
      provider,
      ticket_code
    });

    // ===================
    // Generate PDF Ticket
    // ===================
    let pdfPath = null;
    try {
      pdfPath = await generateTicketPDF(ticket); // must return full path
    } catch (pdfErr) {
      console.error('PDF generation error:', pdfErr);
    }

    // ===================
    // Email with attachment if PDF exists
    // ===================
    const mailOptions = {
      from: `"She Corporate FC" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Ticket for ${match}`,
      html: `
        <h2>Thank you for your purchase, ${full_name}!</h2>
        <p>Your ticket ${pdfPath ? 'is attached to this email' : 'has been generated'}.</p>
        <ul>
          <li><strong>Match:</strong> ${match}</li>
          <li><strong>Seat Type:</strong> ${seat_type}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          <li><strong>Ticket Code:</strong> <strong>${ticket_code}</strong></li>
        </ul>
        <p>Present this ticket code at the stadium entrance. ⚽</p>
      `,
      attachments: pdfPath ? [{ filename: `ticket-${ticket_code}.pdf`, path: pdfPath }] : []
    };

    transporter.sendMail(mailOptions)
      .then(() => console.log('✅ Ticket email sent'))
      .catch(err => console.error('Email sending failed:', err));

    // ===================
    // Response
    // ===================
    res.status(201).json({ message: 'Ticket purchased successfully', ticket });

  } catch (err) {
    console.error('Ticket purchase error:', err);
    res.status(500).json({ error: 'Purchase failed', details: err.message });
  }
});

// =======================
// GET /api/tickets
// =======================
router.get('/', async (req, res) => {
  try {
    const tickets = await getTickets();
    res.json(tickets);
  } catch (err) {
    console.error('Fetch tickets error:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

module.exports = router;
