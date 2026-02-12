const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // must be app password
  }
});

const sendTicketEmail = async (to, ticket) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Your Ticket for ${ticket.match}`,
    html: `
      <h2>🎫 Ticket Confirmation</h2>
      <p>Thank you, ${ticket.full_name}, for your purchase!</p>
      <ul>
        <li>Match: ${ticket.match}</li>
        <li>Seat Type: ${ticket.seat_type}</li>
        <li>Quantity: ${ticket.quantity}</li>
        <li>Phone: ${ticket.phone_number}</li>
        <li>Ticket Code: <b>${ticket.ticket_code}</b></li>
      </ul>
      <p>Show this code at the gate.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendTicketEmail;
