const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  // Use a default secret if environment variable is not available
  const secretKey = process.env.JWT_SECRET || 'movie_explorer_jwt_secret_key_2024';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';
  
  return jwt.sign({ id: userId }, secretKey, { expiresIn });
};

module.exports = { generateToken }; 