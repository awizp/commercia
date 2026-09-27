import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Trash2, Search, AlertCircle, Loader2, ShieldCheck, UserCheck, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../../components/ui";
import { Navbar, Footer } from "../../components";
import { Sidebar } from "../../components/admin";
import { getAdminUsers, updateUserRole, deleteUser, resetAdminUserStatus, clearAdminUserErrors } from "../../features/admin/adminUserSlice.js";

const UserList = () => {
    const dispatch = useDispatch();

    const { user: currentAdmin } = useSelector((state) => state.user || {});
    const {
        users = [],
        loading,
        error,
        isUpdated,
        isDeleted,
        message
    } = useSelector((state) => state.adminUser);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    useEffect(() => {
        dispatch(getAdminUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(clearAdminUserErrors());
        }

        if (isUpdated) {
            toast.success(message || "User role updated successfully", { position: "bottom-center" });
            dispatch(resetAdminUserStatus());
        }

        if (isDeleted) {
            toast.success(message || "User deleted successfully", { position: "bottom-center" });
            dispatch(resetAdminUserStatus());
        }
    }, [error, isUpdated, isDeleted, message, dispatch]);

    const handleRoleChange = (userId, currentRole) => {
        if (userId === currentAdmin?._id) {
            toast.error("You cannot change your own admin role", { position: "bottom-center" });
            return;
        }

        const newRole = currentRole === "admin" ? "user" : "admin";
        const confirmMessage = currentRole === "admin"
            ? "Are you sure you want to demote this user to a regular customer?"
            : "Are you sure you want to grant full Administrator access to this user?";

        if (window.confirm(confirmMessage)) {
            dispatch(updateUserRole({ id: userId, role: newRole }));
        }
    };

    const handleDeleteUser = (userId, userName) => {
        if (userId === currentAdmin?._id) {
            toast.error("You cannot delete your own admin account", { position: "bottom-center" });
            return;
        }

        if (window.confirm(`Are you sure you want to permanently delete user "${userName}"?`)) {
            dispatch(deleteUser(userId));
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u._id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "all" || u.role?.toLowerCase() === roleFilter.toLowerCase();

        return matchesSearch && matchesRole;
    });

    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";

    return (
        <>
            <ScrollToTop />
            <PageTitle title="User Management | Commercia Admin" />
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
                                    User Management
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                    Manage accounts, assign administrative roles, and regulate access
                                </p>
                            </div>

                            <span className="text-xs font-semibold px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl border border-purple-200/60 self-start sm:self-auto">
                                Total Accounts: {users.length}
                            </span>
                        </div>

                        {/* Search and Role Filter Bar */}
                        <div className="bg-white rounded-2xl p-4 border border-purple-100/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                />
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-purple-600 transition capitalize cursor-pointer"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">Administrators</option>
                                    <option value="user">Regular Customers</option>
                                </select>

                                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                                    Showing: <strong className="text-purple-600 font-bold">{filteredUsers.length}</strong> of {users.length}
                                </span>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-3xl border border-purple-100/70 shadow-sm overflow-hidden">
                            {loading && users.length === 0 ? (
                                <div className="py-24 flex flex-col items-center justify-center gap-3">
                                    <Loader2 size={32} className="animate-spin text-purple-600" />
                                    <p className="text-xs font-semibold text-slate-400">Loading user database...</p>
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="py-20 px-4 text-center space-y-3">
                                    <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto">
                                        <AlertCircle size={26} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-slate-800">No matching users found</h3>
                                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                            There are no accounts that match your current search or role filter.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                        <thead>
                                            <tr className="bg-purple-50/60 text-slate-500 text-[11px] uppercase tracking-wider border-b border-purple-100/70">
                                                <th className="py-3.5 px-4 font-bold">User</th>
                                                <th className="py-3.5 px-4 font-bold">Email</th>
                                                <th className="py-3.5 px-4 font-bold">User ID</th>
                                                <th className="py-3.5 px-4 font-bold">Role</th>
                                                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredUsers.map((u) => {
                                                const isAdmin = u.role === "admin";
                                                const isSelf = u._id === currentAdmin?._id;
                                                const avatarUrl = u.avatar?.url || defaultAvatar;

                                                return (
                                                    <tr key={u._id} className="hover:bg-purple-50/20 transition">
                                                        {/* Avatar and Name */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-100 bg-slate-50 shrink-0">
                                                                    <img
                                                                        src={avatarUrl}
                                                                        alt={u.name}
                                                                        onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <p className="font-bold text-slate-800 truncate max-w-xs">
                                                                            {u.name}
                                                                        </p>
                                                                        {isSelf && (
                                                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                                                                                You
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Email */}
                                                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                                                            {u.email}
                                                        </td>

                                                        {/* User ID */}
                                                        <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                                                            #{u._id.slice(-8).toUpperCase()}
                                                        </td>

                                                        {/* Role Badge */}
                                                        <td className="py-3.5 px-4">
                                                            <span
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${isAdmin
                                                                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                                                                        : "bg-slate-100 text-slate-600 border border-slate-200"
                                                                    }`}
                                                            >
                                                                {isAdmin ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
                                                                <span className="capitalize">{u.role || "user"}</span>
                                                            </span>
                                                        </td>

                                                        {/* Action Buttons */}
                                                        <td className="py-3.5 px-4 text-right">
                                                            <div className="inline-flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRoleChange(u._id, u.role)}
                                                                    disabled={isSelf}
                                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${isSelf
                                                                            ? "opacity-30 cursor-not-allowed text-slate-400 bg-slate-100"
                                                                            : isAdmin
                                                                                ? "bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer"
                                                                                : "bg-purple-50 hover:bg-purple-100 text-purple-700 cursor-pointer"
                                                                        }`}
                                                                    title={isSelf ? "Cannot change own role" : `Switch role to ${isAdmin ? "User" : "Admin"}`}
                                                                >
                                                                    {isAdmin ? "Make User" : "Make Admin"}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteUser(u._id, u.name)}
                                                                    disabled={isSelf}
                                                                    className={`p-2 rounded-xl transition ${isSelf
                                                                            ? "opacity-30 cursor-not-allowed text-slate-400"
                                                                            : "text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                                                        }`}
                                                                    title={isSelf ? "Cannot delete own account" : "Delete User"}
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

export default UserList;