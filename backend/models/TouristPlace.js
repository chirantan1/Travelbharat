const mongoose = require('mongoose');

const touristPlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // SEO-friendly URL
  description: { type: String, required: true },
  history: String,
  bestTimeToVisit: String,
  entryFee: String,
  timings: String,
  location: String,
  mapLink: String,
  images: [{ type: String }], 
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  

  nearbyAttractions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TouristPlace' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('TouristPlace', touristPlaceSchema);