const express = require('express');
const router = express.Router();
const City = require('../models/City');

// ✅ CREATE CITY
router.post('/', async (req, res) => {
  try {
    const city = new City(req.body);
    const savedCity = await city.save();
    res.json(savedCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ GET ALL CITIES
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().populate('state');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET CITIES BY STATE
router.get('/state/:stateId', async (req, res) => {
  try {
    const cities = await City.find({ state: req.params.stateId });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE CITY
router.delete('/:id', async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;