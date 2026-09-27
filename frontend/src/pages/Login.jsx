import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, LogIn, Eye, EyeOff, House, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import CommerciaLogo from "/images/logo.png";
import { PageTitle, ScrollToTop } from "../components/ui";
import { loginUser, removeErrors, removeSuccess } from "../features/users/userSlice.js";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success, isAuthenticated } = useSelector((state) => state.user);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(removeErrors());
        }

        // Only show toast when a login action just succeeded
        if (success) {
            toast.success("Welcome back!", { position: "bottom-center" });
            dispatch(removeSuccess());
            navigate("/");
            return;
        }

        // If already authenticated on load, redirect quietly without toast
        if (isAuthenticated) {
            navigate("/");
        }
    }, [dispatch, error, success, isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in both email and password", { position: "bottom-center" });
            return;
        }

        dispatch(loginUser({ email, password }));
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Login | Commercia" />

            <div className="relative w-full min-h-screen bg-purple-50/80 py-24 px-4 flex flex-col items-center justify-center">

                {/* Floating Home Navigation Icon */}
                <Link
                    to="/"
                    title="Back to Home"
                    className="absolute top-6 left-6 sm:top-8 sm:left-8 w-11 h-11 bg-white border border-purple-100 rounded-full flex items-center justify-center text-slate-600 hover:text-purple-600 hover:border-purple-200 shadow-md shadow-purple-500/5 hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                    <House size={19} />
                </Link>

                {/* Main Login Card */}
                <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-purple-100/70 space-y-8">

                    {/* Header with Commercia Logo */}
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
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Enter your credentials to access your account
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Email Address
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="johndoe@example.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    Password
                                </label>
                                <Link
                                    to="/password/forget"
                                    className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline transition"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Register Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition ml-1"
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>

            </div>
        </>
    );
};

export default Login;