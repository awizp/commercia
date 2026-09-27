import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const getErrorMessage = (err) => {
    return (
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        err.message ||
        "Something went wrong.."
    );
};

// Get products with search, pagination, category & price range parameters
export const getProduct = createAsyncThunk(
    "product/getProduct",
    async (
        { keyword = "", page = 1, category = "All", minPrice, maxPrice } = {},
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams();
            if (keyword) params.set("keyword", keyword);
            if (page > 1) params.set("page", page);
            if (category && category !== "All") params.set("category", category);
            if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
                params.set("minPrice", Number(minPrice));
            }
            if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
                params.set("maxPrice", Number(maxPrice));
            }

            const queryParamString = params.toString();
            const link = `/api/v1/products${queryParamString ? `?${queryParamString}` : ""}`;
            const { data } = await axios.get(link);
            return data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Get product details
export const getProductDetails = createAsyncThunk(
    "product/getProductDetails",
    async (id, { rejectWithValue }) => {
        try {
            const link = `/api/v1/product/${id}`;
            const { data } = await axios.get(link);
            return data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        productCount: 0,
        categories: [],
        loading: false,
        error: null,
        product: null,
        resultPerPage: 6,
        totalPages: 0
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Get all products builder
        builder
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.products = action.payload.products || [];
                state.productCount = action.payload.productCount || 0;
                state.categories = action.payload.categories || [];
                state.totalPages = action.payload.totalPages || 1;
                state.resultPerPage = action.payload.resultPerPage || 6;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.products = [];
                state.error = action.payload;
            });

        // Get single product builder
        builder
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.product = action.payload.product;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;