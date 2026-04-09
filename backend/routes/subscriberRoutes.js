const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { sendWelcomeEmail } = require('../utils/emailService');

// Subscribe route
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('📝 Subscribe request for:', email);
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }
    
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already subscribed"
      });
    }
    
    // Save to database
    const newSubscriber = await Subscriber.create({ 
      email,
      subscribedAt: new Date()
    });
    
    console.log('✅ Subscriber saved to database:', email);
    
    // Try to send email (don't fail if email fails)
    let emailSent = false;
    try {
      emailSent = await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Email sending failed but subscription successful:', emailError.message);
    }
    
    // Return response
    res.json({
      success: true,
      message: emailSent 
        ? "Successfully subscribed! Welcome email sent. 🎉"
        : "Successfully subscribed! (Email delivery failed, but you're in our system)",
      data: newSubscriber,
      emailSent: emailSent
    });
    
  } catch (error) {
    console.error("❌ Subscribe Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

// Get all subscribers
router.get('/all', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscribers"
    });
  }
});

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    const result = await sendWelcomeEmail(email, 'Test User');
    res.json({
      success: result,
      message: result ? 'Test email sent!' : 'Failed to send email'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;