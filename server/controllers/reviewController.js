const Review = require('../models/Review');
const Book = require('../models/Book');
const asyncHandler = require('express-async-handler');

// @desc    Get latest reviews
// @route   GET /api/reviews/latest
// @access  Public
const getLatestReviews = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  
  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'username profilePicture')
    .populate('bookId', 'title author coverImage');

  res.json({
    success: true,
    reviews
  });
});

// @desc    Get reviews for a specific book
// @route   GET /api/reviews/book/:bookId
// @access  Public
const getBookReviews = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ bookId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username profilePicture')
      .populate('bookId', 'title author coverImage'),
    Review.countDocuments({ bookId })
  ]);

  res.json({
    success: true,
    reviews,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalReviews: total
  });
});

// @desc    Get reviews by a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username profilePicture')
      .populate('bookId', 'title author coverImage'),
    Review.countDocuments({ userId })
  ]);

  res.json({
    success: true,
    reviews,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalReviews: total
  });
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { bookId, rating, review } = req.body;

  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  if (!bookId || !rating || !review) {
    res.status(400);
    throw new Error('Please provide bookId, rating and review');
  }

  // Check if book exists
  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  // Check if user has already reviewed this book
  const existingReview = await Review.findOne({
    userId: req.user._id,
    bookId
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this book');
  }

  const newReview = await Review.create({
    userId: req.user._id,
    bookId,
    rating,
    review
  });

  const populatedReview = await Review.findById(newReview._id)
    .populate('userId', 'username profilePicture')
    .populate('bookId', 'title author coverImage');

  res.status(201).json({
    success: true,
    review: populatedReview
  });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;
  const reviewId = req.params.id;

  const existingReview = await Review.findById(reviewId);

  if (!existingReview) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review
  if (existingReview.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this review');
  }

  existingReview.rating = rating || existingReview.rating;
  existingReview.review = review || existingReview.review;
  await existingReview.save();

  // Update book's average rating
  const book = await Book.findById(existingReview.bookId);
  const reviews = await Review.find({ bookId: existingReview.bookId });
  const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
  
  book.averageRating = averageRating;
  await book.save();

  const updatedReview = await Review.findById(reviewId)
    .populate('userId', 'username profilePicture')
    .populate('bookId', 'title author coverImage');

  res.json({
    success: true,
    review: updatedReview
  });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review
  if (review.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await review.deleteOne();

  res.json({
    success: true,
    reviewId: reviewId,
    message: 'Review deleted successfully'
  });
});

// @desc    Vote on a review
// @route   POST /api/reviews/:id/vote
// @access  Private
const voteReview = asyncHandler(async (req, res) => {
  const { helpful } = req.body;
  const reviewId = req.params.id;

  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Remove existing vote by this user if any
  review.votes = review.votes.filter(
    vote => vote.userId.toString() !== req.user._id.toString()
  );

  // Add new vote
  review.votes.push({
    userId: req.user._id,
    helpful: helpful
  });

  await review.save();

  const updatedReview = await Review.findById(reviewId)
    .populate('userId', 'username profilePicture')
    .populate('bookId', 'title author coverImage');

  res.json({
    success: true,
    review: updatedReview
  });
});

module.exports = {
  getLatestReviews,
  getBookReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  voteReview
};