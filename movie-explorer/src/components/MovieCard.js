import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Rating,
  Skeleton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { getImageUrl } from '../services/api';
import { useMovieContext } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';

// Direct TMDb image URL for emergency backup
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMAGE = 'https://via.placeholder.com/300x450?text=No+Image';

const MovieCard = ({ movie, hideRating }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useMovieContext();
  const { currentUser } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    try {
      toggleFavorite(movie);
    } catch (error) {
      if (error.message === 'Please log in to add favorites') {
        setShowLoginAlert(true);
      }
    }
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  // Direct image URL creation (backup approach)
  const getDirectImageUrl = (path) => {
    if (!path) return FALLBACK_IMAGE;
    
    // If path already has http, use it directly
    if (path.startsWith('http')) return path;
    
    // Ensure path starts with /
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    return `${TMDB_IMAGE_BASE}${formattedPath}`;
  };
  
  // Format the release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.getFullYear();
  };
  
  // Calculate rating out of 5 stars (TMDb uses 10-point scale)
  const rating = movie.vote_average ? movie.vote_average / 2 : 0;

  // Determine image source with fallbacks
  let imageSource = movie.poster_path 
    ? getDirectImageUrl(movie.poster_path)
    : FALLBACK_IMAGE;
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };
  
  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.03)'
          }
        }}
        onClick={handleCardClick}
      >
        <CardActionArea>
          <Box sx={{ position: 'relative', paddingTop: '150%' /* 2:3 aspect ratio */ }}>
            {!imageLoaded && (
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="100%"
                sx={{ position: 'absolute', top: 0, left: 0 }}
                animation="wave"
              />
            )}
            
            <img
              src={imageError ? FALLBACK_IMAGE : imageSource}
              alt={movie.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: imageLoaded ? 'block' : 'none',
              }}
            />
            
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                p: 1,
              }}
            >
              <Tooltip title={isFavorite(movie.id) ? "Remove from favorites" : "Add to favorites"}>
                <IconButton
                  onClick={handleFavoriteClick}
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                >
                  {isFavorite(movie.id) ? (
                    <Favorite sx={{ color: 'red' }} />
                  ) : (
                    <FavoriteBorder sx={{ color: 'white' }} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
            
            {/* Year chip */}
            <Chip
              label={formatReleaseDate(movie.release_date)}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
              }}
            />
          </Box>
          
          <CardContent sx={{ flexGrow: 1, pb: 1 }}>
            <Typography gutterBottom variant="h6" component="div" noWrap>
              {movie.title}
            </Typography>
            
            {!hideRating && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Rating
                  value={rating}
                  precision={0.5}
                  size="small"
                  readOnly
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </CardActionArea>
      </Card>

      <Snackbar
        open={showLoginAlert}
        autoHideDuration={6000}
        onClose={() => setShowLoginAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="info" 
          onClose={() => setShowLoginAlert(false)}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Please log in to add favorites
              </Typography>
              <IconButton
                size="small"
                color="inherit"
                onClick={handleLoginClick}
              >
                Login
              </IconButton>
            </Box>
          }
        >
          You need to be logged in to add favorites
        </Alert>
      </Snackbar>
    </>
  );
};

export default MovieCard; 