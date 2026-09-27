import { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { DollarSign, Package, ShoppingBag, Users, AlertTriangle, ArrowRight, Loader2, CheckCircle2, Clock } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../../components/ui";
import { Navbar, Footer } from "../../components";
import { Sidebar } from "../../components/admin";
import { getAdminProducts, clearAdminProductErrors } from "../../features/admin/adminProductSlice.js";
import { getAdminOrders, clearAdminOrderErrors } from "../../features/admin/adminOrderSlice.js";
import { getAdminUsers, clearAdminUserErrors } from "../../features/admin/adminUserSlice.js";

const Dashboard = () => {
    const dispatch = useDispatch();

    const { products = [], loading: productsLoading, error: productsError } = useSelector((state) => state.adminProduct);
    const { orders = [], totalAmount = 0, loading: ordersLoading, error: ordersError } = useSelector((state) => state.adminOrder);
    const { users = [], loading: usersLoading, error: usersError } = useSelector((state) => state.adminUser);

    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(getAdminOrders());
        dispatch(getAdminUsers());
    }, [dispatch]);

    // Handle error toasts
    useEffect(() => {
        if (productsError) {
            toast.error(productsError, { position: "bottom-center" });
            dispatch(clearAdminProductErrors());
        }
        if (ordersError) {
            toast.error(ordersError, { position: "bottom-center" });
            dispatch(clearAdminOrderErrors());
        }
        if (usersError) {
            toast.error(usersError, { position: "bottom-center" });
            dispatch(clearAdminUserErrors());
        }
    }, [productsError, ordersError, usersError, dispatch]);

    const isLoading = productsLoading || ordersLoading || usersLoading;

    // Calculations
    const outOfStockCount = products.filter((p) => Number(p.stock || 0) <= 0).length;
    const inStockCount = products.length - outOfStockCount;

    const deliveredOrders = orders.filter((o) => o.orderStatus === "Delivered").length;
    const processingOrders = orders.length - deliveredOrders;

    const cards = [
        {
            label: "Total Revenue",
            value: `$${(totalAmount || 0).toFixed(2)}`,
            icon: DollarSign,
            bg: "bg-purple-600 text-white",
            hint: "Gross sales calculated from all orders"
        },
        {
            label: "Total Products",
            value: products.length,
            icon: Package,
            bg: "bg-white text-purple-600",
            sub: `${inStockCount} In Stock · ${outOfStockCount} Out`,
            link: "/admin/products"
        },
        {
            label: "Total Orders",
            value: orders.length,
            icon: ShoppingBag,
            bg: "bg-white text-purple-600",
            sub: `${processingOrders} Processing · ${deliveredOrders} Delivered`,
            link: "/admin/orders"
        },
        {
            label: "Total Users",
            value: users.length,
            icon: Users,
            bg: "bg-white text-purple-600",
            sub: `${users.filter((u) => u.role === "admin").length} Admins · ${users.filter((u) => u.role !== "admin").length} Customers`,
            link: "/admin/users"
        }
    ];

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Admin Dashboard | Commercia" />
            <Navbar />

            <div className="w-full min-h-screen bg-purple-50/20 pt-28 pb-16 flex flex-col">
                <div className="custom-container max-w-7xl mx-auto flex-1 flex flex-col md:flex-row gap-6 px-4 sm:px-6">

                    {/* Left Sticky Sidebar */}
                    <div className="rounded-3xl overflow-hidden border border-purple-100/70 shadow-sm bg-white shrink-0 self-start md:sticky md:top-28">
                        <Sidebar />
                    </div>

                    {/* Right Main Content */}
                    <main className="flex-1 space-y-6">

                        {/* Header Box */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100/70 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    Store Overview
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                    Real-time performance summary of your inventory, revenue, and customer base
                                </p>
                            </div>
                        </div>

                        {isLoading && products.length === 0 ? (
                            <div className="w-full h-80 flex items-center justify-center bg-white rounded-3xl border border-purple-100/60 shadow-xs">
                                <Loader2 size={32} className="animate-spin text-purple-600" />
                            </div>
                        ) : (
                            <>
                                {/* 4 Primary Metric Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {cards.map((card, idx) => {
                                        const Icon = card.icon;
                                        const isPurple = card.bg.includes("bg-purple-600");

                                        return (
                                            <div
                                                key={idx}
                                                className={`rounded-3xl p-5 border border-purple-100/70 shadow-sm flex flex-col justify-between space-y-4 ${isPurple ? "bg-purple-600 text-white" : "bg-white"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className={`text-xs font-semibold tracking-wider uppercase ${isPurple ? "text-purple-100" : "text-slate-400"
                                                            }`}
                                                    >
                                                        {card.label}
                                                    </span>
                                                    <div
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${isPurple ? "bg-white/20 text-white" : "bg-purple-50 text-purple-600"
                                                            }`}
                                                    >
                                                        <Icon size={18} />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3
                                                        className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isPurple ? "text-white" : "text-slate-900"
                                                            }`}
                                                    >
                                                        {card.value}
                                                    </h3>
                                                    {card.sub && (
                                                        <p className="text-xs text-slate-500 font-medium">{card.sub}</p>
                                                    )}
                                                    {card.hint && (
                                                        <p className={`text-[11px] ${isPurple ? "text-purple-200" : "text-slate-400"}`}>
                                                            {card.hint}
                                                        </p>
                                                    )}
                                                </div>

                                                {card.link && (
                                                    <Link
                                                        to={card.link}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 pt-2 border-t border-slate-100"
                                                    >
                                                        <span>View Details</span>
                                                        <ArrowRight size={13} />
                                                    </Link>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Detailed Visual Panes */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                                    {/* Inventory Health Box */}
                                    <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                <Package size={17} className="text-purple-600" />
                                                <span>Inventory Health</span>
                                            </h3>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {products.length} Products Total
                                            </span>
                                        </div>

                                        <div className="space-y-4 pt-1">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-semibold">
                                                    <span className="text-slate-700">In Stock</span>
                                                    <span className="text-emerald-600 font-bold">{inStockCount} items</span>
                                                </div>
                                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: products.length ? `${(inStockCount / products.length) * 100}%` : "0%"
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-semibold">
                                                    <span className="text-slate-700">Out of Stock</span>
                                                    <span className="text-red-500 font-bold">{outOfStockCount} items</span>
                                                </div>
                                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: products.length ? `${(outOfStockCount / products.length) * 100}%` : "0%"
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {outOfStockCount > 0 && (
                                                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                                                    <AlertTriangle size={15} className="shrink-0" />
                                                    <span>Attention: {outOfStockCount} item(s) are currently out of stock.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Fulfillment Box */}
                                    <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                <ShoppingBag size={17} className="text-purple-600" />
                                                <span>Fulfillment Status</span>
                                            </h3>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {orders.length} Orders
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-1">
                                            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/50 space-y-1">
                                                <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    Processing
                                                </span>
                                                <p className="text-2xl font-bold text-slate-900">{processingOrders}</p>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/50 space-y-1">
                                                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                                                    <CheckCircle2 size={14} />
                                                    Delivered
                                                </span>
                                                <p className="text-2xl font-bold text-slate-900">{deliveredOrders}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </>
                        )}

                    </main>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default Dashboard;