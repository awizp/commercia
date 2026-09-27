import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Lock, Eye, EyeOff, House, KeyRound, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import CommerciaLogo from "/images/logo.png";
import { PageTitle, ScrollToTop } from "../components/ui";
import { resetPassword, removeErrors, removeSuccess, removeMessage } from "../features/users/userSlice.js";

const ResetPassword = () => {

    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success, message } = useSelector((state) => state.user);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(removeErrors());
        }

        if (success) {
            toast.success(message || "Password reset successfully! Please sign in.", {
                position: "bottom-center",
                duration: 4000
            });
            dispatch(removeSuccess());
            dispatch(removeMessage());
            navigate("/login");
        }
    }, [dispatch, error, success, message, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Please fill in both password fields", { position: "bottom-center" });
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters", { position: "bottom-center" });
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match", { position: "bottom-center" });
            return;
        }

        dispatch(resetPassword({ token, passwords: { password, confirmPassword } }));
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Reset Password | Commercia" />

            <div className="relative w-full min-h-screen bg-purple-50/20 py-24 px-4 flex flex-col items-center justify-center">

                {/* Floating Home Button */}
                <Link
                    to="/"
                    title="Back to Home"
                    className="absolute top-6 left-6 sm:top-8 sm:left-8 w-11 h-11 bg-white border border-purple-100 rounded-full flex items-center justify-center text-slate-600 hover:text-purple-600 hover:border-purple-200 shadow-md shadow-purple-500/5 hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                    <House size={19} />
                </Link>

                {/* Reset Password Card */}
                <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-purple-100/70 space-y-7">

                    {/* Logo & Heading */}
                    <div className="text-center space-y-3">
                        <Link to="/" className="inline-block">
                            <div className="h-14 sm:h-16 mx-auto flex items-center justify-center">
                                <img
                                    src={CommerciaLogo}
                                    alt="Commercia Logo"
                                    className="h-full object-contain cursor-pointer"
                                />
                            </div>
                        </Link>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Reset Password
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Enter your new password below to regain access
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

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
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    required
                                    className="w-full pl-11 pr-11 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-slate-400 hover:text-purple-600 transition cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
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
                                    <span>Resetting Password...</span>
                                </>
                            ) : (
                                <>
                                    <Check size={18} />
                                    <span>Reset Password</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="pt-2 text-center border-t border-slate-100">
                        <Link
                            to="/login"
                            className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition"
                        >
                            Remember your password? Sign In
                        </Link>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ResetPassword;