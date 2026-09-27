const HomeLoader = () => {
    return (
        <div className="relative w-full min-h-screen bg-purple-50/30 animate-pulse">

            {/* navbar */}
            <div className="w-full bg-white border-b border-purple-100 py-4 px-4 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="h-7 bg-purple-200/60 w-32 rounded-lg" />
                    <div className="flex gap-4">
                        <div className="h-5 bg-purple-100 w-16 rounded" />
                        <div className="h-5 bg-purple-100 w-16 rounded" />
                        <div className="h-5 bg-purple-100 w-16 rounded" />
                    </div>
                </div>
            </div>

            {/* animated text header */}
            <div className="max-w-7xl mx-auto px-4 mb-10 text-center md:text-left">
                <div className="h-10 bg-purple-300/60 w-3/4 md:w-1/2 rounded-xl mb-3 animate-bounce [animation-duration:2s]" />
                <div className="h-5 bg-purple-200/50 w-1/2 md:w-1/3 rounded-lg mx-auto md:mx-0" />
            </div>

            {/* banner */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="w-full h-32 md:h-40 bg-purple-200/50 rounded-2xl" />
            </div>

            {/* main section */}
            <div className="max-w-7xl mx-auto px-4 mb-16">
                <div className="h-8 bg-purple-200/70 w-48 rounded-lg mb-6" />

                {/* products */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className={`bg-white p-4 border border-purple-100/50 rounded-2xl shadow-sm ${item === 5 ? "hidden lg:block" : ""
                                }`}
                        >
                            <div className="w-full aspect-square bg-purple-200/40 rounded-xl mb-4" />
                            <div className="h-4 bg-purple-200/40 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-purple-100 rounded w-1/2 mb-4" />
                            <div className="flex justify-between items-center mt-2">
                                <div className="h-5 bg-purple-200/60 rounded w-1/4" />
                                <div className="h-8 bg-purple-200/40 rounded-lg w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeLoader;
