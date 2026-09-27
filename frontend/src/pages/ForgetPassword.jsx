import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Send, House, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

import CommerciaLogo from "/images/logo.png";
import { PageTitle, ScrollToTop } from "../components/ui";
import { forgotPassword, removeErrors, removeMessage } from "../features/users/userSlice.js";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector((state) => state.user);

    const [email, setEmail] = useState("");

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(removeErrors());
        }

        const sentMailHandle = () => {
            toast.success(message, { position: "bottom-center", duration: 5000 });
            dispatch(removeMessage());
            setEmail("");
        };

        if (message) {
            sentMailHandle();
        }
    }, [dispatch, error, message]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your registered email address", { position: "bottom-center" });
            return;
        }

        dispatch(forgotPassword({ email: email.trim() }));
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Forgot Password | Commercia" />

            <div className="relative w-full min-h-screen bg-purple-50/80 py-24 px-4 flex flex-col items-center justify-center">

                {/* Floating Home Button */}
                <Link
                    to="/"
                    title="Back to Home"
                    className="absolute top-6 left-6 sm:top-8 sm:left-8 w-11 h-11 bg-white border border-purple-100 rounded-full flex items-center justify-center text-slate-600 hover:text-purple-600 hover:border-purple-200 shadow-md shadow-purple-500/5 hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                    <House size={19} />
                </Link>

                {/* Card Container */}
                <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-purple-100/70 space-y-7">

                    {/* Logo & Heading */}
                    <div className="text-center space-y-3">
                        <div className="space-y-1">
                            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                                <KeyRound size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Forgot Password?
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Enter your email and we'll send you a password reset link
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Registered Email Address
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Sending Reset Link...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    <span>Send Reset Link</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="pt-2 text-center border-t border-slate-100">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition"
                        >
                            <ArrowLeft size={14} />
                            <span>Return to Sign In</span>
                        </Link>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ForgotPassword;