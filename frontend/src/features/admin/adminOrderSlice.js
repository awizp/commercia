import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosConfig = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true
};

// Get All Orders (Admin)
export const getAdminOrders = createAsyncThunk(
    "adminOrder/getAdminOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/v1/admin/orders", { withCredentials: true });
            return data; // { orders, totalAmount }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to load orders");
        }
    }
);

// Update Order Status
export const updateOrderStatus = createAsyncThunk(
    "adminOrder/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/v1/admin/order/${id}`, { status }, axiosConfig);
            return data; // { message, order }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to update order status");
        }
    }
);

// Delete Order
export const deleteAdminOrder = createAsyncThunk(
    "adminOrder/deleteAdminOrder",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/order/${id}`, { withCredentials: true });
            return { id, message: data.message };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to delete order");
        }
    }
);

const adminOrderSlice = createSlice({
    name: "adminOrder",
    initialState: {
        orders: [],
        totalAmount: 0,
        loading: false,
        error: null,
        isUpdated: false,
        isDeleted: false,
        message: null
    },
    reducers: {
        resetAdminOrderStatus: (state) => {
            state.isUpdated = false;
            state.isDeleted = false;
            state.message = null;
            state.error = null;
        },
        clearAdminOrderErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Admin Orders
            .addCase(getAdminOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(getAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Order Status
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = true;
                state.message = action.payload.message;
                const index = state.orders.findIndex((o) => o._id === action.payload.order._id);
                if (index !== -1) {
                    state.orders[index] = action.payload.order;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Order
            .addCase(deleteAdminOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAdminOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = true;
                state.message = action.payload.message;
                state.orders = state.orders.filter((o) => o._id !== action.payload.id);
            })
            .addCase(deleteAdminOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetAdminOrderStatus, clearAdminOrderErrors } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;