import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to extract image URL safely
const extractImageUrl = (product) => {
    if (!product) return "";
    if (Array.isArray(product.image) && product.image.length > 0) {
        return typeof product.image[0] === "string" ? product.image[0] : (product.image[0]?.url || "");
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
        return typeof product.images[0] === "string" ? product.images[0] : (product.images[0]?.url || "");
    }
    if (typeof product.image === "string") return product.image;
    if (product.image?.url) return product.image.url;
    return "";
};

const storedCartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];

const storedShippingInfo = localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {};

export const addCartItem = createAsyncThunk(
    "cart/addCartItem",
    async ({ id, quantity }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/product/${id}`);
            const product = data.product;

            return {
                product: product._id,
                name: product.name,
                price: product.price,
                image: extractImageUrl(product),
                stock: product.stock,
                quantity
            };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || err.message || "Failed to add item to cart"
            );
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: storedCartItems,
        shippingInfo: storedShippingInfo,
        loading: false,
        error: null,
        success: false,
        message: null
    },
    reducers: {
        updateCartQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find((i) => i.product === id);
            if (item) {
                item.quantity = quantity;
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            }
        },
        removeCartItem: (state, action) => {
            state.cartItems = state.cartItems.filter((i) => i.product !== action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
        },
        // Save delivery shipping information
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
        },
        removeCartErrors: (state) => {
            state.error = null;
        },
        removeCartSuccess: (state) => {
            state.success = false;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const item = action.payload;
                const isItemExist = state.cartItems.find((i) => i.product === item.product);

                if (isItemExist) {
                    state.cartItems = state.cartItems.map((i) =>
                        i.product === isItemExist.product ? item : i
                    );
                    state.message = `Updated ${item.name} quantity in cart`;
                } else {
                    state.cartItems.push(item);
                    state.message = `Added ${item.name} to cart`;
                }
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            })
            .addCase(addCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { updateCartQuantity, removeCartItem, clearCart, saveShippingInfo, removeCartErrors, removeCartSuccess } = cartSlice.actions;

export default cartSlice.reducer;