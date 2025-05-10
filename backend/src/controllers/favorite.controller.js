const Favorite = require('../models/favorite.model');
const { validationResult } = require('express-validator');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add movie to favorites
// @route   POST /api/favorites
// @access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    // Add user ID to request body
    req.body.user = req.user.id;

    // Check if movie is already in favorites
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      movieId: req.body.movieId
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in favorites'
      });
    }

    // Create favorite
    const favorite = await Favorite.create(req.body);

    res.status(201).json({
      success: true,
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove movie from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
exports.removeFavorite = async (req, res, next) => {
  try {
    // Find favorite by movie ID
    let favorite = await Favorite.findOne({
      user: req.user.id,
      movieId: req.params.id
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    // Delete favorite
    await favorite.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if movie is in favorites
// @route   GET /api/favorites/check/:id
// @access  Private
exports.checkFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      movieId: req.params.id
    });

    res.status(200).json({
      success: true,
      isFavorite: favorite ? true : false
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all favorites
// @route   DELETE /api/favorites
// @access  Private
exports.clearFavorites = async (req, res, next) => {
  try {
    await Favorite.deleteMany({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 