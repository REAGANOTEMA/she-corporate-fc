const mongoose = require('mongoose');

// Define Ticket schema
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
      max: [100, 'Quantity cannot exceed 100'] // Adjust as needed
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^(07[78]\d{7}|075\d{7}|\+2567[78]\d{7})$/, 'Enter a valid Ugandan phone number']
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
    timestamps: true // automatically adds createdAt and updatedAt
  }
);

// Optional: Index for faster queries
ticketSchema.index({ match: 1, phoneNumber: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
