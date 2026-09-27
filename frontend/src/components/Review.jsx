import { User } from "lucide-react";
import { Rating } from "./ui";

const Review = ({ product }) => {

    // Format timestamp to human readable date
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        }).format(date);
    };

    return (
        <section className="w-full py-12 md:py-16 border-t border-slate-100 bg-slate-50/40">
            <div className="custom-container space-y-8">

                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Reviews</h3>
                    <p className="text-xs text-slate-500">
                        Showing {product?.reviews?.length || 0} reviews for {product?.name}
                    </p>
                </div>

                {/* Reviews List */}
                {product?.reviews && product.reviews.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {product.reviews.map((rev, index) => (
                            <div
                                key={rev._id || rev.user || index}
                                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4 transition-all hover:shadow-md hover:border-amber-200"
                            >
                                <div className="space-y-3">
                                    {/* Author Info & Date */}
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-100 border border-purple-200 shrink-0 flex items-center justify-center">
                                                {rev.avater ? (
                                                    <img
                                                        src={rev.avater}
                                                        alt={rev.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={20} className="text-purple-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                                                    {rev.name}
                                                </h4>
                                                <span className="text-xs text-slate-400">Verified Buyer</span>
                                            </div>
                                        </div>

                                        <span className="text-xs text-slate-400 shrink-0">
                                            {formatDate(rev.createdAt)}
                                        </span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2">
                                        <Rating
                                            value={rev.rating}
                                            disabled={true}
                                            showValue={false}
                                        />
                                    </div>

                                    {/* Comment */}
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {rev.comment}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-sm text-slate-500 font-medium">No reviews yet.</p>
                        <p className="text-xs text-slate-400 mt-1">Be the first to share your thoughts!</p>
                    </div>
                )}

            </div>
        </section>
    );
};

export default Review;