const nodemailer = require('nodemailer');
require('dotenv').config();
const { generateTicket } = require('./pdfGenerator');
const fs = require('fs');
const path = require('path');

let etherealAccount = null;
let transporter = null;

// Create reusable transporter
const createTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your_email@gmail.com') {
    console.log('📧 Using real email configuration');
    console.log(`   Host: ${process.env.EMAIL_HOST}`);
    console.log(`   User: ${process.env.EMAIL_USER}`);
    
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  console.log('⚠️ No valid email credentials found, using Ethereal test account...');
  console.log('💡 To receive real emails, add EMAIL_USER and EMAIL_PASS to .env file');
  
  if (!etherealAccount) {
    const testAccount = await nodemailer.createTestAccount();
    etherealAccount = testAccount;
    console.log('📧 Ethereal test account created:');
    console.log(`   Email: ${testAccount.user}`);
    console.log(`   Password: ${testAccount.pass}`);
  }
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: etherealAccount.user,
      pass: etherealAccount.pass
    }
  });
};

// Initialize transporter
const initTransporter = async () => {
  transporter = await createTransporter();
  
  try {
    await transporter.verify();
    console.log('✅ Email transporter ready');
    
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
      console.log('📧 Currently in TEST MODE - Emails will be previewed in console');
      console.log('💡 For real emails, configure .env with actual email credentials');
    } else {
      console.log('📧 Real email mode active - emails will be sent to actual inboxes');
    }
  } catch (error) {
    console.error('❌ Email transporter error:', error.message);
    transporter = await createTransporter(true);
  }
};

// Send email with optional PDF attachment - FIXED
const sendEmailWithAttachment = async (to, subject, html, attachmentPath = null) => {
  if (!transporter) {
    await initTransporter();
  }
  
  try {
    const attachments = attachmentPath && fs.existsSync(attachmentPath) ? [{
      filename: path.basename(attachmentPath),
      path: attachmentPath,
      contentType: 'application/pdf'
    }] : [];
    
    // FIX: Added attachments to the mail options
    const info = await transporter.sendMail({
      from: `"TravelBharat Team" <${process.env.EMAIL_USER || 'noreply@travelbharat.com'}>`,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments  // ← THIS WAS MISSING
    });
    
    console.log(`✅ Email sent to ${to} with ${attachments.length} attachment(s)`);
    
    if (info.messageId && nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("📨 PREVIEW URL:", previewUrl);
      }
    }
    
    // Clean up PDF file after sending
    if (attachmentPath && fs.existsSync(attachmentPath)) {
      setTimeout(() => {
        try {
          fs.unlinkSync(attachmentPath);
          console.log(`🗑️ Deleted temporary PDF: ${path.basename(attachmentPath)}`);
        } catch (err) {
          console.log(`⚠️ Could not delete PDF: ${err.message}`);
        }
      }, 5000);
    }
    
    return true;
  } catch (error) {
    console.error("❌ Email error:", error.message);
    return false;
  }
};

