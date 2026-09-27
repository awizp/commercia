import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Search, Trash2, AlertCircle, Loader2, MessageSquare, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../../components/ui";
import { Navbar, Footer } from "../../components";
import { Sidebar } from "../../components/admin";
import { getProductReviews, deleteReview, resetAdminProductStatus, clearAdminProductErrors } from "../../features/admin/adminProductSlice.js";

const ProductReviews = () => {
    const dispatch = useDispatch();

    const {
        reviews = [],
        loading,
        error,
        message
    } = useSelector((state) => state.adminProduct);

    const [productId, setProductId] = useState("");
    const [searchedId, setSearchedId] = useState("");

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(clearAdminProductErrors());
        }

        if (message) {
            toast.success(message, { position: "bottom-center" });
            dispatch(resetAdminProductStatus());
            // Re-fetch remaining reviews if an ID has been searched
            if (searchedId) {
                dispatch(getProductReviews(searchedId));
            }
        }
    }, [error, message, searchedId, dispatch]);

    const handleSearchReviews = (e) => {
        e.preventDefault();

        if (!productId.trim()) {
            toast.error("Please enter a valid Product ID", { position: "bottom-center" });
            return;
        }

        setSearchedId(productId.trim());
        dispatch(getProductReviews(productId.trim()));
    };

    const handleDeleteReview = (reviewId) => {
        if (window.confirm("Are you sure you want to delete this user review?")) {
            dispatch(deleteReview({ productId: searchedId, reviewId }));
        }
    };

    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Reviews Moderation | Commercia Admin" />
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
                                    Product Reviews Moderation
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                    Search by Product ID to inspect customer feedback and moderate comments
                                </p>
                            </div>
                        </div>

                        {/* Search Product Reviews Bar */}
                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100/70 shadow-xs">
                            <form onSubmit={handleSearchReviews} className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="relative w-full flex-1">
                                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Paste Product ID (e.g. 64b8f...)"
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-purple-200 transition cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Searching...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Search size={16} />
                                            <span>Search Reviews</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Reviews Table / State Containers */}
                        <div className="bg-white rounded-3xl border border-purple-100/70 shadow-sm overflow-hidden">
                            {loading ? (
                                <div className="py-24 flex flex-col items-center justify-center gap-3">
                                    <Loader2 size={32} className="animate-spin text-purple-600" />
                                    <p className="text-xs font-semibold text-slate-400">Fetching reviews for product...</p>
                                </div>
                            ) : !searchedId ? (
                                <div className="py-20 px-4 text-center space-y-3">
                                    <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto">
                                        <MessageSquare size={26} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-slate-800">No Product Selected</h3>
                                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                            Enter a product ID above to load and moderate its customer reviews.
                                        </p>
                                    </div>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="py-20 px-4 text-center space-y-3">
                                    <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto">
                                        <AlertCircle size={26} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-slate-800">No Reviews Found</h3>
                                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                            This product does not have any customer reviews yet.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                        <thead>
                                            <tr className="bg-purple-50/60 text-slate-500 text-[11px] uppercase tracking-wider border-b border-purple-100/70">
                                                <th className="py-3.5 px-4 font-bold">Reviewer</th>
                                                <th className="py-3.5 px-4 font-bold">Rating</th>
                                                <th className="py-3.5 px-4 font-bold">Comment</th>
                                                <th className="py-3.5 px-4 font-bold">Date</th>
                                                <th className="py-3.5 px-4 font-bold text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {reviews.map((rev) => {
                                                const reviewAvatar = rev.avater || defaultAvatar;

                                                return (
                                                    <tr key={rev._id} className="hover:bg-purple-50/20 transition">
                                                        {/* Reviewer info */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-100 bg-slate-50 shrink-0">
                                                                    <img
                                                                        src={reviewAvatar}
                                                                        alt={rev.name}
                                                                        onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-800 truncate max-w-xs">
                                                                        {rev.name}
                                                                    </p>
                                                                    <p className="text-[10px] text-slate-400 font-mono">
                                                                        #{rev._id?.slice(-8).toUpperCase()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Rating */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/60">
                                                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                                                <span>{rev.rating} / 5</span>
                                                            </div>
                                                        </td>

                                                        {/* Comment Text */}
                                                        <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs sm:max-w-md">
                                                            <p className="line-clamp-2 leading-relaxed">
                                                                {rev.comment}
                                                            </p>
                                                        </td>

                                                        {/* Date */}
                                                        <td className="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">
                                                            {new Date(rev.createdAt).toLocaleDateString()}
                                                        </td>

                                                        {/* Delete Button */}
                                                        <td className="py-3.5 px-4 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteReview(rev._id)}
                                                                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                                                title="Delete Review"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
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

export default ProductReviews;