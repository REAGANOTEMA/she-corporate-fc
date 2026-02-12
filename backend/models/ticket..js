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
  const query = `
    INSERT INTO tickets
    (full_name, email, match, seat_type, quantity, phone_number, provider, ticket_code)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
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
};


// =======================
// Get all tickets
// =======================
const getTickets = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM tickets ORDER BY created_at DESC'
  );
  return rows;
};

module.exports = {
  createTicket,
  getTickets
};
