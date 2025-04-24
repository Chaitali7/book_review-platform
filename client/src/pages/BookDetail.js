import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  Button,
  Divider,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  fetchBookById,
  clearCurrentBook,
} from '../redux/slices/bookSlice';
import {
  fetchBookReviews,
  createReview,
  updateReview,
  deleteReview,
  voteReview,
} from '../redux/slices/reviewSlice';

const BookDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBook: book, loading: bookLoading } = useSelector(
    (state) => state.books
  );
  const {
    bookReviews: reviews,
    loading: reviewsLoading,
    error: reviewError,
  } = useSelector((state) => state.reviews);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review: '',
  });
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    dispatch(fetchBookById(id));
    dispatch(fetchBookReviews({ bookId: id }));
    return () => {
      dispatch(clearCurrentBook());
    };
  }, [dispatch, id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (editingReview) {
      await dispatch(
        updateReview({
          id: editingReview._id,
          reviewData: reviewForm,
        })
      );
    } else {
      await dispatch(
        createReview({
          bookId: id,
          ...reviewForm,
        })
      );
    }
    setIsReviewDialogOpen(false);
    setReviewForm({ rating: 0, review: '' });
    setEditingReview(null);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      review: review.review,
    });
    setIsReviewDialogOpen(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await dispatch(deleteReview(reviewId));
    }
  };

  const handleVoteReview = async (reviewId, helpful) => {
    await dispatch(voteReview({ id: reviewId, helpful }));
  };

  if (bookLoading || reviewsLoading) {
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

  if (!book) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Book not found
        </Typography>
      </Container>
    );
  }

  const userReview = reviews.find((review) => review.userId._id === user?._id);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        {/* Book Details */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={book.coverImage || '/default-book-cover.jpg'}
                alt={book.title}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={book.averageRating}
                precision={0.5}
                readOnly
                size="large"
              />
              <Typography variant="body1" sx={{ ml: 1 }}>
                ({book.totalReviews} reviews)
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {book.description}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Genre: {book.genre.join(', ')}
              </Typography>
              <Typography variant="subtitle1">
                Published: {book.publishedYear}
              </Typography>
            </Box>
            {isAuthenticated && !userReview && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsReviewDialogOpen(true)}
              >
                Write a Review
              </Button>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Reviews Section */}
        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>

        {reviewError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {reviewError}
          </Alert>
        )}

        {reviews.map((review) => (
          <Card key={review._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {review.userId.username}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                {user?._id === review.userId._id && (
                  <Box>
                    <Button
                      size="small"
                      onClick={() => handleEditReview(review)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </Box>
              <Typography variant="body1" paragraph>
                {review.review}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  size="small"
                  onClick={() => handleVoteReview(review._id, true)}
                  sx={{ mr: 1 }}
                >
                  Helpful ({review.helpfulVotes})
                </Button>
                <Button
                  size="small"
                  onClick={() => handleVoteReview(review._id, false)}
                >
                  Not Helpful ({review.unhelpfulVotes})
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Review Dialog */}
        <Dialog
          open={isReviewDialogOpen}
          onClose={() => {
            setIsReviewDialogOpen(false);
            setEditingReview(null);
            setReviewForm({ rating: 0, review: '' });
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingReview ? 'Edit Review' : 'Write a Review'}
          </DialogTitle>
          <form onSubmit={handleReviewSubmit}>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={reviewForm.rating}
                  onChange={(event, newValue) => {
                    setReviewForm({ ...reviewForm, rating: newValue });
                  }}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Review"
                name="review"
                value={reviewForm.review}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, review: e.target.value })
                }
                required
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setIsReviewDialogOpen(false);
                  setEditingReview(null);
                  setReviewForm({ rating: 0, review: '' });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editingReview ? 'Update Review' : 'Submit Review'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default BookDetail; 