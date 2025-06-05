const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const path = require('path');
const cors = require('cors'); // Import cors middleware

dotenv.config(); // Load environment variables from .env file

const app = express();

// Connect to database
connectDB();


app.use(cors());
app.use(express.json()); // For parsing application/json bodies
// Serve static files (profile images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Rate Limiting to prevent brute-force attacks
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', apiLimiter); // Apply rate limiting to all API routes

// Routes
app.use('/api/auth', authRoutes); // All authentication related routes

// Simple route for testing backend status
app.get('/', (req, res) => {
  res.send('Auth Backend API is running...');
});

const PORT = process.env.API_PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});