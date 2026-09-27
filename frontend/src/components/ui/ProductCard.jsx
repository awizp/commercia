import { useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBasket, Eye } from "lucide-react";
import toast from "react-hot-toast";

import Rating from "./Rating";
import { addCartItem } from "../../features/cart/cartSlice.js";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const [rating, setRating] = useState(product?.ratings || 0);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product?.stock || product.stock <= 0) {
            toast.error("This product is currently out of stock", { position: "bottom-center" });
            return;
        }

        // Check if item already exists in cart to increment or initialize
        const existingItem = cartItems?.find((item) => item.product === product._id);
        const currentQty = existingItem ? existingItem.quantity : 0;
        const newQty = currentQty + 1;

        if (newQty > product.stock) {
            toast.error("Cannot exceed available stock limit", { position: "bottom-center" });
            return;
        }

        dispatch(addCartItem({ id: product._id, quantity: newQty }));
    };

    return (
        <div className="w-full space-y-5 group cursor-pointer" title={product?.name}>

            {/* product image */}
            <div className="w-full h-70 md:h-75 overflow-hidden rounded-2xl shadow relative">
                <img
                    src={product.image[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* overlay and product details */}
                <div className="absolute inset-0 bg-linear-to-b from-black/5 to-black/50 md:to-black/95 flex flex-col justify-end p-4 transition-transform duration-300 translate-y-0 md:translate-y-full group-hover:translate-y-0">

                    <p className="text-slate-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 hidden md:line-clamp-2">
                        {product.description}
                    </p>

                    {/* desktop buttons */}
                    <div className="flex md:flex-col gap-2 w-full">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={!product?.stock || product.stock <= 0}
                            className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-xl transition flex-center gap-2"
                        >
                            <ShoppingBasket size={18} />
                            <span className="hidden md:block">
                                {product?.stock > 0 ? "Add to Cart" : "Out of Stock"}
                            </span>
                        </button>
                        <Link
                            to={`/product/${product._id}`}
                            className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 rounded-xl transition border border-white/40 flex-center gap-2"
                        >
                            <Eye size={18} />
                            <span className="hidden md:block">View Product</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* product details */}
            <div className="w-full space-y-2 px-2">
                <h3 className="line-clamp-1 font-medium">{product.name}</h3>
                <div className="text-xs text-slate-600 flex justify-between items-center gap-4">
                    <Rating value={rating} onRatingChange={(rate) => setRating(rate)} /> ({product.numOfReviews} {product.numOfReviews <= 1 ? 'review' : 'reviews'})
                </div>
                <p className="text-purple-900 font-semibold text-lg">${product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;