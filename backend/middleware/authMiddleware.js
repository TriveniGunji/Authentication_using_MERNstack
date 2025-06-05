const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes, ensuring only authenticated users can access
const protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer TOKEN" string
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the decoded token and attach to request object
      // Exclude password, otp, and otpExpires for security
      req.user = await User.findById(decoded.id).select('-password -otp -otpExpires');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error(error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found in the header
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };