const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  match: String,
  quantity: Number,
  phoneNumber: String,
  provider: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);
