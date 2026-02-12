const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const generateTicketPDF = async (ticket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileName = `ticket-${ticket.ticket_code}.pdf`;
      const filePath = path.join(__dirname, '../tickets', fileName);

      // create tickets folder if not exists
      if (!fs.existsSync(path.join(__dirname, '../tickets'))) {
        fs.mkdirSync(path.join(__dirname, '../tickets'));
      }

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Title
      doc.fontSize(20).text('She Corporate FC Ticket', { align: 'center' });
      doc.moveDown();

      // Ticket details
      doc.fontSize(12).text(`Name: ${ticket.full_name}`);
      doc.text(`Match: ${ticket.match}`);
      doc.text(`Seat Type: ${ticket.seat_type}`);
      doc.text(`Quantity: ${ticket.quantity}`);
      doc.text(`Ticket Code: ${ticket.ticket_code}`);
      doc.moveDown();

      // QR Code
      const qrImage = await QRCode.toDataURL(ticket.ticket_code);
      const qrBase64 = qrImage.replace(/^data:image\/png;base64,/, "");
      const qrBuffer = Buffer.from(qrBase64, 'base64');

      doc.image(qrBuffer, {
        fit: [150, 150],
        align: 'center'
      });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateTicketPDF;
