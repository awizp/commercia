import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Lock, Upload, UserPlus, Eye, EyeOff, House, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import CommerciaLogo from "/images/logo.png";
import { PageTitle, ScrollToTop } from "../components/ui";
import { registerUser, removeErrors, removeSuccess } from "../features/users/userSlice.js";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux user state
    const { loading, error, success, isAuthenticated } = useSelector((state) => state.user);

    // Default avatar placeholder
    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";

    // Form states
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });
    const { name, email, password } = user;

    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
    const [showPassword, setShowPassword] = useState(false);

    // Watch for success or errors from Redux
    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(removeErrors());
        }

        if (success || isAuthenticated) {
            toast.success("Account registered successfully!", { position: "bottom-center" });
            dispatch(removeSuccess());
            navigate("/");
        }
    }, [dispatch, error, success, isAuthenticated, navigate]);

    // Dynamic field update & live file reader preview
    const handleChange = (e) => {
        if (e.target.name === "avatar") {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(file);
        } else {
            setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    // Form submit handler
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error("Please fill out all required fields", { position: "bottom-center" });
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters", { position: "bottom-center" });
            return;
        }

        // Prepare multi-part FormData payload
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        if (avatar) {
            myForm.set("avatar", avatar);
        }

        dispatch(registerUser(myForm));
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Register | Commercia" />

            <div className="relative w-full min-h-screen bg-purple-50/80 py-24 px-4 flex flex-col items-center justify-center">

                {/* Home Icon */}
                <Link
                    to="/"
                    title="Back to Home"
                    className="absolute top-6 left-6 sm:top-8 sm:left-8 w-11 h-11 bg-white border border-purple-100 rounded-full flex items-center justify-center text-slate-600 hover:text-purple-600 hover:border-purple-200 shadow-md shadow-purple-500/5 hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                    <House size={19} />
                </Link>

                {/* Main Register Form Block */}
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
                                Create Account
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Join Commercia and start your shopping journey
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">

                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Full Name
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
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
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder="johndoe@example.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
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

                        {/* Profile Picture */}
                        <div className="space-y-1.5 pt-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Profile Avatar
                            </label>
                            <div className="flex items-center gap-4 p-3 bg-slate-50/70 border border-slate-200 rounded-2xl">
                                <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-purple-200 shrink-0 shadow-sm bg-white">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <label className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-200 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 hover:text-purple-600 transition shadow-xs">
                                    <Upload size={15} />
                                    <span>Choose Picture</span>
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>
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
                                    <span>Please wait...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    <span>Sign Up</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* login link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition ml-1"
                        >
                            Log in
                        </Link>
                    </p>
                </div>

            </div>
        </>
    );
};

export default Register;