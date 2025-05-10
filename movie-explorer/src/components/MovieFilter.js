import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import { useMovieContext } from '../context/MovieContext';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 80 }, (_, i) => currentYear - i);

const MovieFilter = ({ onFilter }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { loading } = useMovieContext();
  
  const [yearFrom, setYearFrom] = useState(2000);
  const [yearTo, setYearTo] = useState(currentYear);
  const [rating, setRating] = useState([0, 10]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [showFilters, setShowFilters] = useState(!isMobile);
  
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };
  
  const handleYearFromChange = (event) => {
    const value = Number(event.target.value);
    setYearFrom(value);
    if (value > yearTo) {
      setYearTo(value);
    }
  };
  
  const handleYearToChange = (event) => {
    const value = Number(event.target.value);
    setYearTo(value);
    if (value < yearFrom) {
      setYearFrom(value);
    }
  };
  
  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };
  
  const handleApplyFilter = () => {
    onFilter({
      'primary_release_date.gte': `${yearFrom}-01-01`,
      'primary_release_date.lte': `${yearTo}-12-31`,
      'vote_average.gte': rating[0],
      'vote_average.lte': rating[1],
      sort_by: sortBy,
    });
  };
  
  const handleClearFilter = () => {
    setYearFrom(2000);
    setYearTo(currentYear);
    setRating([0, 10]);
    setSortBy('popularity.desc');
    onFilter({
      sort_by: 'popularity.desc',
    });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <Paper
      elevation={1}
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Filter Movies
        </Typography>
        {isMobile && (
          <Button
            startIcon={<FilterList />}
            onClick={toggleFilters}
            color="primary"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        )}
      </Box>
      
      {showFilters && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>Release Year</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>From</InputLabel>
                <Select
                  value={yearFrom}
                  label="From"
                  onChange={handleYearFromChange}
                >
                  {years.map((year) => (
                    <MenuItem key={`from-${year}`} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>To</InputLabel>
                <Select
                  value={yearTo}
                  label="To"
                  onChange={handleYearToChange}
                >
                  {years.map((year) => (
                    <MenuItem key={`to-${year}`} value={year} disabled={year < yearFrom}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>Rating</Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={rating}
                onChange={handleRatingChange}
                valueLabelDisplay="auto"
                step={0.5}
                marks
                min={0}
                max={10}
                valueLabelFormat={(x) => `${x}/10`}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  {rating[0]}/10
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {rating[1]}/10
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>Sort By</Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Sort</InputLabel>
              <Select
                value={sortBy}
                label="Sort"
                onChange={handleSortByChange}
              >
                <MenuItem value="popularity.desc">Popularity (High to Low)</MenuItem>
                <MenuItem value="popularity.asc">Popularity (Low to High)</MenuItem>
                <MenuItem value="vote_average.desc">Rating (High to Low)</MenuItem>
                <MenuItem value="vote_average.asc">Rating (Low to High)</MenuItem>
                <MenuItem value="primary_release_date.desc">Release Date (Newest)</MenuItem>
                <MenuItem value="primary_release_date.asc">Release Date (Oldest)</MenuItem>
                <MenuItem value="original_title.asc">Title (A-Z)</MenuItem>
                <MenuItem value="original_title.desc">Title (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearFilter}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilter}
                disabled={loading}
              >
                Apply Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default MovieFilter; 