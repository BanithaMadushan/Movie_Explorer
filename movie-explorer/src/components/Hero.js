import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Button, Container, useTheme, Fade, Grow, Slide, CircularProgress, Chip, Stack, Rating } from '@mui/material';
import { PlayArrow, Info, NavigateBefore, NavigateNext, Theaters, CalendarToday, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getBackdropUrl, getImageUrl } from '../services/api';
import { keyframes } from '@mui/system';

// Duration for each slide in milliseconds
const SLIDE_DURATION = 8000;
const TRANSITION_DURATION = 1000;

// Base URL for TMDb images - using direct constant
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// Keyframes for zoom effect
const zoomIn = keyframes`
  from {
    transform: scale(1.05);
  }
  to {
    transform: scale(1);
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleUp = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
`;

const Hero = ({ movie: initialMovie, movies }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [displayedMovie, setDisplayedMovie] = useState(initialMovie || (movies && movies[0]));
  const [fadeIn, setFadeIn] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posterLoaded, setPosterLoaded] = useState(false);
  
  // Use provided movies array or create array from single movie
  const movieList = movies?.length ? movies : (initialMovie ? [initialMovie] : []);
  
  // Basic function to construct a direct image URL
  const getDirectImageUrl = (path, size = 'original') => {
    if (!path) return null;
    
    // Ensure the path starts with /
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    return `${TMDB_IMAGE_BASE_URL}${size}${formattedPath}`;
  };

  // Effect to handle auto-rotation of movies
  useEffect(() => {
    if (movieList.length <= 1) return;
    
    const rotateMovies = () => {
      if (transitioning) return;
      
      setTransitioning(true);
      setFadeIn(false);
      setPosterLoaded(false);
      
      setTimeout(() => {
        setCurrentMovieIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % movieList.length;
          setDisplayedMovie(movieList[nextIndex]);
          return nextIndex;
        });
        setFadeIn(true);
        setTimeout(() => {
          setTransitioning(false);
        }, TRANSITION_DURATION);
      }, TRANSITION_DURATION);
    };
    
    const interval = setInterval(rotateMovies, SLIDE_DURATION);
    
    return () => clearInterval(interval);
  }, [movieList, transitioning]);
  
  const handleViewDetails = () => {
    if (!displayedMovie) return;
    navigate(`/movie/${displayedMovie.id}`);
  };
  
  const handlePrevious = (e) => {
    e.stopPropagation();
    if (transitioning) return;
    
    setTransitioning(true);
    setFadeIn(false);
    setPosterLoaded(false);
    
    setTimeout(() => {
      setCurrentMovieIndex(prevIndex => {
        const newIndex = prevIndex === 0 ? movieList.length - 1 : prevIndex - 1;
        setDisplayedMovie(movieList[newIndex]);
        return newIndex;
      });
      setFadeIn(true);
      setTimeout(() => {
        setTransitioning(false);
      }, TRANSITION_DURATION);
    }, TRANSITION_DURATION);
  };
  
  const handleNext = (e) => {
    e.stopPropagation();
    if (transitioning) return;
    
    setTransitioning(true);
    setFadeIn(false);
    setPosterLoaded(false);
    
    setTimeout(() => {
      setCurrentMovieIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % movieList.length;
        setDisplayedMovie(movieList[newIndex]);
        return newIndex;
      });
      setFadeIn(true);
      setTimeout(() => {
        setTransitioning(false);
      }, TRANSITION_DURATION);
    }, TRANSITION_DURATION);
  };
  
  // Helper to determine the image source
  const getMovieImageUrl = (movie) => {
    if (!movie) return null;
    
    if (movie.backdrop_path) {
      return getDirectImageUrl(movie.backdrop_path);
    } else if (movie.poster_path) {
      return getDirectImageUrl(movie.poster_path);
    }
    
    return 'https://via.placeholder.com/1920x1080?text=No+Image+Available';
  };
  
  // Helper to get poster image
  const getMoviePosterUrl = (movie) => {
    if (!movie || !movie.poster_path) return null;
    return getDirectImageUrl(movie.poster_path, 'w500');
  };
  
  const handleImageLoad = () => {
    setLoading(false);
  };
  
  const handleImageError = () => {
    setLoading(false);
    console.error("Image failed to load", displayedMovie?.title);
  };
  
  const handlePosterLoad = () => {
    setPosterLoaded(true);
  };
  
  // Format the year from date
  const getYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };
  
  // If no movie data is available, don't render anything
  if (!movieList.length || !displayedMovie) return null;
  
  const imageUrl = getMovieImageUrl(displayedMovie);
  const posterUrl = getMoviePosterUrl(displayedMovie);
  const rating = displayedMovie.vote_average ? displayedMovie.vote_average / 2 : 0;
  
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw', // Full viewport width
        maxWidth: '100%', // Ensure no horizontal scrollbar
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        m: 0, // No margin
        p: 0, // No padding
        backgroundColor: 'black',
      }}
    >
      {/* Fullscreen background image */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 0 // Changed from -2 to 0
      }}>
        <Fade in={fadeIn} timeout={TRANSITION_DURATION}>
          <img
            src={imageUrl}
            alt={displayedMovie.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              animation: fadeIn ? `${scaleUp} 15s ease-out forwards` : 'none',
            }}
          />
        </Fade>
        
        {/* Dark overlay - more transparent to see the image better */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.5) 100%)',
            zIndex: 1,
          }}
        />
        
        {/* Loading indicator */}
        {loading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              zIndex: 2
            }}
          >
            <CircularProgress color="primary" size={60} />
          </Box>
        )}
      </Box>
      
      {/* Navigation arrows */}
      {movieList.length > 1 && (
        <>
          <Button 
            onClick={handlePrevious}
            disabled={transitioning}
            sx={{
              position: 'absolute',
              left: { xs: 10, md: 30 },
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: 'auto',
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 2,
            }}
          >
            <NavigateBefore fontSize="large" />
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={transitioning}
            sx={{
              position: 'absolute',
              right: { xs: 10, md: 30 },
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: 'auto',
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 2,
            }}
          >
            <NavigateNext fontSize="large" />
          </Button>
        </>
      )}
      
      {/* Content with fade transition - now centered on screen */}
      <Fade in={fadeIn} timeout={TRANSITION_DURATION}>
        <Container maxWidth="xl" sx={{ 
          position: 'relative', 
          zIndex: 1, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <Box
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '800px',
              px: 2,
            }}
          >
            {/* Movie genres */}
            <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {displayedMovie.genre_ids?.slice(0, 3).map((genreId, index) => (
                <Chip 
                  key={genreId} 
                  label={getGenreName(genreId)} 
                  color="primary" 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    animation: fadeIn ? `${fadeInUp} 0.4s ease-out ${0.2 + index * 0.1}s forwards` : 'none',
                    opacity: 0,
                    m: 0.5,
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.7)',
                    '& .MuiChip-label': { 
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)' 
                    }
                  }}
                />
              ))}
              {displayedMovie.release_date && (
                <Chip
                  icon={<CalendarToday fontSize="small" sx={{ color: 'white' }} />}
                  label={getYear(displayedMovie.release_date)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    animation: fadeIn ? `${fadeInUp} 0.4s ease-out 0.5s forwards` : 'none',
                    opacity: 0,
                    m: 0.5,
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.7)',
                    '& .MuiChip-label': { 
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)' 
                    }
                  }}
                />
              )}
            </Stack>

            <Slide direction="up" in={fadeIn} timeout={TRANSITION_DURATION + 300}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 900,
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 4px 15px rgba(0,0,0,0.8)',
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.5px',
                  mb: 2,
                }}
              >
                {displayedMovie.title}
              </Typography>
            </Slide>
            
            {/* Rating */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3, 
              justifyContent: 'center',
              animation: fadeIn ? `${fadeInUp} 0.6s ease-out` : 'none',
            }}>
              <Rating 
                value={rating} 
                readOnly 
                precision={0.5}
                sx={{ color: 'gold', mr: 1 }}
              />
              <Typography variant="body1" fontWeight="bold" sx={{ color: 'white' }}>
                {displayedMovie.vote_average?.toFixed(1)} / 10
              </Typography>
              {displayedMovie.vote_count > 0 && (
                <Typography variant="caption" sx={{ ml: 1, color: 'rgba(255,255,255,0.8)' }}>
                  ({displayedMovie.vote_count.toLocaleString()} votes)
                </Typography>
              )}
            </Box>
            
            <Slide direction="up" in={fadeIn} timeout={TRANSITION_DURATION + 400}>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: 'white',
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                  maxWidth: '700px',
                }}
              >
                {displayedMovie.overview}
              </Typography>
            </Slide>
            
            <Slide direction="up" in={fadeIn} timeout={TRANSITION_DURATION + 500}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={handleViewDetails}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  Watch Trailer
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Info />}
                  onClick={handleViewDetails}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      borderColor: 'white',
                    },
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  More Info
                </Button>
              </Box>
            </Slide>
          </Box>
          
          {/* Dots navigation */}
          {movieList.length > 1 && (
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                justifyContent: 'center',
                position: 'absolute',
                bottom: { xs: 40, md: 60 },
                left: 0,
                right: 0,
                zIndex: 10,
              }}
            >
              {movieList.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => !transitioning && setCurrentMovieIndex(index)}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: currentMovieIndex === index ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: currentMovieIndex === index ? 'primary.main' : 'rgba(255, 255, 255, 0.8)',
                      transform: 'scale(1.2)',
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Container>
      </Fade>
    </Box>
  );
};

// Helper function to map genre IDs to names
const getGenreName = (id) => {
  const genres = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
  
  return genres[id] || 'Unknown';
};

export default Hero; 