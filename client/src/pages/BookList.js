import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Rating,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { fetchBooks } from '../redux/slices/bookSlice';

const BookList = () => {
  const dispatch = useDispatch();
  const { books, loading, totalPages, currentPage, totalBooks } = useSelector(
    (state) => state.books
  );

  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    minRating: '',
    publishedYear: '',
    sort: 'createdAt:desc',
  });

  useEffect(() => {
    dispatch(fetchBooks({ ...filters, page: currentPage }));
  }, [dispatch, filters, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchBooks({ ...filters, page: value }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Books
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or author"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                name="genre"
                value={filters.genre}
                onChange={handleFilterChange}
                label="Genre"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Fiction">Fiction</MenuItem>
                <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                <MenuItem value="Mystery">Mystery</MenuItem>
                <MenuItem value="Science Fiction">Science Fiction</MenuItem>
                <MenuItem value="Romance">Romance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Minimum Rating</InputLabel>
              <Select
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                label="Minimum Rating"
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="4">4+ Stars</MenuItem>
                <MenuItem value="3">3+ Stars</MenuItem>
                <MenuItem value="2">2+ Stars</MenuItem>
                <MenuItem value="1">1+ Stars</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                label="Sort By"
              >
                <MenuItem value="createdAt:desc">Newest First</MenuItem>
                <MenuItem value="averageRating:desc">Highest Rated</MenuItem>
                <MenuItem value="title:asc">Title A-Z</MenuItem>
                <MenuItem value="title:desc">Title Z-A</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Book List */}
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card
                component={RouterLink}
                to={`/books/${book._id}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={book.coverImage || '/default-book-cover.jpg'}
                  alt={book.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h2">
                    {book.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    by {book.author}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      value={book.averageRating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({book.totalReviews} reviews)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        {books.length === 0 && (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No books found matching your criteria.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default BookList; 