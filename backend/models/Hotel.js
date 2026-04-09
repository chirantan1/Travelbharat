// models/Hotel.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  image: { type: String, required: true },
  amenities: [{ type: String }],
  discount: { type: Number, default: 0 },
  popular: { type: Boolean, default: false },
  availableRooms: { type: Number, default: 10 },
  description: { type: String },
  checkInTime: { type: String, default: "14:00" },
  checkOutTime: { type: String, default: "11:00" }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);