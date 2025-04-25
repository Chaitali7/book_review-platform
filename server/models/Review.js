const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      required: true,
      trim: true
    },
    votes: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      helpful: {
        type: Boolean,
        default: true
      }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for helpfulVotes count
reviewSchema.virtual('helpfulVotes').get(function() {
  return this.votes.filter(vote => vote.helpful).length;
});

// Virtual for notHelpfulVotes count
reviewSchema.virtual('notHelpfulVotes').get(function() {
  return this.votes.filter(vote => !vote.helpful).length;
});

// Compound index to ensure a user can only review a book once
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

// Helper function to update book rating
async function updateBookRating(bookId) {
  try {
    const Book = mongoose.model('Book');
    const book = await Book.findById(bookId);
    if (book) {
      const reviews = await mongoose.model('Review').find({ bookId });
      const averageRating = reviews.length > 0
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        : 0;
      
      book.averageRating = averageRating;
      book.totalReviews = reviews.length;
      await book.save();
    }
  } catch (error) {
    console.error('Error updating book rating:', error);
  }
}

// Middleware to update book's average rating after review changes
reviewSchema.post('save', async function() {
  await updateBookRating(this.bookId);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  await updateBookRating(this.bookId);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 