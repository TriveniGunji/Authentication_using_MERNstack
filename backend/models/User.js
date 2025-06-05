const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email addresses are unique
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email format validation
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  otp: {
    type: String,
    required: false, // OTP is only temporarily stored
  },
  otpExpires: {
    type: Date,
    required: false, // Expiration time for OTP
  },
  profileImage: {
    type: String, // Path to the uploaded image file
    default: null,
  },
  company: {
    type: String,
    default: null,
  },
  age: {
    type: Number,
    default: null,
  },
  dob: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose pre-save hook to hash the password before saving a new user or updating password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { // Only hash if password field is modified
    next();
  }
  const salt = await bcrypt.genSalt(10); // Generate a salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
});

// Method to compare entered password with the hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);