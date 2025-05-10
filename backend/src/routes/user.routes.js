const express = require('express');
const { check } = require('express-validator');
const { updateProfile, updatePassword } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Update profile
router.put(
  '/profile',
  [
    check('username', 'Username must be between 3 and 30 characters if provided')
      .optional()
      .isLength({ min: 3, max: 30 }),
    check('bio', 'Bio cannot be more than 500 characters')
      .optional()
      .isLength({ max: 500 })
  ],
  updateProfile
);

// Update password
router.put(
  '/password',
  [
    check('currentPassword', 'Current password is required').not().isEmpty(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  updatePassword
);

module.exports = router; 