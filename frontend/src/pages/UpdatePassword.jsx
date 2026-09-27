import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../components/ui";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { updatePassword, removeErrors, removeSuccess } from "../features/users/userSlice.js";

const UpdatePassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector((state) => state.user);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(removeErrors());
        }

        if (success) {
            toast.success("Password updated successfully!", { position: "bottom-center" });
            dispatch(removeSuccess());
            navigate("/profile");
        }
    }, [dispatch, error, success, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields", { position: "bottom-center" });
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters", { position: "bottom-center" });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match", { position: "bottom-center" });
            return;
        }

        dispatch(updatePassword({ oldPassword, newPassword, confirmPassword }));
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Change Password | Commercia" />
            <Navbar />

            <main className="w-full min-h-screen bg-purple-50/20 pt-28 pb-20 px-4 sm:px-6">
                <div className="max-w-md mx-auto space-y-6">

                    {/* Back Link */}
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Profile</span>
                    </Link>

                    {/* Change Password Card */}
                    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-purple-100/70 space-y-6">

                        <div className="text-center space-y-1">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                                <KeyRound size={22} />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Change Password
                            </h1>
                            <p className="text-xs text-slate-500">
                                Enhance account security by updating your password
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Old Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    Current Password
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-slate-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-11 pr-11 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-4 text-slate-400 hover:text-purple-600 transition cursor-pointer"
                                    >
                                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    New Password
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-slate-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        required
                                        className="w-full pl-11 pr-11 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 text-slate-400 hover:text-purple-600 transition cursor-pointer"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    Confirm New Password
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-slate-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat new password"
                                        required
                                        className="w-full pl-11 pr-11 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 text-slate-400 hover:text-purple-600 transition cursor-pointer"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Updating Password...</span>
                                    </>
                                ) : (
                                    <>
                                        <KeyRound size={18} />
                                        <span>Update Password</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
};

export default UpdatePassword;