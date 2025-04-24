const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getLatestReviews,
  getBookReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  voteReview
} = require('../controllers/reviewController');

// Public routes
router.get('/latest', getLatestReviews);
router.get('/book/:bookId', getBookReviews);
router.get('/user/:userId', getUserReviews);

// Protected routes (require authentication)
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/vote', protect, voteReview);

module.exports = router; 