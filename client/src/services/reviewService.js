import api from './api';

const reviewService = {
  // Fetch latest reviews with optional limit
  getLatestReviews: async (limit = 3) => {
    const response = await api.get(`/reviews/latest?limit=${limit}`);
    return response.data;
  },

  // Fetch reviews for a specific book with pagination
  getBookReviews: async (bookId, limit = 10, page = 1) => {
    const response = await api.get(`/reviews/book/${bookId}?limit=${limit}&page=${page}`);
    return response.data;
  },

  // Create a new review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Update an existing review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};

export default reviewService; 