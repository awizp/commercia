const ProductsLoader = () => {
    return (
        <div className="w-full min-h-screen bg-purple-50/20 py-12 md:py-20 animate-pulse">
            <div className="custom-container space-y-8">

                {/* Header title & count placeholder */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-100/70 pb-6">
                    <div className="space-y-2">
                        <div className="h-8 bg-purple-300/60 w-48 rounded-xl" />
                        <div className="h-4 bg-purple-200/50 w-32 rounded-md" />
                    </div>
                    {/* Sort dropdown skeleton */}
                    <div className="h-10 bg-purple-200/40 w-40 rounded-xl" />
                </div>

                {/* Main content grid: Sidebar + Products */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Filter Sidebar Skeleton */}
                    <aside className="lg:col-span-3 bg-white p-6 rounded-2xl border border-purple-100/60 shadow-xs space-y-6">
                        {/* Filter Heading */}
                        <div className="h-5 bg-purple-300/60 w-24 rounded-md" />

                        {/* Category filter block */}
                        <div className="space-y-3 pt-2">
                            <div className="h-4 bg-purple-200/60 w-20 rounded" />
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="flex items-center gap-2.5">
                                        <div className="w-4 h-4 rounded bg-purple-200/40 shrink-0" />
                                        <div className="h-3.5 bg-purple-100 w-3/4 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price range filter block */}
                        <div className="space-y-3 pt-4 border-t border-purple-100/70">
                            <div className="h-4 bg-purple-200/60 w-24 rounded" />
                            <div className="h-2 bg-purple-200/40 rounded-full w-full mt-2" />
                            <div className="flex justify-between items-center pt-1">
                                <div className="h-4 bg-purple-100 w-12 rounded" />
                                <div className="h-4 bg-purple-100 w-12 rounded" />
                            </div>
                        </div>

                        {/* Rating filter block */}
                        <div className="space-y-3 pt-4 border-t border-purple-100/70">
                            <div className="h-4 bg-purple-200/60 w-16 rounded" />
                            <div className="space-y-2">
                                {[1, 2, 3].map((rate) => (
                                    <div key={rate} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-purple-200/40" />
                                        <div className="h-3 bg-purple-100 w-20 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* 3 Products Showcase Grid */}
                    <main className="lg:col-span-9">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map((card) => (
                                <div
                                    key={card}
                                    className="w-full bg-white border border-purple-100/60 rounded-2xl p-4 shadow-xs space-y-4"
                                >
                                    {/* Image placeholder */}
                                    <div className="w-full h-64 sm:h-70 bg-purple-200/40 rounded-xl" />

                                    {/* Details */}
                                    <div className="space-y-3 px-1">
                                        {/* Product title */}
                                        <div className="h-4 bg-purple-200/60 rounded w-4/5" />

                                        {/* Rating & Reviews */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <div key={star} className="w-3.5 h-3.5 bg-purple-200/40 rounded-full" />
                                                ))}
                                            </div>
                                            <div className="h-3 bg-purple-100 rounded w-14" />
                                        </div>

                                        {/* Price & Action */}
                                        <div className="flex justify-between items-center pt-2">
                                            <div className="space-y-1">
                                                <div className="h-5 bg-purple-300/70 rounded w-20" />
                                                <div className="h-3 bg-purple-100 rounded w-12" />
                                            </div>
                                            <div className="h-9 w-24 bg-purple-200/50 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>

                </div>

            </div>
        </div>
    );
};

export default ProductsLoader;