import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosConfig = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true
};

// Get All Products (Admin)
export const getAdminProducts = createAsyncThunk(
    "adminProduct/getAdminProducts",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/v1/admin/products", { withCredentials: true });
            return data.products;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to load products");
        }
    }
);

// Add New Product
export const createProduct = createAsyncThunk(
    "adminProduct/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post("/api/v1/admin/product/add", productData, axiosConfig);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to add product");
        }
    }
);

// Update Existing Product
export const updateProduct = createAsyncThunk(
    "adminProduct/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/v1/admin/product/${id}`, productData, axiosConfig);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to update product");
        }
    }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
    "adminProduct/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/product/${id}`, { withCredentials: true });
            return { id, message: data.message };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to delete product");
        }
    }
);

// Get Product Reviews
export const getProductReviews = createAsyncThunk(
    "adminProduct/getProductReviews",
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/admin/reviews?id=${productId}`, { withCredentials: true });
            return data.reviews;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to load reviews");
        }
    }
);

// Delete Review
export const deleteReview = createAsyncThunk(
    "adminProduct/deleteReview",
    async ({ productId, reviewId }, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(
                `/api/v1/admin/reviews?productId=${productId}&reviewId=${reviewId}`,
                { withCredentials: true }
            );
            return { reviewId, message: data.message, product: data.product };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to delete review");
        }
    }
);

const adminProductSlice = createSlice({
    name: "adminProduct",
    initialState: {
        products: [],
        reviews: [],
        loading: false,
        error: null,
        isCreated: false,
        isUpdated: false,
        isDeleted: false,
        message: null
    },
    reducers: {
        resetAdminProductStatus: (state) => {
            state.isCreated = false;
            state.isUpdated = false;
            state.isDeleted = false;
            state.message = null;
            state.error = null;
        },
        clearAdminProductErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Admin Products
            .addCase(getAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.isCreated = true;
                state.products.unshift(action.payload.product);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = true;
                const index = state.products.findIndex((p) => p._id === action.payload.product._id);
                if (index !== -1) {
                    state.products[index] = action.payload.product;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = true;
                state.message = action.payload.message;
                state.products = state.products.filter((p) => p._id !== action.payload.id);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Reviews
            .addCase(getProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(getProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Review
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.filter((r) => r._id !== action.payload.reviewId);
                state.message = action.payload.message;
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetAdminProductStatus, clearAdminProductErrors } = adminProductSlice.actions;
export default adminProductSlice.reducer;