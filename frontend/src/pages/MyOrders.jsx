import { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Package, ArrowRight, Clock, CheckCircle2, ShoppingBag, Eye, Calendar, MapPin } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../components/ui";
import { Navbar, Footer } from "../components";
import { getMyOrders, removeOrderErrors } from "../features/orders/orderSlice.js";

const MyOrders = () => {
    const dispatch = useDispatch();
    const { orders = [], loading, error } = useSelector((state) => state.order || {});

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(removeOrderErrors());
        }
    }, [error, dispatch]);

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 size={13} />
                        Delivered
                    </span>
                );
            case "cancelled":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/60">
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                        <Clock size={13} />
                        {status || "Processing"}
                    </span>
                );
        }
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="My Orders | Commercia" />
            <Navbar />

            <main className="w-full min-h-screen bg-purple-50/80 pt-30 pb-20 px-4 sm:px-6">
                <div className="custom-container max-w-6xl mx-auto space-y-6">

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-purple-100/70">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                My Orders
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Track, review, and manage your past and active orders
                            </p>
                        </div>
                        <span className="w-fit text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/60 px-3 py-1.5 rounded-xl">
                            Total Orders: {orders.length}
                        </span>
                    </div>

                    {/* Loading Skeleton */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="bg-white rounded-3xl p-6 border border-purple-100/60 shadow-xs animate-pulse space-y-4">
                                    <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
                                    <div className="h-16 bg-slate-100 rounded-2xl w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        /* Empty State */
                        <div className="w-full py-20 px-4 bg-white rounded-3xl shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                                <Package size={36} />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-slate-800">No orders found</h2>
                                <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                                    You have not placed any orders yet. Discover our tech collection and place your first order.
                                </p>
                            </div>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 mt-2 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer"
                            >
                                <span>Browse Products</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        /* Order Cards List */
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const formattedDate = order.createdAt
                                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric"
                                    })
                                    : "Recently";

                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md transition space-y-5"
                                    >
                                        {/* Card Top Row */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-xs uppercase font-bold text-purple-600 tracking-wider">
                                                        Order #{order._id.slice(-8).toUpperCase()}
                                                    </span>
                                                    {getStatusBadge(order.orderStatus)}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={13} />
                                                        {formattedDate}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={13} />
                                                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Link to Details */}
                                            <Link
                                                to={`/order/${order._id}`}
                                                className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition cursor-pointer w-full sm:w-auto"
                                            >
                                                <Eye size={14} />
                                                <span>View Order Details</span>
                                            </Link>
                                        </div>

                                        {/* Items Preview */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {order.orderDetails?.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100"
                                                >
                                                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-200/70 overflow-hidden shrink-0">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <ShoppingBag size={18} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="overflow-hidden space-y-0.5">
                                                        <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Qty: <span className="font-semibold text-slate-700">{item.quantity}</span> × ${item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Card Footer: Summary */}
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs sm:text-sm">
                                            <span className="text-slate-500">
                                                Paid via Razorpay ({order.paymentInfo?.status || "Paid"})
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-slate-500 font-medium">Total Paid:</span>
                                                <span className="text-base sm:text-lg font-extrabold text-purple-600">
                                                    ${order.totalPrice?.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </>
    );
};

export default MyOrders;