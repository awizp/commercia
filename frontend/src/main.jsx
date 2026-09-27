import axios from "axios";
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { Provider } from "react-redux";

import { About, Contact, ConfirmOrder, Details, Home, Products, Register, Login, Profile, UpdateProfile, ProtectedRoute, UpdatePassword, ForgetPassword, ResetPassword, Cart, Shipping, Payment, OrderSuccess, MyOrders, OrderDetails } from "./pages";
import { Dashboard, ProductList, OrderList, NewProduct, UpdateProduct, ProcessOrder, UserList, ProductReviews } from './pages/admin';
import { store } from './app/store.js';

import './index.css';
import App from './App.jsx';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<Details />} />
      <Route path="/cart" element={<Cart />} />

      {/* auth routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/password/forget" element={<ForgetPassword />} />
      <Route path="/reset/:token" element={<ResetPassword />} />

      {/* protected routes */}
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="/profile/update" element={<ProtectedRoute element={<UpdateProfile />} />} />
      <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword />} />} />
      <Route path="/shipping" element={<ProtectedRoute element={<Shipping />} />} />
      <Route path="/order/confirm" element={<ProtectedRoute element={<ConfirmOrder />} />} />

      {/* payment routes */}
      <Route path="/payment" element={<ProtectedRoute element={<Payment />} />} />
      <Route path="/order/success" element={<ProtectedRoute element={<OrderSuccess />} />} />
      <Route path="/orders" element={<ProtectedRoute element={<MyOrders />} />} />
      <Route path="/order/:id" element={<ProtectedRoute element={<OrderDetails />} />} />

      {/* admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true} element={<Dashboard />} />} />
      <Route path="/admin/products" element={<ProtectedRoute isAdmin={true} element={<ProductList />} />} />
      <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true} element={<OrderList />} />} />
      <Route path="/admin/product/new" element={<ProtectedRoute isAdmin={true} element={<NewProduct />} />} />
      <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true} element={<UpdateProduct />} />} />
      <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true} element={<ProcessOrder />} />} />
      <Route path="/admin/users" element={<ProtectedRoute isAdmin={true} element={<UserList />} />} />
      <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true} element={<ProductReviews />} />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
