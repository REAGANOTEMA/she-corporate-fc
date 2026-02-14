// backend/models/ticket.js

const pool = require('../config/db');

// =======================
// Create Ticket
// =======================
const createTicket = async ({
  full_name,
  email,
  match,
  seat_type,
  quantity,
  phoneNumber,
  provider,
  ticket_code
}) => {
  try {
    // Trim inputs
    full_name = full_name?.trim();
    email = email?.trim();
    match = match?.trim();
    seat_type = seat_type?.trim();
    phoneNumber = phoneNumber?.trim();
    provider = provider?.trim();
    ticket_code = ticket_code?.trim();

    // Basic validation
    if (!full_name || full_name.length < 2 || full_name.length > 100) {
      throw new Error('Full name must be between 2 and 100 characters');
    }

    if (!email || !/.+@.+\..+/.test(email)) {
      throw new Error('Valid email is required');
    }

    if (!match) {
      throw new Error('Match name is required');
    }

    if (!seat_type || seat_type.length > 50) {
      throw new Error('Seat type is required and max 50 characters');
    }

    quantity = Number(quantity);
    if (!quantity || quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    const phoneRegex = /^(07[78]\d{7}|075\d{7}|\+2567[78]\d{7})$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      throw new Error('Valid Ugandan phone number is required');
    }

    if (!provider || provider.length > 50) {
      throw new Error('Provider is required and max 50 characters');
    }

    // =======================
    // Insert into PostgreSQL
    // =======================
    const query = `
      INSERT INTO tickets
      (full_name, email, match, seat_type, quantity, phone_number, provider, ticket_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      full_name,
      email,
      match,
      seat_type,
      quantity,
      phoneNumber,
      provider,
      ticket_code
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];

  } catch (error) {
    console.error('Create Ticket Error:', error.message);
    throw error;
  }
};

// =======================
// Get all tickets
// =======================
const getTickets = async () => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM tickets ORDER BY created_at DESC'
    );
    return rows;
  } catch (error) {
    console.error('Fetch Tickets Error:', error.message);
    throw error;
  }
};

module.exports = {
  createTicket,
  getTickets
};
