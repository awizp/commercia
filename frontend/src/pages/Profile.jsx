import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { User, Mail, Calendar, ShieldCheck, Edit3, Lock, Package, Loader2 } from "lucide-react";

import { PageTitle, ScrollToTop } from "../components/ui";
import { Navbar, Footer } from "../components";

const Profile = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading } = useSelector((state) => state.user);

    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";

    // redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-purple-50/20">
                <Loader2 size={36} className="text-purple-600 animate-spin" />
            </div>
        );
    }

    // Format account creation date
    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        })
        : "Recent Member";

    return (
        <>
            <ScrollToTop />
            <PageTitle title={`${user?.name || "User"} Profile | Commercia`} />
            <Navbar />

            <main className="w-full bg-purple-50/20 pt-30 pb-20 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Page Header */}
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            My Profile
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Manage your personal details and account settings
                        </p>
                    </div>

                    {/* Main Profile Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-purple-100/70 space-y-8">

                        {/* Avatar & Header Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-purple-100/70">
                            <div className="relative">
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-purple-100 shadow-md bg-white">
                                    <img
                                        src={user?.avatar?.url || defaultAvatar}
                                        alt={user?.name || "User Profile"}
                                        onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Active">
                                    <span className="w-2 h-2 rounded-full bg-white"></span>
                                </span>
                            </div>

                            <div className="text-center sm:text-left space-y-2 flex-1">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        {user?.name}
                                    </h2>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 capitalize">
                                        <ShieldCheck size={13} />
                                        <span>{user?.role || "Customer"}</span>
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                                    <Mail size={14} className="text-purple-600" />
                                    <span>{user?.email}</span>
                                </p>
                                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                                    <Calendar size={13} />
                                    <span>Member since {joinedDate}</span>
                                </p>
                            </div>

                            {/* Quick Edit Action Button */}
                            <Link
                                to="/profile/update"
                                className="inline-flex items-center gap-2 py-2.5 px-5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-purple-200 hover:shadow-md transition cursor-pointer"
                            >
                                <Edit3 size={15} />
                                <span>Edit Profile</span>
                            </Link>
                        </div>

                        {/* Profile Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/60 space-y-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Full Name
                                </span>
                                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                    <User size={16} className="text-purple-600" />
                                    <span>{user?.name}</span>
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/60 space-y-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Email Address
                                </span>
                                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2 truncate">
                                    <Mail size={16} className="text-purple-600 shrink-0" />
                                    <span className="truncate">{user?.email}</span>
                                </p>
                            </div>
                        </div>

                        {/* Account Links */}
                        <div className="space-y-3 pt-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Account Quick Links
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Link
                                    to="/orders"
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-200 hover:bg-purple-50/30 transition group shadow-2xs"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">My Orders</p>
                                            <p className="text-xs text-slate-500">View order history and tracking</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    to="/password/update"
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-200 hover:bg-purple-50/30 transition group shadow-2xs"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
                                            <Lock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Change Password</p>
                                            <p className="text-xs text-slate-500">Update security credentials</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default Profile;