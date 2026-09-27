import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, ArrowLeft, Check, Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../components/ui";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { updateProfile, removeErrors, removeSuccess } from "../features/users/userSlice.js";

const UpdateProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated, loading, error, success } = useSelector((state) => state.user);

    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);

    // Guard route and prefill user data
    useEffect(() => {

        const userUpdateHandle = () => {
            setName(user.name || "");
            setEmail(user.email || "");
            setAvatarPreview(user.avatar?.url || defaultAvatar);
        };

        if (!loading && !isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user) {
            userUpdateHandle();
        }
    }, [user, isAuthenticated, loading, navigate]);

    // Handle toast and navigation on response
    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(removeErrors());
        }

        if (success) {
            toast.success("Profile updated successfully!", { position: "bottom-center" });
            dispatch(removeSuccess());
            navigate("/profile");
        }
    }, [dispatch, error, success, navigate]);

    // Avatar file change handler using FileReader
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Ensure file is an image
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file (PNG, JPG, JPEG, WEBP)", { position: "bottom-center" });
            return;
        }

        // Limit size to ~5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image file size should be less than 5MB", { position: "bottom-center" });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim()) {
            toast.error("Name and email cannot be empty", { position: "bottom-center" });
            return;
        }

        const updateData = {
            name: name.trim(),
            email: email.trim()
        };

        // Only send avatar if a new image was chosen
        if (avatar) {
            updateData.avatar = avatar;
        }

        dispatch(updateProfile(updateData));
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Edit Profile | Commercia" />
            <Navbar />

            <main className="w-full bg-purple-50/20 pt-30 pb-20 px-4 sm:px-6">
                <div className="max-w-md mx-auto space-y-6">

                    {/* Back Link */}
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Profile</span>
                    </Link>

                    {/* Form Card */}
                    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-purple-100/70 space-y-6">

                        <div className="text-center space-y-1">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Edit Profile
                            </h1>
                            <p className="text-xs text-slate-500">
                                Update your photo and personal details
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Avatar Upload with Live Preview */}
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-100 shadow-md bg-white">
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar Preview"
                                            onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md cursor-pointer border-2 border-white transition group-hover:scale-105"
                                        title="Change Profile Picture"
                                    >
                                        <Camera size={16} />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium">
                                    Click camera to upload new avatar
                                </span>
                            </div>

                            {/* Full Name Input */}
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Email Address Input */}
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
                                        placeholder="Your email address"
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
                                        <span>Updating Profile...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        <span>Update Profile</span>
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

export default UpdateProfile;