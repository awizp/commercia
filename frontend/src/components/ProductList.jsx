import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./ui";

const ProductList = ({ products = [], totalCount = 0, onOpenFilter }) => {
    return (
        <div className="w-full space-y-6">
            {/* Header controls bar */}
            <div className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl shadow-md">
                <div className="flex items-center gap-3">
                    {/* Mobile filter toggle button */}
                    <button
                        type="button"
                        onClick={onOpenFilter}
                        className="lg:hidden flex items-center gap-2 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 py-2 px-3.5 rounded-xl transition cursor-pointer"
                    >
                        <SlidersHorizontal size={15} />
                        <span>Filter</span>
                    </button>

                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Showing <span className="font-semibold text-slate-900">{products.length}</span> of {totalCount} Products
                    </p>
                </div>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="w-full py-20 text-center bg-white rounded-3xl border border-dashed border-purple-100 space-y-2">
                    <p className="text-slate-800 font-semibold text-lg">No products found</p>
                    <p className="text-slate-400 text-sm">Try relaxing your category or price filters.</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;