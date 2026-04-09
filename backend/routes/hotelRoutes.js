// routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const { city, minPrice, maxPrice, rating } = req.query;
    let query = {};
    
    if (city) query.city = city;
    if (minPrice) query.price = { $gte: parseInt(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseInt(maxPrice) };
    if (rating) query.rating = { $gte: parseInt(rating) };
    
    const hotels = await Hotel.find(query);
    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, hotel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create hotel (admin)
router.post('/', async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json({ success: true, hotel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;