// Professional Email Template Generator
const generateEmailTemplate = (title, content, buttonText = null, buttonLink = null) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .email-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .email-header h1 { font-size: 28px; margin-bottom: 10px; }
        .email-header p { font-size: 16px; opacity: 0.9; }
        .email-content { padding: 40px 30px; background: #ffffff; }
        .email-footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600; }
        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
        .detail-label { font-weight: 600; color: #495057; }
        .detail-value { color: #212529; }
        .social-links { margin-top: 20px; }
        .social-links a { color: #667eea; text-decoration: none; margin: 0 10px; }
        .pdf-notice { background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px dashed #4caf50; }
        @media only screen and (max-width: 600px) {
          .email-container { margin: 10px; }
          .email-content { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>✨ TravelBharat ✨</h1>
          <p>Your Trusted Travel Partner</p>
        </div>
        <div class="email-content">
          ${content}
          ${buttonText && buttonLink ? `<div style="text-align: center;"><a href="${buttonLink}" class="button">${buttonText}</a></div>` : ''}
        </div>
        <div class="email-footer">
          <p style="margin-bottom: 10px;">📞 Need help? Call us: +91 12345 67890</p>
          <p style="margin-bottom: 10px;">✉️ Email: support@travelbharat.com</p>
          <div class="social-links">
            <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">
            © 2024 TravelBharat. All rights reserved.<br>
            This email was sent to you because you made a booking with TravelBharat.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==================== HOTEL BOOKING EMAIL ====================
const sendHotelBookingEmail = async (bookingData) => {
  const { customerDetails, travelDetails, paymentDetails, bookingReference, bookingDetails } = bookingData;
  
  const checkInDate = new Date(travelDetails.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const checkOutDate = travelDetails.returnDate ? new Date(travelDetails.returnDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const nights = travelDetails.returnDate ? Math.ceil((new Date(travelDetails.returnDate) - new Date(travelDetails.date)) / (1000 * 60 * 60 * 24)) : 1;
  
  const content = `
    <h2 style="color: #333; margin-bottom: 20px;">Dear ${customerDetails.name},</h2>
    <p style="margin-bottom: 20px;">Your <strong>HOTEL BOOKING</strong> has been <strong style="color: #28a745;">CONFIRMED</strong>! 🏨</p>
    
    <div class="pdf-notice">
      <p>📎 <strong>Your e-Ticket is attached to this email as a PDF file.</strong></p>
      <p>Please download and save it for check-in.</p>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #667eea;">🏨 Hotel Details</h3>
      <div class="detail-row"><span class="detail-label">Hotel Name:</span><span class="detail-value">${bookingDetails.itemName || 'Premium Hotel'}</span></div>
      <div class="detail-row"><span class="detail-label">Location:</span><span class="detail-value">${travelDetails.to || 'City Center'}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in:</span><span class="detail-value">${checkInDate}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out:</span><span class="detail-value">${checkOutDate}</span></div>
      <div class="detail-row"><span class="detail-label">Nights:</span><span class="detail-value">${nights} night(s)</span></div>
      <div class="detail-row"><span class="detail-label">Guests:</span><span class="detail-value">${travelDetails.travelers} traveler(s)</span></div>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #667eea;">👤 Guest Details</h3>
      <div class="detail-row"><span class="detail-label">Name:</span><span class="detail-value">${customerDetails.name}</span></div>
      <div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${customerDetails.email}</span></div>
      <div class="detail-row"><span class="detail-label">Phone:</span><span class="detail-value">${customerDetails.phone}</span></div>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #667eea;">💰 Payment Summary</h3>
      <div class="detail-row"><span class="detail-label">Total Amount:</span><span class="detail-value"><strong style="font-size: 18px; color: #28a745;">₹${paymentDetails.amount.toLocaleString('en-IN')}</strong></span></div>
      <div class="detail-row"><span class="detail-label">Booking Reference:</span><span class="detail-value"><strong>${bookingReference}</strong></span></div>
      <div class="detail-row"><span class="detail-label">Payment Status:</span><span class="detail-value" style="color: #28a745;">Completed</span></div>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #667eea;">📍 Important Instructions</h3>
      <p>✓ Please carry a valid ID proof (Aadhar/Passport/Driver's License)</p>
      <p>✓ Check-in time: 12:00 PM | Check-out time: 11:00 AM</p>
      <p>✓ Present the attached PDF ticket at the reception</p>
    </div>
  `;
  
  const html = generateEmailTemplate('Hotel Booking Confirmation', content, 'View My Bookings', 'http://localhost:3000/my-bookings');
  
  console.log('📄 Generating hotel PDF ticket...');
  const pdfPath = await generateTicket(bookingData);
  console.log(`📄 PDF generated at: ${pdfPath}`);
  
  return await sendEmailWithAttachment(customerDetails.email, `🏨 Hotel Booking Confirmed! ${bookingReference}`, html, pdfPath);
};

// ==================== FLIGHT BOOKING EMAIL ====================
const sendFlightBookingEmail = async (bookingData) => {
  const { customerDetails, travelDetails, paymentDetails, bookingReference, bookingDetails } = bookingData;
  
  const content = `
    <h2 style="color: #333; margin-bottom: 20px;">Dear ${customerDetails.name},</h2>
    <p style="margin-bottom: 20px;">Your <strong>FLIGHT BOOKING</strong> has been <strong style="color: #28a745;">CONFIRMED</strong>! ✈️</p>
    
    <div class="pdf-notice">
      <p>📎 <strong>Your Boarding Pass is attached to this email as a PDF file.</strong></p>
      <p>Please download and carry it to the airport.</p>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #00c6fb;">✈️ Flight Details</h3>
      <div class="detail-row"><span class="detail-label">Airline:</span><span class="detail-value">${bookingDetails.itemName || 'IndiGo'}</span></div>
      <div class="detail-row"><span class="detail-label">From:</span><span class="detail-value">${bookingDetails.from || travelDetails.from || 'DEL'}</span></div>
      <div class="detail-row"><span class="detail-label">To:</span><span class="detail-value">${bookingDetails.to || travelDetails.to || 'BOM'}</span></div>
      <div class="detail-row"><span class="detail-label">Departure:</span><span class="detail-value">${bookingDetails.departure || '10:00 AM'}</span></div>
      <div class="detail-row"><span class="detail-label">Arrival:</span><span class="detail-value">${bookingDetails.arrival || '12:00 PM'}</span></div>
      <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${new Date(travelDetails.date).toLocaleDateString()}</span></div>
      <div class="detail-row"><span class="detail-label">Class:</span><span class="detail-value">${bookingDetails.class || 'Economy'}</span></div>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #00c6fb;">💰 Payment Summary</h3>
      <div class="detail-row"><span class="detail-label">Total Amount:</span><span class="detail-value"><strong style="font-size: 18px; color: #28a745;">₹${paymentDetails.amount.toLocaleString('en-IN')}</strong></span></div>
      <div class="detail-row"><span class="detail-label">Booking Reference:</span><span class="detail-value"><strong>${bookingReference}</strong></span></div>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #00c6fb;">⚠️ Important</h3>
      <p>✓ Please arrive at the airport 2 hours before departure</p>
      <p>✓ Carry valid ID proof and the attached boarding pass</p>
      <p>✓ Web check-in available 48 hours before departure</p>
    </div>
  `;
  
  const html = generateEmailTemplate('Flight Booking Confirmation', content, 'Manage Booking', 'http://localhost:3000/my-bookings');
  const pdfPath = await generateTicket(bookingData);
  
  return await sendEmailWithAttachment(customerDetails.email, `✈️ Flight Booking Confirmed! ${bookingReference}`, html, pdfPath);
};

// ==================== TRAIN BOOKING EMAIL ====================
const sendTrainBookingEmail = async (bookingData) => {
  const { customerDetails, travelDetails, paymentDetails, bookingReference, bookingDetails } = bookingData;
  
  const content = `
    <h2 style="color: #333; margin-bottom: 20px;">Dear ${customerDetails.name},</h2>
    <p style="margin-bottom: 20px;">Your <strong>TRAIN BOOKING</strong> has been <strong style="color: #28a745;">CONFIRMED</strong>! 🚂</p>
    
    <div class="pdf-notice">
      <p>📎 <strong>Your Train Ticket is attached to this email as a PDF file.</strong></p>
      <p>Please download and carry it for your journey.</p>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #11998e;">🚂 Train Details</h3>
      <div class="detail-row"><span class="detail-label">Train Name:</span><span class="detail-value">${bookingDetails.itemName || 'Express Train'}</span></div>
      <div class="detail-row"><span class="detail-label">From:</span><span class="detail-value">${bookingDetails.from || travelDetails.from || 'Departure'}</span></div>
      <div class="detail-row"><span class="detail-label">To:</span><span class="detail-value">${bookingDetails.to || travelDetails.to || 'Arrival'}</span></div>
      <div class="detail-row"><span class="detail-label">Departure:</span><span class="detail-value">${bookingDetails.departure || '08:00 AM'}</span></div>
      <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${new Date(travelDetails.date).toLocaleDateString()}</span></div>
      <div class="detail-row"><span class="detail-label">Class:</span><span class="detail-value">${bookingDetails.trainClasses ? bookingDetails.trainClasses[0] : 'Sleeper'}</span></div>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #11998e;">💰 Payment Summary</h3>
      <div class="detail-row"><span class="detail-label">Total Amount:</span><span class="detail-value"><strong style="font-size: 18px; color: #28a745;">₹${paymentDetails.amount.toLocaleString('en-IN')}</strong></span></div>
      <div class="detail-row"><span class="detail-label">PNR Number:</span><span class="detail-value"><strong>${bookingReference}</strong></span></div>
    </div>
  `;
  
  const html = generateEmailTemplate('Train Booking Confirmation', content, 'Check PNR Status', 'http://localhost:3000/my-bookings');
  const pdfPath = await generateTicket(bookingData);
  
  return await sendEmailWithAttachment(customerDetails.email, `🚂 Train Booking Confirmed! ${bookingReference}`, html, pdfPath);
};

// ==================== BUS BOOKING EMAIL ====================
const sendBusBookingEmail = async (bookingData) => {
  const { customerDetails, travelDetails, paymentDetails, bookingReference, bookingDetails } = bookingData;
  
  const content = `
    <h2 style="color: #333; margin-bottom: 20px;">Dear ${customerDetails.name},</h2>
    <p style="margin-bottom: 20px;">Your <strong>BUS BOOKING</strong> has been <strong style="color: #28a745;">CONFIRMED</strong>! 🚌</p>
    
    <div class="pdf-notice">
      <p>📎 <strong>Your Bus Ticket is attached to this email as a PDF file.</strong></p>
      <p>Please download and show it at the boarding point.</p>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #f093fb;">🚌 Bus Details</h3>
      <div class="detail-row"><span class="detail-label">Bus Name:</span><span class="detail-value">${bookingDetails.itemName || 'Volvo AC Sleeper'}</span></div>
      <div class="detail-row"><span class="detail-label">From:</span><span class="detail-value">${bookingDetails.from || travelDetails.from || 'Pickup'}</span></div>
      <div class="detail-row"><span class="detail-label">To:</span><span class="detail-value">${bookingDetails.to || travelDetails.to || 'Drop'}</span></div>
      <div class="detail-row"><span class="detail-label">Departure:</span><span class="detail-value">${bookingDetails.departure || '06:00 AM'}</span></div>
      <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${new Date(travelDetails.date).toLocaleDateString()}</span></div>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #f093fb;">💰 Payment Summary</h3>
      <div class="detail-row"><span class="detail-label">Total Amount:</span><span class="detail-value"><strong style="font-size: 18px; color: #28a745;">₹${paymentDetails.amount.toLocaleString('en-IN')}</strong></span></div>
      <div class="detail-row"><span class="detail-label">Ticket ID:</span><span class="detail-value"><strong>${bookingReference}</strong></span></div>
    </div>
  `;
  
  const html = generateEmailTemplate('Bus Booking Confirmation', content, 'View Ticket', 'http://localhost:3000/my-bookings');
  const pdfPath = await generateTicket(bookingData);
  
  return await sendEmailWithAttachment(customerDetails.email, `🚌 Bus Booking Confirmed! ${bookingReference}`, html, pdfPath);
};

// ==================== CAB BOOKING EMAIL ====================
const sendCabBookingEmail = async (bookingData) => {
  const { customerDetails, travelDetails, paymentDetails, bookingReference, bookingDetails } = bookingData;
  
  const content = `
    <h2 style="color: #333; margin-bottom: 20px;">Dear ${customerDetails.name},</h2>
    <p style="margin-bottom: 20px;">Your <strong>CAB BOOKING</strong> has been <strong style="color: #28a745;">CONFIRMED</strong>! 🚕</p>
    
    <div class="pdf-notice">
      <p>📎 <strong>Your Cab Voucher is attached to this email as a PDF file.</strong></p>
      <p>Please show it to the driver at pickup.</p>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #fa709a;">🚕 Cab Details</h3>
      <div class="detail-row"><span class="detail-label">Cab Type:</span><span class="detail-value">${bookingDetails.itemName || 'Sedan'}</span></div>
      <div class="detail-row"><span class="detail-label">Pickup:</span><span class="detail-value">${bookingDetails.from || travelDetails.from || 'Your Location'}</span></div>
      <div class="detail-row"><span class="detail-label">Drop:</span><span class="detail-value">${bookingDetails.to || travelDetails.to || 'Destination'}</span></div>
      <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${new Date(travelDetails.date).toLocaleDateString()}</span></div>
      <div class="detail-row"><span class="detail-label">Capacity:</span><span class="detail-value">Up to ${bookingDetails.capacity || 4} passengers</span></div>
    </div>
    
    <div class="info-box">
      <h3 style="margin-bottom: 15px; color: #fa709a;">💰 Payment Summary</h3>
      <div class="detail-row"><span class="detail-label">Total Amount:</span><span class="detail-value"><strong style="font-size: 18px; color: #28a745;">₹${paymentDetails.amount.toLocaleString('en-IN')}</strong></span></div>
      <div class="detail-row"><span class="detail-label">Trip ID:</span><span class="detail-value"><strong>${bookingReference}</strong></span></div>
    </div>
  `;
  
  const html = generateEmailTemplate('Cab Booking Confirmation', content, 'Track Ride', 'http://localhost:3000/my-bookings');
  const pdfPath = await generateTicket(bookingData);
  
  return await sendEmailWithAttachment(customerDetails.email, `🚕 Cab Booking Confirmed! ${bookingReference}`, html, pdfPath);
};

// Main booking confirmation function
const sendBookingConfirmation = async (bookingData) => {
  const { bookingType } = bookingData;
  
  console.log(`📧 Sending ${bookingType} booking confirmation email with PDF...`);
  
  switch (bookingType) {
    case 'hotel':
      return await sendHotelBookingEmail(bookingData);
    case 'flight':
      return await sendFlightBookingEmail(bookingData);
    case 'train':
      return await sendTrainBookingEmail(bookingData);
    case 'bus':
      return await sendBusBookingEmail(bookingData);
    case 'cab':
      return await sendCabBookingEmail(bookingData);
    default:
      console.log(`Unknown booking type: ${bookingType}`);
      return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name = 'Traveler') => {
  if (!transporter) await initTransporter();
  
  try {
    const content = `
      <h2>Hello ${name}! 👋</h2>
      <p>Thank you for subscribing to <strong>TravelBharat</strong>! 🎉</p>
      <p>You're now part of our travel community!</p>
    `;
    
    const html = generateEmailTemplate('Welcome to TravelBharat', content, 'Explore Now', 'http://localhost:3000');
    
    return await sendEmailWithAttachment(email, 'Welcome to TravelBharat! 🎉', html);
  } catch (error) {
    console.error("❌ Welcome email error:", error.message);
    return false;
  }
};

// Initialize on load
initTransporter();

module.exports = { sendWelcomeEmail, sendBookingConfirmation, initTransporter };