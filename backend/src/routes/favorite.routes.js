const express = require('express');
const { check } = require('express-validator');
const { 
  getFavorites, 
  addFavorite, 
  removeFavorite, 
  checkFavorite,
  clearFavorites 
} = require('../controllers/favorite.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all favorites & Clear all favorites
router
  .route('/')
  .get(getFavorites)
  .delete(clearFavorites);

// Add favorite
router.post(
  '/',
  [
    check('movieId', 'Movie ID is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty()
  ],
  addFavorite
);

// Remove favorite
router.delete('/:id', removeFavorite);

// Check if movie is in favorites
router.get('/check/:id', checkFavorite);

module.exports = router; 