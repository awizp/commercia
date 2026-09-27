import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBasket, Minus, Plus, Truck, ShieldCheck, RotateCcw, MessageSquarePlus, X, Send, Loader2, Trash2, Edit3, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import { Rating } from "./ui";
import { addCartItem, removeCartErrors, removeCartSuccess } from "../features/cart/cartSlice.js";
import { submitReview, removeUserReview, resetReviewStatus, clearReviewErrors } from "../features/products/reviewSlice.js";

const ProductDetails = ({ product, onRefreshProduct }) => {
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector((state) => state.user || {});
    const { orders = [] } = useSelector((state) => state.order || {});
    const { loading: cartLoading, error: cartError, success: cartSuccess, message: cartMessage } = useSelector((state) => state.cart || {});
    const { loading: reviewLoading, success: reviewSuccess, isDeleted: reviewDeleted, error: reviewError, message: reviewMessage } = useSelector((state) => state.review || {});

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    // Identify if the logged-in user already wrote a review on this product
    const existingReview = product?.reviews?.find(
        (rev) => rev.user?.toString() === user?._id?.toString()
    );

    // Verify if the user purchased this product AND the order status is "Delivered"
    const canUserReview = Boolean(
        isAuthenticated &&
        user?._id &&
        orders?.some(
            (ord) =>
                ord.orderStatus === "Delivered" &&
                ord.orderDetails?.some(
                    (item) => (item.product?._id || item.product)?.toString() === product?._id?.toString()
                )
        )
    );

    // Reset local state when product changes or when editing existing review
    useEffect(() => {
        const resetHandle = () => {
            setSelectedImage(0);
            setQuantity(1);
            setShowReviewForm(false);

            if (existingReview) {
                setRating(existingReview.rating || 0);
                setComment(existingReview.comment || "");
            } else {
                setRating(0);
                setComment("");
            }
        };

        resetHandle();
    }, [product?._id, existingReview]);

    // Handle cart toasts
    useEffect(() => {
        if (cartError) {
            toast.error(cartError, { position: "bottom-center" });
            dispatch(removeCartErrors());
        }

        if (cartSuccess && cartMessage) {
            toast.success(cartMessage, { position: "bottom-center" });
            dispatch(removeCartSuccess());
        }
    }, [dispatch, cartError, cartSuccess, cartMessage]);

    // Handle review submission and deletion toasts
    useEffect(() => {
        if (reviewError) {
            toast.error(reviewError, { position: "bottom-center" });
            dispatch(clearReviewErrors());
        }

        if (reviewSuccess) {
            toast.success(reviewMessage || "Review saved successfully!", { position: "bottom-center" });
            dispatch(resetReviewStatus());
            const reviewShowHandle = () => setShowReviewForm(false);
            reviewShowHandle();
            onRefreshProduct?.();
        }

        if (reviewDeleted) {
            toast.success(reviewMessage || "Review deleted successfully!", { position: "bottom-center" });
            dispatch(resetReviewStatus());
            const reviewDeleteHandle = () => {
                setRating(0);
                setComment("");
                setShowReviewForm(false);
            };
            reviewDeleteHandle();
            onRefreshProduct?.();
        }
    }, [reviewError, reviewSuccess, reviewDeleted, reviewMessage, dispatch, onRefreshProduct]);

    const handleDecrease = () => {
        if (quantity <= 1) {
            toast.error("Quantity cannot be less than 1", { position: "bottom-center" });
            return;
        }
        setQuantity((prev) => prev - 1);
    };

    const handleIncrease = () => {
        if (quantity >= (product?.stock || 0)) {
            toast.error("Cannot exceed available stock quantity", { position: "bottom-center" });
            return;
        }
        setQuantity((prev) => prev + 1);
    };

    const handleAddToCart = () => {
        if (!product?.stock || product.stock <= 0) {
            toast.error("This product is currently out of stock", { position: "bottom-center" });
            return;
        }

        dispatch(addCartItem({ id: product._id, quantity }));
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please select a star rating", { position: "bottom-center" });
            return;
        }

        if (!comment.trim()) {
            toast.error("Please enter a review comment", { position: "bottom-center" });
            return;
        }

        dispatch(
            submitReview({
                productId: product._id,
                rating,
                comment: comment.trim()
            })
        );
    };

    const handleDeleteReview = () => {
        if (window.confirm("Are you sure you want to remove your review?")) {
            dispatch(removeUserReview(product._id));
        }
    };

    const discountPercentage =
        product?.mrp && product?.price
            ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
            : 0;

    const displayImage =
        product?.image?.[selectedImage]?.url ||
        product?.images?.[selectedImage]?.url ||
        product?.image?.[0]?.url ||
        product?.images?.[0]?.url ||
        "";

    return (
        <section className="w-full py-26 md:py-30">
            <div className="custom-container space-y-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

                    {/* Product Images */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="w-full h-85 sm:h-110 lg:h-125 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/70 shadow-sm relative group">
                            <img
                                src={displayImage}
                                alt={product?.name}
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                            {discountPercentage > 0 && (
                                <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                    {discountPercentage}% OFF
                                </span>
                            )}
                        </div>

                        {/* Image Thumbnails */}
                        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none">
                            {(product?.image || product?.images)?.map((img, idx) => (
                                <button
                                    key={img.public_id || idx}
                                    type="button"
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-slate-100 ${selectedImage === idx
                                        ? "border-purple-600 ring-2 ring-purple-500/20 shadow-sm"
                                        : "border-slate-200 hover:border-purple-300 opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <img
                                        src={typeof img === "string" ? img : img.url}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="lg:col-span-6 space-y-6">

                        {/* Title and Category */}
                        <div className="space-y-2">
                            <span className="text-xs uppercase font-semibold text-purple-600 tracking-wider">
                                {product?.category}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                                {product?.name}
                            </h1>
                        </div>

                        {/* Rating Block */}
                        <div className="flex items-center gap-3 border-y border-slate-100 py-3">
                            <Rating value={product?.ratings || 0} disabled={true} showValue={false} />
                            <span className="text-sm font-semibold text-slate-800">
                                {Number(product?.ratings || 0).toFixed(1)}
                            </span>
                            <span className="text-slate-400 text-sm">|</span>
                            <span className="text-sm text-slate-600">
                                {product?.numOfReviews} {product?.numOfReviews <= 1 ? "review" : "reviews"}
                            </span>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-3.5">
                            <span className="text-3xl sm:text-4xl font-bold text-purple-600">
                                ${product?.price}
                            </span>
                            {product?.mrp && product?.mrp > product?.price && (
                                <span className="text-xl text-slate-400 line-through font-medium">
                                    ${product?.mrp}
                                </span>
                            )}
                            {discountPercentage > 0 && (
                                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                    Save ${(product.mrp - product.price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            {product?.description}
                        </p>

                        {/* Stock Indicator */}
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${product?.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
                            <span className="text-sm font-medium text-slate-700">
                                {product?.stock > 0 ? (
                                    <>In Stock <span className="text-slate-400 font-normal">({product.stock} units available)</span></>
                                ) : (
                                    "Out of Stock"
                                )}
                            </span>
                        </div>

                        {/* Purchase & Action */}
                        <div className="space-y-3.5 pt-2">

                            <div className="flex items-center gap-3 sm:gap-4">

                                {/* Quantity Control */}
                                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/70 p-1">
                                    <button
                                        type="button"
                                        onClick={handleDecrease}
                                        disabled={quantity <= 1 || !product?.stock}
                                        className="p-2 text-slate-600 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-12 text-center text-sm font-semibold text-slate-800 select-none">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleIncrease}
                                        disabled={quantity >= (product?.stock || 1)}
                                        className="p-2 text-slate-600 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Review toggle button - ONLY visible if user purchased and order was DELIVERED */}
                                {canUserReview && (
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewForm(!showReviewForm)}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium text-sm transition-all cursor-pointer ${showReviewForm
                                            ? "border-purple-600 bg-purple-50 text-purple-700 shadow-xs"
                                            : "border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-600 bg-white"
                                            }`}
                                    >
                                        {showReviewForm ? (
                                            <X size={17} />
                                        ) : existingReview ? (
                                            <Edit3 size={17} />
                                        ) : (
                                            <MessageSquarePlus size={17} />
                                        )}
                                        <span>
                                            {showReviewForm
                                                ? "Close"
                                                : existingReview
                                                    ? "Edit My Review"
                                                    : "Write Review"}
                                        </span>
                                    </button>
                                )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!product?.stock || product?.stock === 0 || cartLoading}
                                className="w-full flex items-center justify-center gap-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-purple-200 transition-all cursor-pointer disabled:cursor-not-allowed text-base"
                            >
                                {cartLoading ? (
                                    <>
                                        <Loader2 size={19} className="animate-spin" />
                                        <span>Adding to Cart...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBasket size={20} />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </button>

                            {/* Review Form (Only accessible when canUserReview is true) */}
                            {showReviewForm && canUserReview && (
                                <div className="mt-4 p-5 sm:p-6 bg-slate-50/90 rounded-2xl border border-purple-100 shadow-sm space-y-4 animate-in fade-in duration-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">
                                                {existingReview ? "Update Your Review" : "Share Your Thoughts"}
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                Verified purchase feedback for this product
                                            </p>
                                        </div>

                                        {existingReview && (
                                            <button
                                                type="button"
                                                onClick={handleDeleteReview}
                                                disabled={reviewLoading}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                                                title="Delete this review"
                                            >
                                                <Trash2 size={14} />
                                                <span>Delete</span>
                                            </button>
                                        )}
                                    </div>

                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Rating
                                                value={rating}
                                                disabled={false}
                                                showValue={false}
                                                onRatingChange={(rate) => setRating(rate)}
                                            />
                                            {rating > 0 && (
                                                <span className="text-xs font-semibold text-purple-600">
                                                    {rating} / 5
                                                </span>
                                            )}
                                        </div>

                                        <textarea
                                            rows={3}
                                            required
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Write your review or feedback about this product..."
                                            className="w-full text-sm p-3.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition resize-none bg-white text-slate-800 placeholder:text-slate-400"
                                        />

                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowReviewForm(false)}
                                                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={rating === 0 || !comment.trim() || reviewLoading}
                                                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white text-xs font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                                            >
                                                {reviewLoading ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Send size={14} />
                                                )}
                                                <span>{existingReview ? "Update" : "Publish"}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Service Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Truck size={18} className="text-purple-600 shrink-0" />
                                <span className="text-xs font-medium">Free fast delivery</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <RotateCcw size={18} className="text-purple-600 shrink-0" />
                                <span className="text-xs font-medium">30 days return</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <ShieldCheck size={18} className="text-purple-600 shrink-0" />
                                <span className="text-xs font-medium">2 year warranty</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default ProductDetails;