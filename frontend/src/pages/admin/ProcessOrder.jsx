import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Clock, CheckCircle2, User, Phone, MapPin, CreditCard, ShoppingBag, Loader2, Save, Trash2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../../components/ui";
import { Navbar, Footer } from "../../components";
import { Sidebar } from "../../components/admin";
import { getOrderDetails, removeOrderErrors } from "../../features/orders/orderSlice.js";
import { updateOrderStatus, deleteAdminOrder, resetAdminOrderStatus, clearAdminOrderErrors } from "../../features/admin/adminOrderSlice.js";

const ProcessOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { order, loading: orderLoading, error: orderError } = useSelector((state) => state.order || {});
    const { loading: updateLoading, isUpdated, isDeleted, message, error: adminError } = useSelector((state) => state.adminOrder);

    const [status, setStatus] = useState("");

    // Fetch order details on load
    useEffect(() => {
        if (id) {
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, id]);

    // Set initial status dropdown value once order loads
    useEffect(() => {
        const orderHandle = () => setStatus(order.orderStatus);

        if (order?.orderStatus) {
            orderHandle();
        }
    }, [order]);

    // Handle toast messages and state resets
    useEffect(() => {
        if (orderError) {
            toast.error(orderError, { position: "bottom-center" });
            dispatch(removeOrderErrors());
        }

        if (adminError) {
            toast.error(adminError, { position: "bottom-center" });
            dispatch(clearAdminOrderErrors());
        }

        if (isUpdated) {
            toast.success(message || "Order status updated successfully", { position: "bottom-center" });
            dispatch(resetAdminOrderStatus());
            dispatch(getOrderDetails(id)); // Refresh updated state
        }

        if (isDeleted) {
            toast.success(message || "Order deleted successfully", { position: "bottom-center" });
            dispatch(resetAdminOrderStatus());
            navigate("/admin/orders");
        }
    }, [orderError, adminError, isUpdated, isDeleted, message, dispatch, id, navigate]);

    const handleUpdateStatus = (e) => {
        e.preventDefault();

        if (!status) {
            toast.error("Please select a status", { position: "bottom-center" });
            return;
        }

        dispatch(updateOrderStatus({ id, status }));
    };

    const handleDelete = () => {
        if (order?.orderStatus !== "Delivered") {
            toast.error("Only delivered orders can be deleted", { position: "bottom-center" });
            return;
        }

        if (window.confirm("Are you sure you want to permanently delete this delivered order?")) {
            dispatch(deleteAdminOrder(id));
        }
    };

    const isDelivered = order?.orderStatus === "Delivered";

    return (
        <>
            <ScrollToTop />
            <PageTitle title={`Process Order #${id?.slice(-8).toUpperCase()} | Commercia Admin`} />
            <Navbar />

            <div className="w-full min-h-screen bg-purple-50/20 pt-28 pb-16 flex flex-col">
                <div className="custom-container max-w-7xl mx-auto flex-1 flex flex-col md:flex-row gap-6 px-4 sm:px-6">

                    {/* Responsive Admin Sidebar */}
                    <div className="w-full md:w-auto shrink-0 md:sticky md:top-28 md:self-start md:rounded-3xl md:overflow-hidden md:border md:border-purple-100/70 md:shadow-sm md:bg-white">
                        <Sidebar />
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 space-y-6">

                        {/* Header Box */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100/70 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs uppercase font-bold text-purple-600 tracking-wider">
                                        Order #{id?.slice(-8).toUpperCase()}
                                    </span>
                                    {isDelivered ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <CheckCircle2 size={11} /> Delivered
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                            <Clock size={11} /> {order?.orderStatus || "Processing"}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                                    Process & Fulfill Order
                                </h1>
                            </div>

                            <div className="flex items-center gap-3">
                                {isDelivered && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
                                    >
                                        <Trash2 size={14} />
                                        <span>Delete Record</span>
                                    </button>
                                )}

                                <Link
                                    to="/admin/orders"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
                                >
                                    <ArrowLeft size={16} />
                                    <span>Back to Orders</span>
                                </Link>
                            </div>
                        </div>

                        {orderLoading || !order ? (
                            <div className="py-24 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-purple-100/70 shadow-sm">
                                <Loader2 size={32} className="animate-spin text-purple-600" />
                                <p className="text-xs font-semibold text-slate-400">Loading order details...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                                {/* Left Column: Buyer details & Items */}
                                <div className="lg:col-span-8 space-y-6">

                                    {/* Shipping Address */}
                                    <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm space-y-4">
                                        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <MapPin size={17} className="text-purple-600" />
                                            <span>Customer & Shipping Details</span>
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                                    <User size={15} />
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-[10px] uppercase font-bold">Recipient</p>
                                                    <p className="font-bold text-slate-800">{order.user?.name || "Customer"}</p>
                                                    <p className="text-slate-500 text-[11px]">{order.user?.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                                    <Phone size={15} />
                                                </div>
                                                <div>
                                                    <p className="text-slate-400 text-[10px] uppercase font-bold">Contact Number</p>
                                                    <p className="font-bold text-slate-800">{order.shippingAddress?.phoneNo}</p>
                                                </div>
                                            </div>

                                            <div className="sm:col-span-2 text-slate-700 pt-1">
                                                <p className="text-slate-400 text-[10px] uppercase font-bold mb-0.5">Address</p>
                                                <p className="font-medium leading-relaxed">
                                                    {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}, {order.shippingAddress?.country}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Line Items */}
                                    <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm space-y-4">
                                        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                            <ShoppingBag size={17} className="text-purple-600" />
                                            <span>Purchased Line Items ({order.orderDetails?.length})</span>
                                        </h2>

                                        <div className="divide-y divide-slate-100">
                                            {order.orderDetails?.map((item, idx) => (
                                                <div key={idx} className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3.5 overflow-hidden">
                                                        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                                            {item.image ? (
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <ShoppingBag size={18} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-0.5 overflow-hidden">
                                                            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                Qty: <span className="font-semibold text-slate-700">{item.quantity}</span> × ${Number(item.price).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 shrink-0">
                                                        ${(item.quantity * item.price).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column: Status Update & Financials */}
                                <div className="lg:col-span-4 space-y-6">

                                    {/* Status Updater Card */}
                                    <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm space-y-4">
                                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                                            Update Fulfillment Status
                                        </h3>

                                        {isDelivered ? (
                                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
                                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                                                <span>This order is completed and delivered. Inventory has been adjusted.</span>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleUpdateStatus} className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                                        Order Status
                                                    </label>
                                                    <select
                                                        value={status}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition cursor-pointer"
                                                    >
                                                        <option value="Processing">Processing</option>
                                                        <option value="Delivered">Delivered</option>
                                                    </select>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={updateLoading || status === order.orderStatus}
                                                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer disabled:cursor-not-allowed"
                                                >
                                                    {updateLoading ? (
                                                        <>
                                                            <Loader2 size={16} className="animate-spin" />
                                                            <span>Saving Status...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save size={16} />
                                                            <span>Confirm & Update Status</span>
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    {/* Payment & Summary */}
                                    <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm space-y-4">
                                        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                                            Payment Info
                                        </h3>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between items-center text-slate-600">
                                                <span>Method</span>
                                                <span className="font-semibold text-slate-800 flex items-center gap-1">
                                                    <CreditCard size={14} className="text-purple-600" />
                                                    Razorpay
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-slate-600">
                                                <span>Payment ID</span>
                                                <span className="font-mono text-[11px] text-slate-700 truncate max-w-35">
                                                    {order.paymentInfo?.id}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-slate-600">
                                                <span>Payment Status</span>
                                                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                    {order.paymentInfo?.status || "Paid"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                                            <div className="flex justify-between">
                                                <span>Items Price</span>
                                                <span className="font-semibold text-slate-800">${Number(order.itemPrice || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Tax</span>
                                                <span className="font-semibold text-slate-800">${Number(order.taxPrice || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Shipping</span>
                                                <span className="font-semibold text-slate-800">
                                                    {order.shippingPrice === 0 ? "FREE" : `$${Number(order.shippingPrice).toFixed(2)}`}
                                                </span>
                                            </div>
                                            <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-sm font-bold text-slate-900">
                                                <span>Total Amount</span>
                                                <span className="text-base font-extrabold text-purple-700">
                                                    ${Number(order.totalPrice || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                                            <ShieldCheck size={14} className="text-purple-600 shrink-0" />
                                            <span>Authenticated transaction</span>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        )}

                    </main>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default ProcessOrder;