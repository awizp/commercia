import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add or update review
export const submitReview = createAsyncThunk(
    "review/submitReview",
    async (reviewData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            };
            const { data } = await axios.put("/api/v1/review", reviewData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to submit review"
            );
        }
    }
);

// Delete own review
export const removeUserReview = createAsyncThunk(
    "review/removeUserReview",
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/review?productId=${productId}`, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete review"
            );
        }
    }
);

const initialState = {
    loading: false,
    success: false,
    isDeleted: false,
    message: null,
    error: null
};

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        resetReviewStatus: (state) => {
            state.loading = false;
            state.success = false;
            state.isDeleted = false;
            state.message = null;
            state.error = null;
        },
        clearReviewErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Submit Review (Add / Update)
            .addCase(submitReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || "Review submitted successfully";
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Review
            .addCase(removeUserReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeUserReview.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = true;
                state.message = action.payload.message || "Review deleted successfully";
            })
            .addCase(removeUserReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetReviewStatus, clearReviewErrors } = reviewSlice.actions;
export default reviewSlice.reducer;