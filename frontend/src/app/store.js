import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/users/userSlice.js";
import cartReducer from "../features/cart/cartSlice.js";
import orderReducer from "../features/orders/orderSlice.js";
import productReducer from "../features/products/productSlice.js";
import reviewReducer from "../features/products/reviewSlice.js";
import adminProductReducer from "../features/admin/adminProductSlice.js";
import adminOrderReducer from "../features/admin/adminOrderSlice.js";
import adminUserReducer from "../features/admin/adminUserSlice.js";

export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        order: orderReducer,
        products: productReducer,
        adminProduct: adminProductReducer,
        adminOrder: adminOrderReducer,
        adminUser: adminUserReducer,
        review: reviewReducer
    }
});