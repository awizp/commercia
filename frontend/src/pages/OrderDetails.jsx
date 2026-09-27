import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Phone, User, Calendar, CreditCard, ShieldCheck, ArrowLeft, ShoppingBag, Clock, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../components/ui";
import { Navbar, Footer } from "../components";
import { getOrderDetails, cancelUserOrder, removeOrderErrors } from "../features/orders/orderSlice.js";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { order, loading, error } = useSelector((state) => state.order || {});

    useEffect(() => {
        if (id) {
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(removeOrderErrors());
        }
    }, [error, dispatch]);

    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const res = await dispatch(cancelUserOrder(id)).unwrap();
            toast.success(res.message || "Order cancelled successfully", { position: "bottom-center" });
            navigate("/orders");
        } catch (err) {
            toast.error(err || "Failed to cancel order", { position: "bottom-center" });
        }
    };

    const isDelivered = order?.orderStatus?.toLowerCase() === "delivered";
    const formattedDate = order?.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
        : "";

    return (
        <>
            <ScrollToTop />
            <PageTitle title={`Order #${id?.slice(-6)} Details | Commercia`} />
            <Navbar />

            <main className="w-full min-h-screen bg-purple-50/80 pt-30 pb-20 px-4 sm:px-6">
                <div className="custom-container max-w-5xl mx-auto space-y-6">

                    {/* Top Bar with Back Link and Cancel Button */}
                    <div className="flex items-center justify-between pb-3 border-b border-purple-100/70">
                        <Link
                            to="/orders"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to My Orders</span>
                        </Link>

                        {!isDelivered && order && (
                            <button
                                type="button"
                                onClick={handleCancelOrder}
                                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
                            >
                                <Trash2 size={13} />
                                <span>Cancel Order</span>
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-3xl p-10 border border-purple-100/60 shadow-xs animate-pulse space-y-6">
                            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                            <div className="h-32 bg-slate-100 rounded-2xl w-full"></div>
                        </div>
                    ) : !order ? (
                        <div className="bg-white rounded-3xl p-12 text-center space-y-3">
                            <XCircle size={40} className="mx-auto text-slate-300" />
                            <h2 className="text-lg font-bold text-slate-800">Order not found</h2>
                            <Link to="/orders" className="text-xs font-semibold text-purple-600 hover:underline">
                                Return to Orders List
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                            {/* Left Column: Details & Items */}
                            <div className="lg:col-span-8 space-y-6">

                                {/* Order Status Banner */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                            Order ID: #{order._id}
                                        </p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                            <Calendar size={13} />
                                            Placed on {formattedDate}
                                        </p>
                                    </div>
                                    <div>
                                        {isDelivered ? (
                                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <CheckCircle2 size={14} />
                                                Delivered
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                <Clock size={14} />
                                                {order.orderStatus || "Processing"}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Delivery Address Card */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <MapPin size={17} className="text-purple-600" />
                                        <span>Shipping Address</span>
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                                <User size={15} />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-[10px] uppercase font-semibold">Recipient</p>
                                                <p className="font-semibold text-slate-800">{order.user?.name || "Customer"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                                <Phone size={15} />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-[10px] uppercase font-semibold">Contact</p>
                                                <p className="font-semibold text-slate-800">{order.shippingAddress?.phoneNo}</p>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2 text-slate-700 pt-1">
                                            <p className="font-medium leading-relaxed">
                                                {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}, {order.shippingAddress?.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items List */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <ShoppingBag size={17} className="text-purple-600" />
                                        <span>Items in this Order ({order.orderDetails?.length})</span>
                                    </h2>

                                    <div className="divide-y divide-slate-100">
                                        {order.orderDetails?.map((item, idx) => (
                                            <div key={idx} className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3.5 overflow-hidden">
                                                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
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
                                                            className="text-xs sm:text-sm font-bold text-slate-800 hover:text-purple-600 transition truncate block"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                        <p className="text-xs text-slate-500">
                                                            {item.quantity} × ${item.price}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="text-xs sm:text-sm font-bold text-slate-800 shrink-0">
                                                    ${(item.quantity * item.price).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Right Column: Payment & Price Summary */}
                            <div className="lg:col-span-4 space-y-6">

                                {/* Payment Status Box */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
                                    <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                                        Payment Information
                                    </h3>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Method</span>
                                            <span className="font-semibold text-slate-800 flex items-center gap-1">
                                                <CreditCard size={14} className="text-purple-600" />
                                                Razorpay Gateway
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Payment ID</span>
                                            <span className="font-mono text-[11px] text-slate-700 truncate max-w-37.5">
                                                {order.paymentInfo?.id}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Status</span>
                                            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                {order.paymentInfo?.status || "Paid"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Summary Box */}
                                <div className="bg-white rounded-3xl p-6 shadow-xl space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                                        Order Breakdown
                                    </h3>

                                    <div className="space-y-2.5 text-xs text-slate-600">
                                        <div className="flex justify-between">
                                            <span>Items Subtotal</span>
                                            <span className="font-semibold text-slate-800">${order.itemPrice?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Estimated Tax (18%)</span>
                                            <span className="font-semibold text-slate-800">${order.taxPrice?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping Charges</span>
                                            <span className="font-semibold text-slate-800">
                                                {order.shippingPrice === 0 ? "FREE" : `$${order.shippingPrice?.toFixed(2)}`}
                                            </span>
                                        </div>
                                        <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm font-bold text-slate-900">
                                            <span>Total Paid</span>
                                            <span className="text-lg font-extrabold text-purple-600">${order.totalPrice?.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                                        <ShieldCheck size={14} className="text-purple-600 shrink-0" />
                                        <span>Verified and encrypted payment</span>
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

export default OrderDetails;