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
      trim: true,
      minlength: 10
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

// Middleware to update book's average rating after review changes
reviewSchema.post('save', async function() {
  const Book = mongoose.model('Book');
  const book = await Book.findById(this.bookId);
  if (book) {
    await book.updateAverageRating();
  }
});

reviewSchema.post('remove', async function() {
  const Book = mongoose.model('Book');
  const book = await Book.findById(this.bookId);
  if (book) {
    await book.updateAverageRating();
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 