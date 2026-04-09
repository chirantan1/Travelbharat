const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure tickets directory exists
const ticketsDir = path.join(__dirname, '../tickets');
if (!fs.existsSync(ticketsDir)) {
  fs.mkdirSync(ticketsDir, { recursive: true });
}

// Generate Hotel PDF Ticket
const generateHotelTicket = async (bookingData) => {
  const { customerDetails, travelDetails, paymentDetails, bookingReference, bookingDetails } = bookingData;
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const filename = `hotel_ticket_${bookingReference}.pdf`;
  const filepath = path.join(ticketsDir, filename);
  
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);
  
  // Header
  doc.rect(0, 0, doc.page.width, 120).fill('#667eea');
  doc.fillColor('#ffffff')
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('TRAVELBHARAT', 50, 40)
    .fontSize(14)
    .text('Hotel Booking Confirmation', 50, 80);
  
  // Booking Reference
  doc.fillColor('#333333')
    .fontSize(12)
    .text(`Booking ID: ${bookingReference}`, 400, 50, { align: 'right' })
    .text(`Date: ${new Date().toLocaleDateString()}`, 400, 70, { align: 'right' });
  
  // Hotel Details Section
  doc.fillColor('#667eea')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('HOTEL DETAILS', 50, 150);
  
  doc.strokeColor('#667eea')
    .lineWidth(2)
    .moveTo(50, 165)
    .lineTo(550, 165)
    .stroke();
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Hotel Name: ${bookingDetails.itemName || 'Premium Hotel'}`, 50, 180)
    .text(`Location: ${travelDetails.to || 'City Center'}`, 50, 200)
    .text(`Check-in: ${new Date(travelDetails.date).toLocaleDateString()}`, 50, 220)
    .text(`Check-out: ${travelDetails.returnDate ? new Date(travelDetails.returnDate).toLocaleDateString() : 'N/A'}`, 50, 240)
    .text(`Nights: ${travelDetails.returnDate ? Math.ceil((new Date(travelDetails.returnDate) - new Date(travelDetails.date)) / (1000 * 60 * 60 * 24)) : 1}`, 50, 260)
    .text(`Guests: ${travelDetails.travelers}`, 50, 280);
  
  // Amenities
  if (bookingDetails.amenities && bookingDetails.amenities.length > 0) {
    doc.fillColor('#667eea')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('AMENITIES', 50, 320);
    
    let yPos = 340;
    bookingDetails.amenities.forEach(amenity => {
      doc.fillColor('#333333')
        .fontSize(11)
        .text(`✓ ${amenity}`, 50, yPos);
      yPos += 20;
    });
  }
  
  // Customer Details
  doc.fillColor('#667eea')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('GUEST DETAILS', 50, 420);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Name: ${customerDetails.name}`, 50, 440)
    .text(`Email: ${customerDetails.email}`, 50, 460)
    .text(`Phone: ${customerDetails.phone}`, 50, 480);
  
  if (customerDetails.address?.city) {
    doc.text(`Address: ${customerDetails.address.city}, ${customerDetails.address.state || ''}`, 50, 500);
  }
  
  // Payment Summary
  doc.fillColor('#667eea')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('PAYMENT SUMMARY', 300, 420);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Total Amount: ₹${paymentDetails.amount.toLocaleString('en-IN')}`, 300, 440)
    .text(`Payment Status: ${paymentDetails.status || 'Completed'}`, 300, 460)
    .text(`Payment Method: ${paymentDetails.paymentMethod || 'Card'}`, 300, 480);
  
  // Footer
  doc.fillColor('#666666')
    .fontSize(10)
    .text('Thank you for choosing TravelBharat!', 50, 750, { align: 'center' })
    .text('For any queries, contact us at support@travelbharat.com | +91 12345 67890', 50, 770, { align: 'center' });
  
  doc.end();
  
  return new Promise((resolve) => {
    stream.on('finish', () => resolve(filepath));
  });
};

// Generate Flight PDF Ticket
const generateFlightTicket = async (bookingData) => {
  const { customerDetails, travelDetails, paymentDetails, bookingReference, bookingDetails } = bookingData;
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const filename = `flight_ticket_${bookingReference}.pdf`;
  const filepath = path.join(ticketsDir, filename);
  
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);
  
  // Header
  doc.rect(0, 0, doc.page.width, 120).fill('#00c6fb');
  doc.fillColor('#ffffff')
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('TRAVELBHARAT', 50, 40)
    .fontSize(14)
    .text('Flight Booking Confirmation', 50, 80);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .text(`Booking ID: ${bookingReference}`, 400, 50, { align: 'right' })
    .text(`Date: ${new Date().toLocaleDateString()}`, 400, 70, { align: 'right' });
  
  // Flight Journey
  doc.fillColor('#00c6fb')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('FLIGHT DETAILS', 50, 150);
  
  doc.strokeColor('#00c6fb')
    .lineWidth(2)
    .moveTo(50, 165)
    .lineTo(550, 165)
    .stroke();
  
  // Journey visualization
  doc.fillColor('#333333')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text(`${bookingDetails.from || travelDetails.from || 'DEL'}`, 50, 190);
  
  doc.fontSize(12)
    .font('Helvetica')
    .text(`${bookingDetails.departure || '10:00 AM'}`, 50, 210);
  
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .text('✈️', 200, 195);
  
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .text(`${bookingDetails.to || travelDetails.to || 'BOM'}`, 300, 190);
  
  doc.fontSize(12)
    .font('Helvetica')
    .text(`${bookingDetails.arrival || '12:00 PM'}`, 300, 210);
  
  // Flight Info
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Airline: ${bookingDetails.itemName || 'IndiGo'}`, 50, 260)
    .text(`Flight Number: ${bookingDetails.flightNumber || '6E 123'}`, 50, 280)
    .text(`Date: ${new Date(travelDetails.date).toLocaleDateString()}`, 50, 300)
    .text(`Duration: ${bookingDetails.duration || '2h 30m'}`, 50, 320)
    .text(`Stops: ${bookingDetails.stops || 'Non-stop'}`, 50, 340)
    .text(`Class: ${bookingDetails.class || 'Economy'}`, 50, 360)
    .text(`Passengers: ${travelDetails.travelers}`, 50, 380);
  
  // Passenger Details
  doc.fillColor('#00c6fb')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('PASSENGER DETAILS', 50, 420);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Name: ${customerDetails.name}`, 50, 440)
    .text(`Email: ${customerDetails.email}`, 50, 460)
    .text(`Phone: ${customerDetails.phone}`, 50, 480);
  
  // Payment
  doc.fillColor('#00c6fb')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('PAYMENT SUMMARY', 300, 420);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Total Amount: ₹${paymentDetails.amount.toLocaleString('en-IN')}`, 300, 440)
    .text(`Payment Status: Completed`, 300, 460);
  
  // Important Notes
  doc.fillColor('#ff0000')
    .fontSize(10)
    .text('IMPORTANT: Please arrive at the airport 2 hours before departure.', 50, 550);
  
  doc.fillColor('#666666')
    .fontSize(10)
    .text('Thank you for choosing TravelBharat!', 50, 750, { align: 'center' })
    .text('For any queries, contact us at support@travelbharat.com | +91 12345 67890', 50, 770, { align: 'center' });
  
  doc.end();
  
  return new Promise((resolve) => {
    stream.on('finish', () => resolve(filepath));
  });
};

