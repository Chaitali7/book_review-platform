import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch latest reviews
export const fetchLatestReviews = createAsyncThunk(
  'reviews/fetchLatest',
  async ({ limit = 3 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/reviews/latest', { params: { limit } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch reviews for a specific book
export const fetchBookReviews = createAsyncThunk(
  'reviews/fetchBookReviews',
  async ({ bookId, limit = 10, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/book/${bookId}`, {
        params: { limit, page }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new review
export const createReview = createAsyncThunk(
  'reviews/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async ({ userId, params }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const voteReview = createAsyncThunk(
  'reviews/voteReview',
  async ({ id, helpful }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/reviews/${id}/vote`, { helpful });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    bookReviews: [],
    userReviews: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchLatestReviews
      .addCase(fetchLatestReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(fetchLatestReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch reviews';
      })
      // Handle fetchBookReviews
      .addCase(fetchBookReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.bookReviews = action.payload.reviews;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalReviews = action.payload.totalReviews;
      })
      .addCase(fetchBookReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch reviews';
      })
      // Handle fetchUserReviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload.reviews;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalReviews = action.payload.totalReviews;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user reviews';
      })
      // Handle createReview
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.bookReviews.unshift(action.payload.review);
        state.totalReviews += 1;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create review';
      })
      // Handle updateReview
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookReviews.findIndex(
          (review) => review._id === action.payload._id
        );
        if (index !== -1) {
          state.bookReviews[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update review';
      })
      // Handle deleteReview
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.bookReviews = state.bookReviews.filter(
          (review) => review._id !== action.payload.reviewId
        );
        state.totalReviews = state.totalReviews > 0 ? state.totalReviews - 1 : 0;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete review';
      })
      // Handle voteReview
      .addCase(voteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voteReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookReviews.findIndex(
          (review) => review._id === action.payload._id
        );
        if (index !== -1) {
          state.bookReviews[index] = action.payload;
        }
      })
      .addCase(voteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to vote on review';
      });
  }
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer; 