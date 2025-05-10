const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  poster_path: {
    type: String,
    default: null
  },
  backdrop_path: {
    type: String,
    default: null
  },
  overview: {
    type: String,
    default: ''
  },
  release_date: {
    type: String
  },
  vote_average: {
    type: Number
  },
  genre_ids: {
    type: [Number],
    default: []
  }
}, {
  timestamps: true
});

// Create a compound index to prevent duplicate favorites for the same user
FavoriteSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema); 