// Generate Train PDF Ticket
const generateTrainTicket = async (bookingData) => {
  const { customerDetails, travelDetails, paymentDetails, bookingReference, bookingDetails } = bookingData;
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const filename = `train_ticket_${bookingReference}.pdf`;
  const filepath = path.join(ticketsDir, filename);
  
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);
  
  // Header
  doc.rect(0, 0, doc.page.width, 120).fill('#11998e');
  doc.fillColor('#ffffff')
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('TRAVELBHARAT', 50, 40)
    .fontSize(14)
    .text('Train Booking Confirmation', 50, 80);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .text(`PNR Number: ${bookingReference}`, 400, 50, { align: 'right' })
    .text(`Date: ${new Date().toLocaleDateString()}`, 400, 70, { align: 'right' });
  
  // Train Details
  doc.fillColor('#11998e')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('TRAIN DETAILS', 50, 150);
  
  doc.strokeColor('#11998e')
    .lineWidth(2)
    .moveTo(50, 165)
    .lineTo(550, 165)
    .stroke();
  
  doc.fillColor('#333333')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text(`${bookingDetails.from || travelDetails.from || 'Departure'}`, 50, 190);
  
  doc.fontSize(12)
    .font('Helvetica')
    .text(`${bookingDetails.departure || '08:00 AM'}`, 50, 210);
  
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .text('🚂', 200, 195);
  
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .text(`${bookingDetails.to || travelDetails.to || 'Arrival'}`, 300, 190);
  
  doc.fontSize(12)
    .font('Helvetica')
    .text(`${bookingDetails.arrival || '08:00 PM'}`, 300, 210);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Train Name: ${bookingDetails.itemName || 'Express Train'}`, 50, 260)
    .text(`Train Number: ${bookingDetails.trainNumber || '12345'}`, 50, 280)
    .text(`Date: ${new Date(travelDetails.date).toLocaleDateString()}`, 50, 300)
    .text(`Duration: ${bookingDetails.duration || '12h 30m'}`, 50, 320)
    .text(`Class: ${bookingDetails.trainClasses ? bookingDetails.trainClasses[0] : 'Sleeper'}`, 50, 340)
    .text(`Passengers: ${travelDetails.travelers}`, 50, 360);
  
  // Passenger Details
  doc.fillColor('#11998e')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('PASSENGER DETAILS', 50, 420);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Name: ${customerDetails.name}`, 50, 440)
    .text(`Email: ${customerDetails.email}`, 50, 460)
    .text(`Phone: ${customerDetails.phone}`, 50, 480);
  
  // Payment
  doc.fillColor('#11998e')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('PAYMENT SUMMARY', 300, 420);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Total Amount: ₹${paymentDetails.amount.toLocaleString('en-IN')}`, 300, 440)
    .text(`Booking Status: Confirmed`, 300, 460);
  
  doc.fillColor('#666666')
    .fontSize(10)
    .text('Thank you for choosing TravelBharat!', 50, 750, { align: 'center' })
    .text('For any queries, contact us at support@travelbharat.com | +91 12345 67890', 50, 770, { align: 'center' });
  
  doc.end();
  
  return new Promise((resolve) => {
    stream.on('finish', () => resolve(filepath));
  });
};

// Generate Bus PDF Ticket
const generateBusTicket = async (bookingData) => {
  const { customerDetails, travelDetails, paymentDetails, bookingReference, bookingDetails } = bookingData;
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const filename = `bus_ticket_${bookingReference}.pdf`;
  const filepath = path.join(ticketsDir, filename);
  
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);
  
  doc.rect(0, 0, doc.page.width, 120).fill('#f093fb');
  doc.fillColor('#ffffff')
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('TRAVELBHARAT', 50, 40)
    .fontSize(14)
    .text('Bus Booking Confirmation', 50, 80);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .text(`Ticket ID: ${bookingReference}`, 400, 50, { align: 'right' })
    .text(`Date: ${new Date().toLocaleDateString()}`, 400, 70, { align: 'right' });
  
  doc.fillColor('#f093fb')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('BUS DETAILS', 50, 150);
  
  doc.strokeColor('#f093fb')
    .lineWidth(2)
    .moveTo(50, 165)
    .lineTo(550, 165)
    .stroke();
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Bus Name: ${bookingDetails.itemName || 'Volvo AC Sleeper'}`, 50, 190)
    .text(`From: ${bookingDetails.from || travelDetails.from || 'Pickup Point'}`, 50, 210)
    .text(`To: ${bookingDetails.to || travelDetails.to || 'Drop Point'}`, 50, 230)
    .text(`Departure: ${bookingDetails.departure || '06:00 AM'}`, 50, 250)
    .text(`Arrival: ${bookingDetails.arrival || '02:00 PM'}`, 50, 270)
    .text(`Date: ${new Date(travelDetails.date).toLocaleDateString()}`, 50, 290)
    .text(`Seat Numbers: ${bookingDetails.seatNumbers || 'A1, A2'}`, 50, 310)
    .text(`Passengers: ${travelDetails.travelers}`, 50, 330);
  
  doc.fillColor('#f093fb')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('PASSENGER DETAILS', 50, 380);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Name: ${customerDetails.name}`, 50, 400)
    .text(`Email: ${customerDetails.email}`, 50, 420)
    .text(`Phone: ${customerDetails.phone}`, 50, 440);
  
  doc.fillColor('#f093fb')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('PAYMENT SUMMARY', 300, 380);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Total Amount: ₹${paymentDetails.amount.toLocaleString('en-IN')}`, 300, 400);
  
  doc.fillColor('#666666')
    .fontSize(10)
    .text('Thank you for choosing TravelBharat!', 50, 750, { align: 'center' });
  
  doc.end();
  
  return new Promise((resolve) => {
    stream.on('finish', () => resolve(filepath));
  });
};

