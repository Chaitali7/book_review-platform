import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Rating,
  Chip,
  Stack,
  Paper,
  InputBase,
  IconButton,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { fetchBooks } from '../redux/slices/bookSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleSearch = (event) => {
    event.preventDefault();
    // Implement search functionality
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: '#1976d2',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'linear-gradient(rgba(25, 118, 210, 0.8), rgba(25, 118, 210, 0.8)), url(https://source.unsplash.com/random?library)',
          height: '300px'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Grid container>
          <Grid item md={8}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
                mt: 4,
              }}
            >
              <Typography component="h1" variant="h2" color="inherit" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Welcome to Book Review Platform
              </Typography>
              <Typography variant="h5" color="inherit" paragraph sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                Discover your next favorite book through our curated collection and community reviews.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search and Filter Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Paper
                component="form"
                sx={{ 
                  p: '2px 4px', 
                  display: 'flex', 
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onSubmit={handleSearch}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: '10px', color: '#1976d2' }}>
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  displayEmpty
                  sx={{ 
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '& .MuiSelect-select': { py: 1.5 }
                  }}
                >
                  <MenuItem value="rating">Sort by Rating</MenuItem>
                  <MenuItem value="newest">Sort by Newest</MenuItem>
                  <MenuItem value="title">Sort by Title</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
          Featured Books
        </Typography>

        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  },
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <CardMedia
                  component="img"
                  height="280"
                  image={book.coverImage}
                  alt={book.title}
                  sx={{ 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  <Box sx={{ my: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={book.averageRating} readOnly precision={0.5} size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({book.totalReviews})
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                    {book.genre.map((genre, index) => (
                      <Chip 
                        key={index} 
                        label={genre} 
                        size="small" 
                        sx={{ 
                          marginBottom: 0.5,
                          backgroundColor: '#f5f5f5',
                          color: '#1976d2',
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.4,
                      fontSize: '0.875rem'
                    }}
                  >
                    {book.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    component={RouterLink} 
                    to={`/books/${book._id}`}
                    variant="outlined"
                    color="primary"
                    size="small"
                    fullWidth
                  >
                    Learn More
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 