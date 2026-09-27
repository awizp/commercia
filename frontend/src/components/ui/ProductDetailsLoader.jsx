const ProductDetailsLoader = () => {
    return (
        <div className="w-full min-h-screen bg-purple-50/30 animate-pulse py-16 md:py-24">
            <div className="custom-container space-y-10">

                {/* Breadcrumb skeleton */}
                <div className="flex items-center gap-3">
                    <div className="h-4 bg-purple-200/60 w-12 rounded" />
                    <div className="h-4 bg-purple-200/40 w-3 rounded" />
                    <div className="h-4 bg-purple-200/60 w-16 rounded" />
                    <div className="h-4 bg-purple-200/40 w-3 rounded" />
                    <div className="h-4 bg-purple-200/50 w-44 rounded" />
                </div>

                {/* Main product showcase grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

                    {/* Left: Images skeleton */}
                    <div className="lg:col-span-6 space-y-4">
                        {/* Main big image preview */}
                        <div className="w-full h-85 sm:h-110 lg:h-125 bg-purple-200/50 rounded-3xl" />

                        {/* Thumbnails row */}
                        <div className="flex gap-3.5 overflow-hidden">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-200/40 rounded-xl shrink-0"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Info and CTA skeleton */}
                    <div className="lg:col-span-6 space-y-6">
                        
                        {/* Category and Title */}
                        <div className="space-y-3">
                            <div className="h-4 bg-purple-200/60 w-28 rounded-md" />
                            <div className="h-9 md:h-10 bg-purple-300/60 w-4/5 rounded-xl" />
                        </div>

                        {/* Ratings row */}
                        <div className="flex items-center gap-3 py-3 border-y border-purple-100">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <div key={star} className="w-4 h-4 bg-purple-200/60 rounded-full" />
                                ))}
                            </div>
                            <div className="h-4 bg-purple-200/50 w-12 rounded" />
                            <div className="h-4 bg-purple-100 w-24 rounded" />
                        </div>

                        {/* Price block */}
                        <div className="flex items-baseline gap-4">
                            <div className="h-10 bg-purple-300/70 w-32 rounded-xl" />
                            <div className="h-6 bg-purple-200/50 w-20 rounded-md" />
                            <div className="h-6 bg-purple-100 w-24 rounded-md" />
                        </div>

                        {/* Description paragraphs */}
                        <div className="space-y-2.5 pt-2">
                            <div className="h-4 bg-purple-200/40 w-full rounded" />
                            <div className="h-4 bg-purple-200/40 w-5/6 rounded" />
                            <div className="h-4 bg-purple-200/40 w-2/3 rounded" />
                        </div>

                        {/* Stock pill */}
                        <div className="flex items-center gap-2 pt-1">
                            <div className="w-3 h-3 rounded-full bg-purple-300/60" />
                            <div className="h-4 bg-purple-200/50 w-36 rounded" />
                        </div>

                        {/* Quantity and CTA row */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="h-12 w-32 bg-purple-200/40 rounded-xl" />
                            <div className="h-12 flex-1 sm:flex-initial sm:w-56 bg-purple-300/70 rounded-xl" />
                        </div>

                        {/* Trust badges row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-purple-100">
                            {[1, 2, 3].map((badge) => (
                                <div key={badge} className="flex items-center gap-2.5">
                                    <div className="w-5 h-5 bg-purple-200/60 rounded-full shrink-0" />
                                    <div className="h-3.5 bg-purple-200/50 w-24 rounded" />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Reviews section skeleton banner placeholder */}
                <div className="pt-12 border-t border-purple-100 space-y-6">
                    <div className="h-7 bg-purple-200/70 w-48 rounded-lg" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((review) => (
                            <div key={review} className="p-5 rounded-2xl bg-white border border-purple-100/60 space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 bg-purple-200/60 w-28 rounded" />
                                    <div className="h-3 bg-purple-100 w-16 rounded" />
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div key={star} className="w-3.5 h-3.5 bg-purple-200/40 rounded-full" />
                                    ))}
                                </div>
                                <div className="h-3.5 bg-purple-200/40 w-full rounded" />
                                <div className="h-3.5 bg-purple-200/30 w-3/4 rounded" />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetailsLoader;