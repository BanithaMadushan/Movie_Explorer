const User = require('../models/User');

// @desc    Get user's favorite movies
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: user.favorites.length,
      favorites: user.favorites.sort((a, b) => b.addedAt - a.addedAt)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add movie to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const { movieId, title, poster } = req.body;
    const userId = req.user.id;
    
    console.log('Add favorite request:', req.body);
    console.log('User ID:', userId);
    
    if (!movieId || !title) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide movieId and title'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if movie is already in favorites
    const existingFavorite = user.favorites.find(fav => fav.movieId === movieId.toString());
    if (existingFavorite) {
      console.log('Movie already in favorites:', movieId);
      return res.status(400).json({
        success: false,
        message: 'Movie is already in favorites'
      });
    }
    
    // Add to favorites
    user.favorites.push({
      movieId: movieId.toString(),
      title,
      poster,
      addedAt: Date.now()
    });
    
    const savedUser = await user.save();
    console.log('Favorite added successfully');
    
    res.status(200).json({
      success: true,
      message: 'Movie added to favorites',
      favorites: savedUser.favorites
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    next(error);
  }
};

// @desc    Remove movie from favorites
// @route   DELETE /api/favorites/:movieId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;
    
    console.log('Remove favorite request - movieId:', movieId);
    console.log('User ID:', userId);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if movie exists in favorites
    const favoriteIndex = user.favorites.findIndex(fav => fav.movieId === movieId.toString());
    if (favoriteIndex === -1) {
      console.log('Movie not in favorites:', movieId);
      return res.status(404).json({
        success: false,
        message: 'Movie not found in favorites'
      });
    }
    
    // Remove from favorites
    user.favorites.splice(favoriteIndex, 1);
    await user.save();
    console.log('Favorite removed successfully');
    
    res.status(200).json({
      success: true,
      message: 'Movie removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    next(error);
  }
};

// @desc    Check if a movie is in favorites
// @route   GET /api/favorites/:movieId
// @access  Private
const checkFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;
    
    console.log('Check favorite request - movieId:', movieId);
    console.log('User ID:', userId);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if movie exists in favorites
    const isFavorite = user.favorites.some(fav => fav.movieId === movieId.toString());
    console.log('Is favorite:', isFavorite);
    
    res.status(200).json({
      success: true,
      isFavorite
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
}; 