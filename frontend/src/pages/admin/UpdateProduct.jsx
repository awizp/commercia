import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Package, DollarSign, Layers, Database, FileText, UploadCloud, X, ArrowLeft, Loader2, Edit3, Tag, Percent } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../../components/ui";
import { Navbar, Footer } from "../../components";
import { Sidebar } from "../../components/admin";
import { updateProduct, resetAdminProductStatus, clearAdminProductErrors } from "../../features/admin/adminProductSlice.js";

const CATEGORY_SUGGESTIONS = [
    "Electronics",
    "Laptops",
    "Smartphones",
    "Headphones",
    "Smartwatches",
    "Cameras",
    "Gaming",
    "Monitors",
    "Accessories"
];

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading: updateLoading, isUpdated, error } = useSelector((state) => state.adminProduct);

    const [isFetching, setIsFetching] = useState(true);
    const [name, setName] = useState("");
    const [mrp, setMrp] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [oldImages, setOldImages] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    // Fetch existing product data on mount
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setIsFetching(true);
                const { data } = await axios.get(`/api/v1/product/${id}`);
                const prod = data.product;

                if (prod) {
                    setName(prod.name || "");
                    setMrp(prod.mrp ? String(prod.mrp) : "");
                    setPrice(prod.price ? String(prod.price) : "");
                    setDescription(prod.description || "");
                    setCategory(prod.category || "");
                    setStock(prod.stock !== undefined ? String(prod.stock) : "0");

                    // Handle images array
                    const existingImgs = Array.isArray(prod.image)
                        ? prod.image.map((img) => (typeof img === "string" ? img : img.url))
                        : Array.isArray(prod.images)
                            ? prod.images.map((img) => (typeof img === "string" ? img : img.url))
                            : [];

                    setOldImages(existingImgs);
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load product details", { position: "bottom-center" });
                navigate("/admin/products");
            } finally {
                setIsFetching(false);
            }
        };

        if (id) fetchProductDetails();
    }, [id, navigate]);

    // Watch update state & handle redirection
    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center" });
            dispatch(clearAdminProductErrors());
        }

        if (isUpdated) {
            toast.success("Product updated successfully!", { position: "bottom-center" });
            dispatch(resetAdminProductStatus());
            navigate("/admin/products");
        }
    }, [error, isUpdated, dispatch, navigate]);

    // Handle new image selection
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const handleRemoveNewImage = (indexToRemove) => {
        setImagesPreview((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const discountPercent =
        Number(mrp) > 0 && Number(price) > 0 && Number(mrp) >= Number(price)
            ? Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)
            : 0;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter product name", { position: "bottom-center" });
            return;
        }

        if (!mrp || Number(mrp) <= 0) {
            toast.error("Please enter a valid MRP", { position: "bottom-center" });
            return;
        }

        if (!price || Number(price) <= 0) {
            toast.error("Please enter a valid selling price", { position: "bottom-center" });
            return;
        }

        if (Number(price) > Number(mrp)) {
            toast.error("Selling price cannot be higher than MRP", { position: "bottom-center" });
            return;
        }

        if (!category.trim()) {
            toast.error("Please enter product category", { position: "bottom-center" });
            return;
        }

        if (stock === "" || Number(stock) < 0) {
            toast.error("Please enter valid stock quantity", { position: "bottom-center" });
            return;
        }

        if (!description.trim()) {
            toast.error("Please enter product description", { position: "bottom-center" });
            return;
        }

        const productData = {
            name: name.trim(),
            mrp: Number(mrp),
            price: Number(price),
            description: description.trim(),
            category: category.trim(),
            stock: Number(stock)
        };

        // If new images were selected, include them in the payload
        if (images.length > 0) {
            productData.images = images;
        }

        dispatch(updateProduct({ id, productData }));
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Update Product | Commercia Admin" />
            <Navbar />

            <div className="w-full min-h-screen bg-purple-50/20 pt-28 pb-16 flex flex-col">
                <div className="custom-container max-w-7xl mx-auto flex-1 flex flex-col md:flex-row gap-6 px-4 sm:px-6">

                    {/* Responsive Admin Sidebar */}
                    <div className="w-full md:w-auto shrink-0 md:sticky md:top-28 md:self-start md:rounded-3xl md:overflow-hidden md:border md:border-purple-100/70 md:shadow-sm md:bg-white">
                        <Sidebar />
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 space-y-6">

                        {/* Top Header Card */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100/70 shadow-sm flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                    <span>Update Product</span>
                                    <Edit3 size={20} className="text-purple-600" />
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                    Modify pricing, inventory stock, description, or photos
                                </p>
                            </div>

                            <Link
                                to="/admin/products"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
                            >
                                <ArrowLeft size={16} />
                                <span>Back to Catalog</span>
                            </Link>
                        </div>

                        {isFetching ? (
                            <div className="py-24 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-purple-100/70 shadow-sm">
                                <Loader2 size={32} className="animate-spin text-purple-600" />
                                <p className="text-xs font-semibold text-slate-400">Loading product information...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/70 shadow-sm space-y-6">

                                {/* Product Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Product Title <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-slate-400">
                                            <Package size={17} />
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Product name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Pricing Grid: MRP, Selling Price, and Stock */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* MRP */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                                MRP ($) <span className="text-red-500">*</span>
                                            </label>
                                            <span className="text-[10px] text-slate-400 font-semibold">Max Retail Price</span>
                                        </div>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-slate-400">
                                                <Tag size={17} />
                                            </span>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                step="0.01"
                                                placeholder="1199.00"
                                                value={mrp}
                                                onChange={(e) => setMrp(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    {/* Selling Price */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Selling Price ($) <span className="text-red-500">*</span>
                                            </label>
                                            {discountPercent > 0 && (
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                                    <Percent size={10} /> {discountPercent}% OFF
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-slate-400">
                                                <DollarSign size={17} />
                                            </span>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                step="0.01"
                                                placeholder="999.00"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    {/* Stock Quantity */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Stock Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-slate-400">
                                                <Database size={17} />
                                            </span>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                placeholder="25"
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Input + Suggestions */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-slate-400">
                                            <Layers size={17} />
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                        />
                                    </div>

                                    <div className="pt-1 space-y-1.5">
                                        <p className="text-[11px] text-slate-400 font-medium">
                                            Suggestions:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {CATEGORY_SUGGESTIONS.map((item) => (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() => setCategory(item)}
                                                    className={`text-xs px-3 py-1 rounded-xl font-semibold border transition cursor-pointer ${category.toLowerCase() === item.toLowerCase()
                                                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                                                        : "bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 border-slate-200/80"
                                                        }`}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Product Description <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative flex">
                                        <span className="absolute left-4 top-3.5 text-slate-400">
                                            <FileText size={17} />
                                        </span>
                                        <textarea
                                            rows="4"
                                            required
                                            placeholder="Enter description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Current Photos & Upload New */}
                                <div className="space-y-3">
                                    {oldImages.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Current Photos ({oldImages.length})
                                            </p>
                                            <div className="flex flex-wrap gap-2.5">
                                                {oldImages.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="w-16 h-16 rounded-2xl overflow-hidden border border-purple-100 bg-slate-50 shrink-0"
                                                    >
                                                        <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2 pt-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Replace / Add Photos ({imagesPreview.length})
                                        </label>

                                        <label className="border-2 border-dashed border-purple-200/80 hover:border-purple-500 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 bg-purple-50/20 hover:bg-purple-50/40 transition cursor-pointer text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                                                <UploadCloud size={24} />
                                            </div>
                                            <p className="text-xs sm:text-sm font-bold text-slate-800">
                                                Upload new product photos (optional)
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImagesChange}
                                                className="hidden"
                                            />
                                        </label>

                                        {imagesPreview.length > 0 && (
                                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                                                {imagesPreview.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative group aspect-square rounded-2xl overflow-hidden border border-purple-200 shadow-xs bg-slate-50"
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`New upload ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveNewImage(idx)}
                                                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/70 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer"
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        {updateLoading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                <span>Saving Changes...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Edit3 size={17} />
                                                <span>Update Product</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                            </form>
                        )}

                    </main>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default UpdateProduct;