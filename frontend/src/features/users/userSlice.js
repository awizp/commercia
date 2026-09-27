import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosConfig = {
    withCredentials: true
};

const getErrorMessage = (err) => {
    return (
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        err.message ||
        "An unexpected error occurred. Please try again."
    );
};

const storedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

const storedIsAuth = localStorage.getItem("isAuthenticated") === "true";

// Register action
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (formData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            };
            const { data } = await axios.post("/api/v1/register", formData, config);
            return data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Login action
export const loginUser = createAsyncThunk(
    "user/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            };
            const { data } = await axios.post("/api/v1/login", { email, password }, config);
            return data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Load User action
export const loadUser = createAsyncThunk(
    "user/loadUser",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/v1/profile", axiosConfig);
            return data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Logout action
export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/v1/logout", axiosConfig);
            return data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Update user profile action
export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async (userData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            };
            const { data } = await axios.put("/api/v1/update/profile", userData, config);
            return data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Update password action
export const updatePassword = createAsyncThunk(
    "user/updatePassword",
    async (passwords, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            };
            const { data } = await axios.put("/api/v1/update/password", passwords, config);
            return data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Forgot Password action
export const forgotPassword = createAsyncThunk(
    "user/forgotPassword",
    async ({ email }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" }
            };
            const { data } = await axios.post("/api/v1/password/forget", { email }, config);
            return data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// Reset Password action
export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ token, passwords }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" }
            };
            const { data } = await axios.post(`/api/v1/reset/${token}`, passwords, config);
            return data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: storedUser,
        isAuthenticated: storedIsAuth,
        loading: false,
        error: null,
        success: false,
        message: null
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
        },
        removeMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("isAuthenticated", "true");
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            });

        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("isAuthenticated", "true");
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            });

        // Load User
        builder
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("isAuthenticated", "true");
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem("user");
                localStorage.removeItem("isAuthenticated");
            });

        // Logout
        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                state.success = false;
                localStorage.removeItem("user");
                localStorage.removeItem("isAuthenticated");
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update Profile
        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // update password
        builder
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (action.payload?.user) {
                    state.user = action.payload.user;
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                }
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Forgot Password
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Reset link sent to your email";
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Reset Password
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Password changed successfully!";
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { removeErrors, removeSuccess, removeMessage } = userSlice.actions;
export default userSlice.reducer;