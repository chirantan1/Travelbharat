const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../utils/emailService');

router.post('/send', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    await sendContactEmail({ name, email, phone, subject, message });
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! We\'ll get back to you soon.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.' 
    });
  }
});

module.exports = router;