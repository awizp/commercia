import { useState, useEffect } from "react";
import { Filter, RotateCcw, X } from "lucide-react";

const SidebarFilter = ({
    categories = [],
    selectedCategory = "All",
    onCategoryChange,
    priceRange = 500,
    onPriceChange,
    onReset,
    isOpen,
    setIsOpen
}) => {
    const allCategories = ["All", ...categories.filter(Boolean)];

    // Local state to keep slider visual responsive without triggering fetches on every pixel
    const [tempPrice, setTempPrice] = useState(priceRange);

    // Sync local slider when parent/URL price changes (e.g., on Reset)
    useEffect(() => {
        const priceHandle = () => {
            setTempPrice(priceRange);
        };

        priceHandle();
    }, [priceRange]);

    // Commit change only when user releases the slider
    const handleSliderRelease = () => {
        if (tempPrice !== priceRange) {
            onPriceChange(tempPrice);
        }
    };

    const filterContent = (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Filter size={18} className="text-purple-600" />
                    <span>Filters</span>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setTempPrice(500);
                        onReset();
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 transition cursor-pointer"
                >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Categories
                </h4>
                <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-3 custom-scrollbar">
                    {allCategories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => onCategoryChange(cat)}
                                className={`w-full text-left text-sm py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-between ${isSelected
                                    ? "bg-purple-600 text-white font-medium shadow-sm shadow-purple-200"
                                    : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                                    }`}
                            >
                                <span>{cat}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-4 pt-4 border-t border-purple-100">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Max Price
                    </h4>
                    <span className="text-sm font-bold text-purple-600">
                        ${tempPrice}
                    </span>
                </div>

                <input
                    type="range"
                    min="0"
                    max="500"
                    step="5"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(Number(e.target.value))}
                    onMouseUp={handleSliderRelease}
                    onTouchEnd={handleSliderRelease}
                    onKeyUp={(e) => {
                        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                            handleSliderRelease();
                        }
                    }}
                    className="w-full h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />

                <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>$0</span>
                    <span>$500</span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop View */}
            <aside className="hidden lg:block w-full bg-white p-6 rounded-3xl border border-purple-100 shadow-sm sticky top-28">
                {filterContent}
            </aside>

            {/* Mobile Drawer Overlay */}
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Mobile Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white p-6 z-50 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-slate-400 hover:text-purple-600 rounded-full hover:bg-purple-50 transition cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>
                {filterContent}
            </div>
        </>
    );
};

export default SidebarFilter;