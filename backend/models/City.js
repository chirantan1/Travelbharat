const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State', // 🔥 MUST match model name
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);