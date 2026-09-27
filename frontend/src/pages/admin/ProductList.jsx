import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Package, Plus, Trash2, Edit, Search, AlertCircle, Loader2, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../../components/ui";
import { Navbar, Footer } from "../../components";
import { Sidebar } from "../../components/admin";
import { getAdminProducts, deleteProduct, resetAdminProductStatus, clearAdminProductErrors } from "../../features/admin/adminProductSlice.js";

const PAGE_BATCH_SIZE = 10;

const ProductList = () => {
    const dispatch = useDispatch();

    const {
        products = [],
        loading = false,
        error = null,
        isDeleted = false,
        message = null
    } = useSelector((state) => state.adminProduct || {});

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [visibleCount, setVisibleCount] = useState(PAGE_BATCH_SIZE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(clearAdminProductErrors());
        }

        if (isDeleted) {
            toast.success(message || "Product deleted successfully", { position: "bottom-center" });
            dispatch(resetAdminProductStatus());
        }
    }, [error, isDeleted, message, dispatch]);

    useEffect(() => {
        const paginateHandle = () => setVisibleCount(PAGE_BATCH_SIZE);
        paginateHandle();
    }, [searchTerm, selectedCategory]);

    const handleDeleteProduct = (id, name) => {
        if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
            dispatch(deleteProduct(id));
        }
    };

    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        toast.success("Product ID copied!", { position: "bottom-center" });
        setTimeout(() => setCopiedId(null), 2000);
    };

    const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleScroll = useCallback(() => {
        if (visibleCount >= filteredProducts.length || isLoadingMore) return;

        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollY + windowHeight >= documentHeight - 150) {
            setIsLoadingMore(true);
            setTimeout(() => {
                setVisibleCount((prev) => Math.min(prev + PAGE_BATCH_SIZE, filteredProducts.length));
                setIsLoadingMore(false);
            }, 250);
        }
    }, [visibleCount, filteredProducts.length, isLoadingMore]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const getProductImage = (product) => {
        if (!product) return "";
        if (Array.isArray(product.image) && product.image.length > 0) {
            const first = product.image[0];
            return typeof first === "string" ? first : (first?.url || "");
        }
        if (Array.isArray(product.images) && product.images.length > 0) {
            const first = product.images[0];
            return typeof first === "string" ? first : (first?.url || "");
        }
        if (typeof product.image === "string") return product.image;
        if (product.image?.url) return product.image.url;
        return "";
    };

    const displayedProducts = filteredProducts.slice(0, visibleCount);

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Products Management | Commercia Admin" />
            <Navbar />

            <div className="w-full min-h-screen bg-purple-50/20 pt-28 pb-16 flex flex-col">
                <div className="custom-container max-w-7xl mx-auto flex-1 flex flex-col md:flex-row gap-6 px-4 sm:px-6">

                    <div className="w-full md:w-auto shrink-0 md:sticky md:top-28 md:self-start md:rounded-3xl md:overflow-hidden md:border md:border-purple-100/70 md:shadow-sm md:bg-white">
                        <Sidebar />
                    </div>

                    <main className="flex-1 space-y-6 overflow-hidden">

                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100/70 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    Product Catalog
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                    View, organize, update, or remove products from your inventory
                                </p>
                            </div>

                            <Link
                                to="/admin/product/new"
                                className="inline-flex items-center justify-center gap-2 py-3 px-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer self-start sm:self-auto"
                            >
                                <Plus size={16} />
                                <span>Add New Product</span>
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl p-4 border border-purple-100/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, ID, or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                />
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-purple-600 transition capitalize cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat === "all" ? "All Categories" : cat}
                                        </option>
                                    ))}
                                </select>

                                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                                    Showing: <strong className="text-purple-600 font-bold">{displayedProducts.length}</strong> of {filteredProducts.length}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-purple-100/70 shadow-sm overflow-hidden">
                            {loading && products.length === 0 ? (
                                <div className="py-24 flex flex-col items-center justify-center gap-3">
                                    <Loader2 size={32} className="animate-spin text-purple-600" />
                                    <p className="text-xs font-semibold text-slate-400">Loading inventory data...</p>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="py-20 px-4 text-center space-y-3">
                                    <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto">
                                        <AlertCircle size={26} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-slate-800">No matching products found</h3>
                                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                            Try adjusting your search criteria or add new items to your store.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                        <thead>
                                            <tr className="bg-purple-50/60 text-slate-500 text-[11px] uppercase tracking-wider border-b border-purple-100/70">
                                                <th className="py-3.5 px-4 font-bold">Product</th>
                                                <th className="py-3.5 px-4 font-bold">Category</th>
                                                <th className="py-3.5 px-4 font-bold">Price</th>
                                                <th className="py-3.5 px-4 font-bold">Stock</th>
                                                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {displayedProducts.map((product) => {
                                                const imageUrl = getProductImage(product);
                                                const isOutOfStock = Number(product.stock || 0) <= 0;

                                                return (
                                                    <tr key={product._id} className="hover:bg-purple-50/20 transition">
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/70 overflow-hidden shrink-0 flex items-center justify-center">
                                                                    {imageUrl ? (
                                                                        <img
                                                                            src={imageUrl}
                                                                            alt={product.name}
                                                                            loading="lazy"
                                                                            onError={(e) => {
                                                                                e.currentTarget.style.display = "none";
                                                                                e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                                                            }}
                                                                            className="w-full h-full object-cover object-center"
                                                                        />
                                                                    ) : null}
                                                                    <div className={`w-full h-full flex items-center justify-center text-slate-300 ${imageUrl ? "hidden" : ""}`}>
                                                                        <Package size={18} />
                                                                    </div>
                                                                </div>

                                                                {/* Product details & Clickable Copy ID */}
                                                                <div className="overflow-hidden space-y-1">
                                                                    <p className="font-bold text-slate-800 truncate max-w-xs sm:max-w-sm">
                                                                        {product.name}
                                                                    </p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleCopyId(product._id)}
                                                                        title="Click to copy full Product ID"
                                                                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-purple-50 text-slate-500 hover:text-purple-600 font-mono text-[10px] transition cursor-pointer"
                                                                    >
                                                                        {copiedId === product._id ? (
                                                                            <>
                                                                                <Check size={11} className="text-emerald-600" />
                                                                                <span className="text-emerald-600 font-bold">Copied!</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Copy size={11} />
                                                                                <span>{product._id}</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="py-3.5 px-4 text-slate-600 font-medium capitalize">
                                                            {product.category || "Uncategorized"}
                                                        </td>

                                                        <td className="py-3.5 px-4 font-extrabold text-purple-700">
                                                            ${Number(product.price || 0).toFixed(2)}
                                                        </td>

                                                        <td className="py-3.5 px-4">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${isOutOfStock
                                                                    ? "bg-red-50 text-red-600 border border-red-200/60"
                                                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                                                    }`}
                                                            >
                                                                {isOutOfStock ? "Out of Stock" : `${product.stock} in Stock`}
                                                            </span>
                                                        </td>

                                                        <td className="py-3.5 px-4 text-right">
                                                            <div className="inline-flex items-center gap-1.5">
                                                                <Link
                                                                    to={`/admin/product/${product._id}`}
                                                                    className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                                                                    title="Edit Product"
                                                                >
                                                                    <Edit size={16} />
                                                                </Link>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteProduct(product._id, product.name)}
                                                                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                                                    title="Delete Product"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {isLoadingMore && (
                                <div className="py-4 flex justify-center items-center gap-2 text-xs font-semibold text-purple-600 bg-purple-50/40 border-t border-purple-100/50">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Loading next 10 products...</span>
                                </div>
                            )}

                            {!isLoadingMore && displayedProducts.length === filteredProducts.length && filteredProducts.length > 0 && (
                                <div className="py-4 text-center text-xs text-slate-400 border-t border-slate-100">
                                    Showing all {filteredProducts.length} items
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

export default ProductList;