const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../services/emailService');
const { generateOtp } = require('../utils/otpGenerator');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Node.js File System module

// Multer storage configuration for profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/profile_images');
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create a unique filename for the uploaded image
    cb(null, `<span class="math-inline">\{Date\.now\(\)\}\-</span>{file.originalname}`);
  },
});

// Filter to allow only specific image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only JPEG and PNG images are allowed'), false); // Reject file
  }
};

// Initialize Multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2 // Limit file size to 2MB
  },
  fileFilter: fileFilter,
});

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', upload.single('profileImage'), async (req, res) => {
  const { name, email, password, company, age, dob } = req.body;
  // Get the path of the uploaded image if it exists
  const profileImagePath = req.file ? `uploads/profile_images/${req.file.filename}` : null;

  try {
    let user = await User.findOne({ email });

    if (user) {
      // If user already exists, delete the uploaded image to prevent orphaned files
      if (profileImagePath && fs.existsSync(profileImagePath)) {
        fs.unlinkSync(profileImagePath);
      }
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user in the database
    user = await User.create({
      name,
      email,
      password,
      company,
      age,
      dob,
      profileImage: profileImagePath, // Store the path to the image
    });

    res.status(201).json({ message: 'Registration successful! Please login to receive OTP.' });

  } catch (error) {
    console.error("Registration error:", error.message);
    // If an error occurred during user creation (e.g., validation error), delete the uploaded file
    if (profileImagePath && fs.existsSync(profileImagePath)) {
        fs.unlinkSync(profileImagePath);
    }
    let errorMessage = 'Server error during registration';
    if (error.code === 11000) { // MongoDB duplicate key error (for unique email)
        errorMessage = 'Email already registered.';
    } else if (error.errors) { // Mongoose validation errors
        errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & send OTP to their email
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const otp = generateOtp(); // Generate a new OTP
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send OTP to user's email
    await sendOtpEmail(user.email, otp);

    res.status(200).json({ message: 'OTP sent to your email. Please verify.' });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: 'Server error during login or OTP sending.' });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and log in the user (generate token)
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      // Clear OTP even if incorrect or expired for security best practices
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try logging in again.' });
    }

    // OTP is valid, clear it from the database
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token for the session
    const token = generateToken(user._id);

    // Prepare user object to send back to frontend (exclude sensitive data)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage, // Send image path
      company: user.company,
      age: user.age,
      dob: user.dob,
    };

    res.status(200).json({
      token,
      user: userResponse,
      message: 'OTP verified and logged in successfully!',
    });

  } catch (error) {
    console.error("OTP verification error:", error.message);
    res.status(500).json({ message: 'Server error during OTP verification.' });
  }
});

// @route   GET /api/auth/profile
// @desc    Get current authenticated user's profile
// @access  Private (requires JWT token)
router.get('/profile', protect, async (req, res) => {
  // req.user is populated by the 'protect' middleware
  res.status(200).json({ user: req.user });
});

// @route   DELETE /api/auth/delete-account
// @desc    Delete the authenticated user's account
// @access  Private (requires JWT token)
router.delete('/delete-account', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user has a profile image, delete the file from the server
    if (user.profileImage) {
      const imagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(imagePath)) { // Check if file actually exists
        fs.unlinkSync(imagePath); // Delete the file
        console.log(`Deleted profile image: ${imagePath}`);
      }
    }

    // Delete the user record from the database
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error("Account deletion error:", error.message);
    res.status(500).json({ message: 'Server error during account deletion.' });
  }
});

module.exports = router;