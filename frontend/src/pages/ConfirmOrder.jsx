import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { MapPin, Phone, User, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../components/ui";
import { Navbar, Footer, CheckoutSteps } from "../components";

const ConfirmOrder = () => {
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.user);
    const { cartItems = [], shippingInfo = {} } = useSelector((state) => state.cart || {});

    // Redirect if shippingInfo is missing
    useEffect(() => {
        if (!shippingInfo?.address || !shippingInfo?.city || !shippingInfo?.phoneNo) {
            toast.error("Please fill in your shipping details first", { position: "bottom-center" });
            navigate("/shipping");
        }
        if (cartItems.length === 0) {
            toast.error("Your cart is empty", { position: "bottom-center" });
            navigate("/products");
        }
    }, [shippingInfo, cartItems, navigate]);

    // Financial calculations
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
    const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10.0;
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    const fullAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state || ""}, ${shippingInfo.pincode || shippingInfo.postalCode || ""}, ${shippingInfo.country || "India"}`;

    const handleProceedToPayment = () => {
        const orderData = {
            itemPrice: itemsPrice,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        };

        // Cache financial totals in sessionStorage for payment step
        sessionStorage.setItem("orderInfo", JSON.stringify(orderData));
        navigate("/payment");
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Confirm Order | Commercia" />
            <Navbar />

            <main className="w-full min-h-screen bg-purple-50/20 pt-30 pb-20 px-4 sm:px-6">
                <div className="custom-container max-w-7xl mx-auto space-y-6">

                    {/* Step Tracker */}
                    <CheckoutSteps shipping={true} confirmOrder={true} />

                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-purple-100/70">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Order Confirmation
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Please review your delivery details and items before proceeding to payment
                            </p>
                        </div>
                        <Link
                            to="/shipping"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
                        >
                            <ArrowLeft size={15} />
                            <span>Edit Address</span>
                        </Link>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Shipping Details + Cart Items */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Shipping Information Card */}
                            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100/70 shadow-sm space-y-4">
                                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <MapPin size={18} className="text-purple-600" />
                                    <span>Shipping Information</span>
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Recipient Name</p>
                                            <p className="font-semibold text-slate-800">{user?.name || "Customer"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Phone Number</p>
                                            <p className="font-semibold text-slate-800">{shippingInfo.phoneNo}</p>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 flex items-start gap-3 pt-1">
                                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Delivery Address</p>
                                            <p className="font-medium text-slate-700 leading-relaxed">{fullAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items Card */}
                            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100/70 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <ShoppingBag size={18} className="text-purple-600" />
                                        <span>Order Items ({cartItems.length})</span>
                                    </h2>
                                    <Link
                                        to="/cart"
                                        className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                                    >
                                        Modify Items
                                    </Link>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.product}
                                            className="py-4 first:pt-1 last:pb-1 flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                                                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 shrink-0">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover object-center"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <ShoppingBag size={20} />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-0.5 overflow-hidden">
                                                    <Link
                                                        to={`/product/${item.product}`}
                                                        className="font-bold text-slate-900 hover:text-purple-600 transition text-sm sm:text-base line-clamp-1"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-xs text-slate-500">
                                                        {item.quantity} × ${item.price}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <p className="text-sm sm:text-base font-bold text-slate-900">
                                                    ${(item.quantity * item.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Order Summary & Action */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100/70 shadow-xl space-y-6">
                                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span>Items Subtotal</span>
                                        <span className="font-semibold text-slate-900">${itemsPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span>Estimated Tax (18%)</span>
                                        <span className="font-semibold text-slate-900">${taxPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span>Shipping Charges</span>
                                        <span className="font-semibold text-slate-900">
                                            {shippingPrice === 0 ? (
                                                <span className="text-emerald-600 font-bold uppercase text-xs">Free</span>
                                            ) : (
                                                `$${shippingPrice.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>

                                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-base font-bold text-slate-900">
                                        <span>Grand Total</span>
                                        <span className="text-xl font-extrabold text-purple-600">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleProceedToPayment}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer"
                                >
                                    <span>Proceed to Payment</span>
                                    <ArrowRight size={16} />
                                </button>

                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <ShieldCheck size={15} className="text-purple-600 shrink-0" />
                                        <span>Bank-grade 256-bit SSL encryption</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Truck size={15} className="text-purple-600 shrink-0" />
                                        <span>Dispatched within 24-48 business hours</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
};

export default ConfirmOrder;