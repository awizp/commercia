import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ArrowLeft, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../components/ui";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { updateCartQuantity, removeCartItem, clearCart } from "../features/cart/cartSlice.js";

const Cart = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.user);

    // Quantity Handlers
    const handleIncrease = (item) => {
        if (item.quantity >= item.stock) {
            toast.error("Cannot exceed available stock limit", { position: "bottom-center" });
            return;
        }
        dispatch(updateCartQuantity({ id: item.product, quantity: item.quantity + 1 }));
    };

    const handleDecrease = (item) => {
        if (item.quantity <= 1) {
            toast.error("Minimum quantity is 1. Click the trash icon to remove item.", { position: "bottom-center" });
            return;
        }
        dispatch(updateCartQuantity({ id: item.product, quantity: item.quantity - 1 }));
    };

    const handleRemove = (id, name) => {
        dispatch(removeCartItem(id));
        toast.success(`Removed ${name} from cart`, { position: "bottom-center" });
    };

    const handleClearCart = () => {
        dispatch(clearCart());
        toast.success("Cart cleared", { position: "bottom-center" });
    };

    // Price Calculations
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = Number((subtotal * 0.18).toFixed(2));
    const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10.0;
    const total = Number((subtotal + tax + shipping).toFixed(2));

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate("/login?redirect=shipping");
        } else {
            navigate("/shipping");
        }
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Shopping Cart | Commercia" />
            <Navbar />

            <main className="w-full min-h-screen bg-purple-50/20 pt-28 pb-20 px-4 sm:px-6">
                <div className="custom-container max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-purple-100/70">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Shopping Cart
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                {cartItems.length} {cartItems.length === 1 ? "unique item" : "unique items"} in your bag
                            </p>
                        </div>

                        {cartItems.length > 0 && (
                            <button
                                type="button"
                                onClick={handleClearCart}
                                className="w-fit inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 py-1.5 px-3 rounded-xl transition cursor-pointer"
                            >
                                <RotateCcw size={14} />
                                <span>Clear Cart</span>
                            </button>
                        )}
                    </div>

                    {/* Empty State */}
                    {cartItems.length === 0 ? (
                        <div className="w-full py-20 px-4 bg-white rounded-3xl border border-purple-100/70 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                                <ShoppingBag size={36} />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-slate-800">Your bag is currently empty</h2>
                                <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                                    Explore our latest collection, add your favorite items, and come back here to checkout.
                                </p>
                            </div>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 mt-2 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer"
                            >
                                <span>Explore Products</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        /* Cart Grid with Items + Summary */
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                            {/* Items List */}
                            <div className="lg:col-span-8 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.product}
                                        className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition hover:shadow-md"
                                    >
                                        {/* Product Info */}
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 shrink-0">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover object-center"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <ShoppingBag size={24} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1 overflow-hidden">
                                                <Link
                                                    to={`/product/${item.product}`}
                                                    className="font-bold text-slate-900 hover:text-purple-600 transition text-sm sm:text-base line-clamp-1"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    Unit Price: <span className="text-slate-800 font-bold">${item.price}</span>
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    Stock: {item.stock} units
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quantity & Pricing Controls */}
                                        <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                            {/* Quantity Pill */}
                                            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/70 p-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrease(item)}
                                                    className="p-1.5 text-slate-600 hover:text-purple-600 transition cursor-pointer"
                                                >
                                                    <Minus size={15} />
                                                </button>
                                                <span className="w-9 text-center text-xs sm:text-sm font-bold text-slate-800 select-none">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrease(item)}
                                                    className="p-1.5 text-slate-600 hover:text-purple-600 transition cursor-pointer"
                                                >
                                                    <Plus size={15} />
                                                </button>
                                            </div>

                                            {/* Line Total */}
                                            <div className="text-right min-w-20">
                                                <p className="text-base font-extrabold text-purple-600">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(item.product, item.name)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                                                title="Remove item"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Continue Shopping Link */}
                                <div className="pt-2">
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition"
                                    >
                                        <ArrowLeft size={14} />
                                        <span>Continue Shopping</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100/70 shadow-xl space-y-6">
                                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Est. Tax (18%)</span>
                                            <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Estimated Shipping</span>
                                            <span className="font-semibold text-slate-900">
                                                {shipping === 0 ? (
                                                    <span className="text-emerald-600 font-bold uppercase text-xs">Free</span>
                                                ) : (
                                                    `$${shipping.toFixed(2)}`
                                                )}
                                            </span>
                                        </div>

                                        {shipping > 0 && (
                                            <p className="text-[11px] text-purple-600 bg-purple-50 p-2 rounded-lg">
                                                Add ${(100 - subtotal).toFixed(2)} more to unlock free shipping!
                                            </p>
                                        )}

                                        <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-base font-bold text-slate-900">
                                            <span>Order Total</span>
                                            <span className="text-xl font-extrabold text-purple-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        type="button"
                                        onClick={handleCheckout}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer"
                                    >
                                        <span>Proceed to Checkout</span>
                                        <ArrowRight size={16} />
                                    </button>

                                    {/* Guarantees */}
                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <ShieldCheck size={15} className="text-purple-600 shrink-0" />
                                            <span>Secure encrypted 256-bit payment</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Truck size={15} className="text-purple-600 shrink-0" />
                                            <span>Free shipping on all orders over $100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </>
    );
};

export default Cart;