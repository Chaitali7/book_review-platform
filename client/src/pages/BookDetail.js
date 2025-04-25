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
import { getProfile } from '../redux/slices/authSlice';

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
    
    // Fetch user profile if authenticated but no user data
    if (isAuthenticated && !user) {
      dispatch(getProfile());
    }
    
    return () => {
      dispatch(clearCurrentBook());
    };
  }, [dispatch, id, isAuthenticated, user]);

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
      const result = await dispatch(
        createReview({
          bookId: id,
          ...reviewForm,
        })
      );
      
      // Check if the action was rejected
      if (createReview.rejected.match(result)) {
        // Keep dialog open if there was an error
        return;
      }
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
      const result = await dispatch(deleteReview(reviewId));
      if (!deleteReview.rejected.match(result)) {
        // Refresh book details to update the review count and average rating
        dispatch(fetchBookById(id));
      }
    }
  };

  const handleVoteReview = async (reviewId, helpful) => {
    await dispatch(voteReview({ id: reviewId, helpful }));
  };

  const isUsersReview = (review) => {
    return isAuthenticated && 
           user && 
           user._id && 
           review.userId && 
           review.userId._id && 
           review.userId._id.toString() === user._id.toString();
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

        {reviews.map((review) => {
          // Debug log to check user IDs
          console.log('Review user ID:', review.userId._id);
          console.log('Current user ID:', user?._id);
          console.log('Is authenticated:', isAuthenticated);
          
          return (
          <Card key={review._id} sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" component="div">
                    {review.userId.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                </Box>
                <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                <Typography variant="body1" paragraph>
                  {review.review}
                </Typography>
                {isUsersReview(review) && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEditReview(review)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
            </CardContent>
          </Card>
          );
        })}

        {/* Review Dialog */}
        <Dialog
          open={isReviewDialogOpen}
          onClose={() => {
            setIsReviewDialogOpen(false);
            setReviewForm({ rating: 0, review: '' });
            setEditingReview(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingReview ? 'Edit Review' : 'Write a Review'}
          </DialogTitle>
          <form onSubmit={handleReviewSubmit}>
            <DialogContent>
              {reviewError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {reviewError}
                </Alert>
              )}
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
                autoFocus
                margin="dense"
                label="Your Review"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={reviewForm.review}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, review: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!reviewForm.rating || !reviewForm.review}
              >
                {editingReview ? 'Update' : 'Submit'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default BookDetail; 