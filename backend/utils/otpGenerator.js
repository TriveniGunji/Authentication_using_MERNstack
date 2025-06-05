const generateOtp = () => {
  // Generates a 6-digit random number as a string (e.g., "123456")
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { generateOtp };