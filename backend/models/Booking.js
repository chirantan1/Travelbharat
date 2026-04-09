// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'guest',
    index: true
  },
  bookingType: {
    type: String,
    enum: ['hotel', 'flight', 'train', 'bus', 'cab', 'package', 'activity'],
    required: true
  },
  bookingDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  customerDetails: {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: { 
      type: String, 
      required: true,
      match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number']
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer not to say']
    }
  },
  paymentDetails: {
    amount: { 
      type: Number, 
      required: true,
      min: 0
    },
    currency: { 
      type: String, 
      default: 'INR',
      uppercase: true
    },
    paymentMethod: { 
      type: String, 
      enum: ['card', 'paypal', 'cash', 'upi', 'netbanking', 'wallet'], 
      default: 'card' 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'], 
      default: 'pending' 
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    paymentDate: Date,
    refundDetails: {
      amount: Number,
      date: Date,
      reason: String
    }
  },
  travelDetails: {
    date: {
      type: Date,
      required: true
    },
    returnDate: Date,
    travelers: {
      type: Number,
      required: true,
      min: 1,
      max: 50
    },
    preferences: {
      meals: {
        type: String,
        enum: ['vegetarian', 'non-vegetarian', 'vegan', 'none'],
        default: 'none'
      },
      accommodation: {
        type: String,
        enum: ['budget', 'standard', 'luxury', 'premium'],
        default: 'standard'
      }
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending',
    index: true
  },
  specialRequests: {
    type: String,
    maxlength: 500
  },
  cancellationReason: {
    type: String,
    maxlength: 200
  },
  cancelledAt: Date,
  confirmedAt: Date,
  completedAt: Date,
  bookingDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return `TRV${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for total travelers count
bookingSchema.virtual('totalTravelers').get(function() {
  return this.travelDetails?.travelers || 1;
});

// Virtual field for total price
bookingSchema.virtual('totalPrice').get(function() {
  return this.paymentDetails?.amount || 0;
});

// Virtual field for isCancellable (within 48 hours of travel)
bookingSchema.virtual('isCancellable').get(function() {
  if (this.status !== 'confirmed') return false;
  const hoursUntilTravel = (this.travelDetails.date - new Date()) / (1000 * 60 * 60);
  return hoursUntilTravel > 48;
});

// Indexes for better query performance
bookingSchema.index({ 'customerDetails.email': 1 });
bookingSchema.index({ status: 1, bookingDate: -1 });
bookingSchema.index({ bookingType: 1, status: 1 });
bookingSchema.index({ 'travelDetails.date': 1 });

// Pre-save middleware to set confirmedAt
bookingSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'confirmed' && !this.confirmedAt) {
    this.confirmedAt = new Date();
  }
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Method to cancel booking
bookingSchema.methods.cancel = async function(reason) {
  if (!this.isCancellable) {
    throw new Error('Booking cannot be cancelled at this time');
  }
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  await this.save();
  return this;
};

// Method to confirm booking
bookingSchema.methods.confirm = async function() {
  this.status = 'confirmed';
  this.confirmedAt = new Date();
  await this.save();
  return this;
};

// Static method to find bookings by email
bookingSchema.statics.findByEmail = function(email) {
  return this.find({ 'customerDetails.email': email }).sort({ bookingDate: -1 });
};

// Static method to get booking statistics
bookingSchema.statics.getStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$paymentDetails.amount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Booking', bookingSchema);