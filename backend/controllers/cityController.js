const City = require('../models/City');

// CREATE city
exports.createCity = async (req, res) => {
  try {
    const city = new City(req.body);
    const saved = await city.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ GET cities by state (IMPORTANT FIX)
exports.getCitiesByState = async (req, res) => {
  try {
    const cities = await City.find({ state: req.params.stateId });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};