const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - authentication middleware
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, no token provided' 
      });
    }

    try {
      // Use a default secret if environment variable is not available
      const secretKey = process.env.JWT_SECRET || 'movie_explorer_jwt_secret_key_2024';
      
      // Verify token
      const decoded = jwt.verify(token, secretKey);

      // Attach user to request object
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found with this token' 
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token invalid' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = { protect }; 