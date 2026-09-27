import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag, Eye, Trash2, Search, AlertCircle, Loader2, Clock, CheckCircle2, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../../components/ui";
import { Navbar, Footer } from "../../components";
import { Sidebar } from "../../components/admin";
import { getAdminOrders, deleteAdminOrder, resetAdminOrderStatus, clearAdminOrderErrors } from "../../features/admin/adminOrderSlice.js";

const OrderList = () => {
    const dispatch = useDispatch();

    const {
        orders = [],
        totalAmount = 0,
        loading,
        error,
        isDeleted,
        message
    } = useSelector((state) => state.adminOrder);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        dispatch(getAdminOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(clearAdminOrderErrors());
        }

        if (isDeleted) {
            toast.success(message || "Order deleted successfully", { position: "bottom-center" });
            dispatch(resetAdminOrderStatus());
        }
    }, [error, isDeleted, message, dispatch]);

    const handleDeleteOrder = (id, status) => {
        if (status !== "Delivered") {
            toast.error("Only delivered orders can be deleted from records", { position: "bottom-center" });
            return;
        }

        if (window.confirm("Are you sure you want to delete this completed order record?")) {
            dispatch(deleteAdminOrder(id));
        }
    };

    const getStatusPill = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 size={12} />
                        Delivered
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                        <Clock size={12} />
                        {status || "Processing"}
                    </span>
                );
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || order.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Orders Management | Commercia Admin" />
            <Navbar />

            <div className="w-full min-h-screen bg-purple-50/20 pt-28 pb-16 flex flex-col">
                <div className="custom-container max-w-7xl mx-auto flex-1 flex flex-col md:flex-row gap-6 px-4 sm:px-6">

                    {/* Responsive Admin Sidebar */}
                    <div className="w-full md:w-auto shrink-0 md:sticky md:top-28 md:self-start md:rounded-3xl md:overflow-hidden md:border md:border-purple-100/70 md:shadow-sm md:bg-white">
                        <Sidebar />
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 space-y-6 overflow-hidden">

                        {/* Top Header Card */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100/70 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    Customer Orders
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                    Monitor incoming purchases, track shipments, and dispatch packages
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 rounded-2xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center gap-2">
                                    <DollarSign size={16} />
                                    <span className="text-xs font-bold">
                                        Gross Revenue: ${Number(totalAmount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Filter & Search Bar */}
                        <div className="bg-white rounded-2xl p-4 border border-purple-100/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by order ID, buyer name, or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                />
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-purple-600 transition capitalize cursor-pointer"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="processing">Processing</option>
                                    <option value="delivered">Delivered</option>
                                </select>

                                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                                    Showing: <strong className="text-purple-600 font-bold">{filteredOrders.length}</strong> of {orders.length}
                                </span>
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div className="bg-white rounded-3xl border border-purple-100/70 shadow-sm overflow-hidden">
                            {loading && orders.length === 0 ? (
                                <div className="py-24 flex flex-col items-center justify-center gap-3">
                                    <Loader2 size={32} className="animate-spin text-purple-600" />
                                    <p className="text-xs font-semibold text-slate-400">Loading orders...</p>
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="py-20 px-4 text-center space-y-3">
                                    <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto">
                                        <AlertCircle size={26} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-slate-800">No matching orders found</h3>
                                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                            There are no customer orders matching your search or filter options.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                        <thead>
                                            <tr className="bg-purple-50/60 text-slate-500 text-[11px] uppercase tracking-wider border-b border-purple-100/70">
                                                <th className="py-3.5 px-4 font-bold">Order ID</th>
                                                <th className="py-3.5 px-4 font-bold">Customer</th>
                                                <th className="py-3.5 px-4 font-bold">Status</th>
                                                <th className="py-3.5 px-4 font-bold">Items</th>
                                                <th className="py-3.5 px-4 font-bold">Total Amount</th>
                                                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredOrders.map((order) => {
                                                const totalItems = order.orderDetails?.reduce(
                                                    (sum, item) => sum + (item.quantity || 1),
                                                    0
                                                ) || 0;

                                                const isDelivered = order.orderStatus === "Delivered";

                                                return (
                                                    <tr key={order._id} className="hover:bg-purple-50/20 transition">
                                                        {/* Order ID */}
                                                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                                                            #{order._id.slice(-8).toUpperCase()}
                                                        </td>

                                                        {/* Customer */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="space-y-0.5">
                                                                <p className="font-bold text-slate-800">
                                                                    {order.user?.name || "Customer"}
                                                                </p>
                                                                <p className="text-[11px] text-slate-400">
                                                                    {order.user?.email || "No email"}
                                                                </p>
                                                            </div>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="py-3.5 px-4">
                                                            {getStatusPill(order.orderStatus)}
                                                        </td>

                                                        {/* Items count */}
                                                        <td className="py-3.5 px-4 text-slate-600 font-semibold">
                                                            {totalItems} item{totalItems !== 1 ? "s" : ""}
                                                        </td>

                                                        {/* Price */}
                                                        <td className="py-3.5 px-4 font-extrabold text-purple-700">
                                                            ${Number(order.totalPrice || 0).toFixed(2)}
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="py-3.5 px-4 text-right">
                                                            <div className="inline-flex items-center gap-1.5">
                                                                <Link
                                                                    to={`/admin/order/${order._id}`}
                                                                    className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                                                                    title="Process & Update Order"
                                                                >
                                                                    <Eye size={16} />
                                                                </Link>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteOrder(order._id, order.orderStatus)}
                                                                    disabled={!isDelivered}
                                                                    className={`p-2 rounded-xl transition ${isDelivered
                                                                        ? "text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                                                        : "text-slate-200 cursor-not-allowed"
                                                                        }`}
                                                                    title={
                                                                        isDelivered
                                                                            ? "Delete Order"
                                                                            : "Cannot delete processing orders"
                                                                    }
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </main>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default OrderList;