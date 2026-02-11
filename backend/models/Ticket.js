const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    match: {
      type: String,
      required: [true, 'Match name is required'],
      trim: true,
      maxlength: [100, 'Match name can be at most 100 characters']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [100, 'Quantity cannot exceed 100'] // you can adjust this
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?\d{10,15}$/, 'Phone number is invalid']
    },
    provider: {
      type: String,
      required: [true, 'Provider is required'],
      trim: true,
      maxlength: [50, 'Provider can be at most 50 characters']
    },
    purchasedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
