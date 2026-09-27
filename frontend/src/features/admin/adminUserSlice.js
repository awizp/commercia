import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosConfig = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true
};

// Get All Users (Admin)
export const getAdminUsers = createAsyncThunk(
    "adminUser/getAdminUsers",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/v1/admin/users", { withCredentials: true });
            return data.users;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to load users");
        }
    }
);

// Get Single User Details (Admin)
export const getAdminSingleUser = createAsyncThunk(
    "adminUser/getAdminSingleUser",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/admin/user/${id}`, { withCredentials: true });
            return data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to load user details");
        }
    }
);

// Update User Role
export const updateUserRole = createAsyncThunk(
    "adminUser/updateUserRole",
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/v1/admin/user/${id}`, { role }, axiosConfig);
            return data; // { message, user }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to update user role");
        }
    }
);

// Delete User
export const deleteUser = createAsyncThunk(
    "adminUser/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/user/${id}`, { withCredentials: true });
            return { id, message: data.message };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message || "Failed to delete user");
        }
    }
);

const adminUserSlice = createSlice({
    name: "adminUser",
    initialState: {
        users: [],
        user: null,
        loading: false,
        error: null,
        isUpdated: false,
        isDeleted: false,
        message: null
    },
    reducers: {
        resetAdminUserStatus: (state) => {
            state.isUpdated = false;
            state.isDeleted = false;
            state.message = null;
            state.error = null;
        },
        clearAdminUserErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Admin Users
            .addCase(getAdminUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getAdminUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Single User
            .addCase(getAdminSingleUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminSingleUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getAdminSingleUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Role
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = true;
                state.message = action.payload.message;
                const index = state.users.findIndex((u) => u._id === action.payload.user._id);
                if (index !== -1) {
                    state.users[index] = action.payload.user;
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = true;
                state.message = action.payload.message;
                state.users = state.users.filter((u) => u._id !== action.payload.id);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetAdminUserStatus, clearAdminUserErrors } = adminUserSlice.actions;
export default adminUserSlice.reducer;