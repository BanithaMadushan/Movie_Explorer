const express = require('express');
const router = express.Router();
const { 
  getFavorites, 
  addFavorite, 
  removeFavorite,
  checkFavorite
} = require('../controllers/favoritesController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get all favorites and add a favorite
router.route('/')
  .get(getFavorites)
  .post(addFavorite);

// Check if a movie is in favorites and remove from favorites
router.route('/:movieId')
  .get(checkFavorite)
  .delete(removeFavorite);

module.exports = router; 