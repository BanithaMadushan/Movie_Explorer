import axios from 'axios';

// API Base URL
const API_URL = 'http://localhost:5000/api';

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get all favorite movies for the current user
 * @returns {Promise} Promise containing favorites data
 */
export const getFavorites = async () => {
  try {
    const response = await axios.get(`${API_URL}/favorites`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
  }
};

/**
 * Add a movie to favorites
 * @param {Object} movie - Movie object with movieId, title, and poster
 * @returns {Promise} Promise containing updated favorites data
 */
export const addToFavorites = async (movie) => {
  try {
    console.log('Adding movie to favorites:', movie);
    const response = await axios.post(`${API_URL}/favorites`, {
      movieId: movie.id.toString(), // Ensure movieId is a string
      title: movie.title,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
    }, {
      headers: getAuthHeader()
    });
    console.log('Add to favorites response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add to favorites');
  }
};

/**
 * Remove a movie from favorites
 * @param {string} movieId - ID of the movie to remove
 * @returns {Promise} Promise containing updated favorites data
 */
export const removeFromFavorites = async (movieId) => {
  try {
    const response = await axios.delete(`${API_URL}/favorites/${movieId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to remove from favorites');
  }
};

/**
 * Check if a movie is in favorites
 * @param {string} movieId - ID of the movie to check
 * @returns {Promise<boolean>} Promise containing boolean indicating if movie is favorited
 */
export const isFavorite = async (movieId) => {
  try {
    const response = await axios.get(`${API_URL}/favorites/${movieId}`, {
      headers: getAuthHeader()
    });
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite status:', error.response?.data || error.message);
    return false;
  }
}; 