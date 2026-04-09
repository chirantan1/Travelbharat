const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ✅ CORS configuration (keep your existing CORS config)
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://travelbharat-frontend.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('CORS policy does not allow access from this origin'), false);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS","PATCH"],
  credentials: true,
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use((req,res,next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://chirantanjana43_db_user:tzAgA4ZhvjN28hKj@cluster0.k35mvqc.mongodb.net/travelbharat?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ==================== ROUTES ====================
const stateRoutes = require('./routes/stateRoutes');
const cityRoutes = require('./routes/cityRoutes');
const placeRoutes = require('./routes/touristPlaceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes'); // ✅ This uses email service

app.use('/api/states', stateRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/subscribers', subscriberRoutes);

// Test route
app.get('/', (req,res) => {
  res.json({ 
    message: 'TravelBharat API is running!',
    version: '1.0.0',
    status: 'active'
  });
});

// Health check
app.get('/health', (req,res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req,res) => {
  res.status(404).json({ error: 'Route not found', path: req.url, method: req.method });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  if (err.name === 'ValidationError') return res.status(400).json({ error: 'Validation Error', details: err.message });
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid ID format', details: err.message });
  if (err.message && err.message.includes('CORS')) return res.status(403).json({ error: 'CORS policy violation', message: err.message });
  
  res.status(500).json({ error: 'Something went wrong!', message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// ✅ Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 TravelBharat API running at http://localhost:${PORT}`);
});