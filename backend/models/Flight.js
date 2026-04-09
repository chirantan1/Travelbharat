// models/Flight.js
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  stops: { type: String, required: true },
  availableSeats: { type: Number, default: 100 },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Flight', flightSchema);