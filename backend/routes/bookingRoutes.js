const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { sendBookingConfirmation } = require('../utils/emailService');

// GET all bookings with filters
router.get('/', async (req, res) => {
  try {
    const { status, bookingType, email, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (bookingType) query.bookingType = bookingType;
    if (email) query['customerDetails.email'] = email;
    
    const bookings = await Booking.find(query)
      .sort({ bookingDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Booking.countDocuments(query);
    
    res.json({
      success: true,
      data: bookings,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET booking by reference number
router.get('/reference/:ref', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingReference: req.params.ref });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET bookings by email
router.get('/email/:email', async (req, res) => {
  try {
    const bookings = await Booking.findByEmail(req.params.email);
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new booking - FIXED with better error handling
router.post('/', async (req, res) => {
  try {
    console.log('📥 ========== NEW BOOKING REQUEST ==========');
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    if (!req.body.customerDetails || !req.body.customerDetails.email) {
      console.error('❌ Missing customerDetails or email in request');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing customer details. Please provide name, email, and phone.' 
      });
    }
    
    // Set default bookingType if not provided
    if (!req.body.bookingType) {
      req.body.bookingType = 'package';
      console.log('⚠️ bookingType not provided, defaulting to: package');
    }
    
    // Ensure bookingDetails exists
    if (!req.body.bookingDetails) {
      req.body.bookingDetails = {
        itemName: req.body.destination || 'Destination Package',
        from: req.body.location || 'India',
        to: req.body.destination || 'Your Destination'
      };
      console.log('⚠️ bookingDetails not provided, created default');
    }
    
    // Ensure travelDetails has required fields
    if (!req.body.travelDetails) {
      req.body.travelDetails = {
        date: req.body.travelDate || new Date().toISOString(),
        travelers: req.body.travelers || 1,
        from: req.body.location || 'India',
        to: req.body.destination || 'Your Destination',
        preferences: {
          meals: 'none',
          accommodation: 'standard'
        }
      };
      console.log('⚠️ travelDetails not provided, created default');
    }
    
    // Ensure paymentDetails exists
    if (!req.body.paymentDetails) {
      req.body.paymentDetails = {
        amount: req.body.totalAmount || 0,
        currency: 'INR',
        paymentMethod: 'card',
        status: 'completed'
      };
      console.log('⚠️ paymentDetails not provided, created default');
    }
    
    const bookingData = {
      ...req.body,
      bookingReference: `TRV${Date.now()}${Math.floor(Math.random() * 1000)}`
    };
    
    console.log('📝 Creating booking with data:', JSON.stringify(bookingData, null, 2));
    
    const booking = new Booking(bookingData);
    await booking.save();
    
    console.log('✅ Booking saved to database with ID:', booking._id);
    console.log('📧 Booking reference:', booking.bookingReference);
    
    // Send email confirmation with complete booking data
    console.log(`📧 Sending ${booking.bookingType} booking confirmation to ${booking.customerDetails.email}...`);
    
    const emailData = {
      bookingType: booking.bookingType,
      customerDetails: booking.customerDetails,
      travelDetails: booking.travelDetails,
      paymentDetails: booking.paymentDetails,
      bookingReference: booking.bookingReference,
      bookingDetails: booking.bookingDetails || {}
    };
    
    console.log('📧 Email data being sent:', JSON.stringify(emailData, null, 2));
    
    const emailSent = await sendBookingConfirmation(emailData);
    
    if (emailSent) {
      console.log('✅ Booking confirmation email sent successfully');
    } else {
      console.log('⚠️ Booking confirmation email failed to send - check email service logs');
    }
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
      bookingReference: booking.bookingReference,
      emailSent: emailSent
    });
  } catch (error) {
    console.error('❌ Booking creation error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', errors);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: error.errors 
    });
  }
});

// PUT update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH confirm booking
router.patch('/:id/confirm', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    await booking.confirm();
    
    // Send confirmation email on status change
    await sendBookingConfirmation({
      bookingType: booking.bookingType,
      customerDetails: booking.customerDetails,
      travelDetails: booking.travelDetails,
      paymentDetails: booking.paymentDetails,
      bookingReference: booking.bookingReference,
      bookingDetails: booking.bookingDetails || {}
    });
    
    res.json({ success: true, message: 'Booking confirmed', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH cancel booking
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    if (!booking.isCancellable) {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking cannot be cancelled. Please contact support.' 
      });
    }
    
    await booking.cancel(reason);
    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE booking (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET booking statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Booking.getStats();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { 'paymentDetails.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$paymentDetails.amount' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        statusStats: stats,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// TEST endpoint to check email functionality
router.post('/test-email', async (req, res) => {
  try {
    console.log('📧 Testing email functionality...');
    
    const testBookingData = {
      bookingType: 'hotel',
      customerDetails: {
        name: 'Test User',
        email: req.body.email || 'test@example.com',
        phone: '9999999999',
        address: {
          street: 'Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          country: 'India'
        }
      },
      travelDetails: {
        date: new Date().toISOString(),
        travelers: 2,
        from: 'Test City',
        to: 'Test Destination',
        preferences: {
          meals: 'none',
          accommodation: 'standard'
        }
      },
      paymentDetails: {
        amount: 1999,
        currency: 'INR',
        paymentMethod: 'card',
        status: 'completed'
      },
      bookingReference: `TEST${Date.now()}`,
      bookingDetails: {
        itemName: 'Test Hotel Booking',
        itemId: 'TEST001',
        amenities: ['WiFi', 'AC', 'Breakfast']
      }
    };
    
    console.log('📧 Sending test email to:', req.body.email);
    
    const emailSent = await sendBookingConfirmation(testBookingData);
    
    res.json({ 
      success: emailSent, 
      message: emailSent ? 'Test email sent successfully! Check your inbox.' : 'Email failed to send. Check backend logs.',
      emailSent: emailSent 
    });
  } catch (error) {
    console.error('❌ Test email error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;