// Generate Cab PDF Ticket
const generateCabTicket = async (bookingData) => {
  const { customerDetails, travelDetails, paymentDetails, bookingReference, bookingDetails } = bookingData;
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const filename = `cab_ticket_${bookingReference}.pdf`;
  const filepath = path.join(ticketsDir, filename);
  
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);
  
  doc.rect(0, 0, doc.page.width, 120).fill('#fa709a');
  doc.fillColor('#ffffff')
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('TRAVELBHARAT', 50, 40)
    .fontSize(14)
    .text('Cab Booking Confirmation', 50, 80);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .text(`Trip ID: ${bookingReference}`, 400, 50, { align: 'right' });
  
  doc.fillColor('#fa709a')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('CAB DETAILS', 50, 150);
  
  doc.strokeColor('#fa709a')
    .lineWidth(2)
    .moveTo(50, 165)
    .lineTo(550, 165)
    .stroke();
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Cab Type: ${bookingDetails.itemName || 'Sedan'}`, 50, 190)
    .text(`Pickup: ${bookingDetails.from || travelDetails.from || 'Your Location'}`, 50, 210)
    .text(`Drop: ${bookingDetails.to || travelDetails.to || 'Destination'}`, 50, 230)
    .text(`Date: ${new Date(travelDetails.date).toLocaleDateString()}`, 50, 250)
    .text(`Capacity: Up to ${bookingDetails.capacity || 4} passengers`, 50, 270);
  
  doc.fillColor('#fa709a')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('PASSENGER DETAILS', 50, 320);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Name: ${customerDetails.name}`, 50, 340)
    .text(`Email: ${customerDetails.email}`, 50, 360)
    .text(`Phone: ${customerDetails.phone}`, 50, 380);
  
  doc.fillColor('#fa709a')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('PAYMENT SUMMARY', 300, 320);
  
  doc.fillColor('#333333')
    .fontSize(12)
    .font('Helvetica')
    .text(`Total Amount: ₹${paymentDetails.amount.toLocaleString('en-IN')}`, 300, 340);
  
  doc.fillColor('#666666')
    .fontSize(10)
    .text('Thank you for choosing TravelBharat!', 50, 750, { align: 'center' });
  
  doc.end();
  
  return new Promise((resolve) => {
    stream.on('finish', () => resolve(filepath));
  });
};

// Main function to generate ticket based on type
const generateTicket = async (bookingData) => {
  const { bookingType } = bookingData;
  
  switch (bookingType) {
    case 'hotel':
      return await generateHotelTicket(bookingData);
    case 'flight':
      return await generateFlightTicket(bookingData);
    case 'train':
      return await generateTrainTicket(bookingData);
    case 'bus':
      return await generateBusTicket(bookingData);
    case 'cab':
      return await generateCabTicket(bookingData);
    default:
      console.log(`Unknown booking type: ${bookingType}`);
      return null;
  }
};

module.exports = { generateTicket };