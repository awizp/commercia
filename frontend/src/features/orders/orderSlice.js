import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Create Order
export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            };
            const { data } = await axios.post("/api/v1/order/new", orderData, config);
            return data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || "Failed to place order"
            );
        }
    }
);

// Get All Orders for Current User
export const getMyOrders = createAsyncThunk(
    "order/getMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/v1/orders/user", { withCredentials: true });
            return data.orders;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || "Failed to load orders"
            );
        }
    }
);

// Get Single Order Details
export const getOrderDetails = createAsyncThunk(
    "order/getOrderDetails",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/order/${id}`, { withCredentials: true });
            return data.order;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || "Failed to load order details"
            );
        }
    }
);

// Cancel Order
export const cancelUserOrder = createAsyncThunk(
    "order/cancelUserOrder",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/order/${id}`, { withCredentials: true });
            return { id, message: data.message };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || "Failed to cancel order"
            );
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        loading: false,
        error: null,
        success: false,
        orders: [],
        order: null
    },
    reducers: {
        removeOrderErrors: (state) => {
            state.error = null;
        },
        removeOrderSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload.order;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get My Orders
        builder
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Order Details
        builder
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Cancel Order
        builder
            .addCase(cancelUserOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelUserOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter((o) => o._id !== action.payload.id);
                if (state.order?._id === action.payload.id) {
                    state.order = null;
                }
            })
            .addCase(cancelUserOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { removeOrderErrors, removeOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;