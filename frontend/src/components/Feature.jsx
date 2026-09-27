import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBasket, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import CommerciaLogo from "/images/logo.png";
import { Rating } from "./ui";
import { addCartItem } from "../features/cart/cartSlice.js";

const Feature = ({ products }) => {
    const dispatch = useDispatch();
    const { cartItems, loading: cartLoading } = useSelector((state) => state.cart);

    const [featureProduct, setFeatureProduct] = useState(null);
    const [rating, setRating] = useState(0);

    // random feature product while dom loads
    useEffect(() => {
        const getRandomProduct = () => {
            if (products && products.length > 0 && !featureProduct) {
                const randomNum = Math.floor(Math.random() * products.length);
                const randomProduct = products[randomNum];
                setFeatureProduct(randomProduct);
                setRating(randomProduct?.ratings || 0);
            }
        };
        getRandomProduct();
    }, [products, featureProduct]);

    const handleAddToCart = () => {
        if (!featureProduct) return;

        if (!featureProduct?.stock || featureProduct.stock <= 0) {
            toast.error("This product is currently out of stock", { position: "bottom-center" });
            return;
        }

        // Check if item already exists in cart to increment or initialize
        const existingItem = cartItems?.find((item) => item.product === featureProduct._id);
        const currentQty = existingItem ? existingItem.quantity : 0;
        const newQty = currentQty + 1;

        if (newQty > featureProduct.stock) {
            toast.error("Cannot exceed available stock limit", { position: "bottom-center" });
            return;
        }

        dispatch(addCartItem({ id: featureProduct._id, quantity: newQty }));
    };

    return (
        <>
            {featureProduct && (
                <section className="w-full pt-5 pb-10">
                    <div className="custom-container">

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-linear-to-b lg:bg-linear-to-r from-white to-purple-600/50 rounded-3xl p-6 md:p-12 shadow-lg border border-slate-100 relative overflow-hidden">

                            {/* company logo */}
                            <div className="absolute top-6 left-6 h-8 opacity-80 z-10">
                                <img src={CommerciaLogo} alt="Commercia" className="h-full object-contain" />
                            </div>

                            {/* product details */}
                            <div className="lg:col-span-5 space-y-6 pt-10 lg:pt-0 flex flex-col justify-center">
                                <div className="space-y-5">
                                    <span className="text-xs font-semibold tracking-widest text-purple-600 uppercase">
                                        Featured Product
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-5">
                                        {featureProduct.name}
                                    </h3>
                                </div>

                                <p className="text-base text-slate-600 leading-relaxed max-w-md">
                                    {featureProduct.description}
                                </p>

                                {/* rating block */}
                                <div className="flex items-center gap-2 text-sm text-slate-500 border-y border-slate-100 py-3 w-fit">
                                    <Rating value={rating} onRatingChange={(rate) => setRating(rate)} />
                                    <span className="font-medium text-slate-700 ml-1">
                                        ({featureProduct.numOfReviews} {featureProduct.numOfReviews <= 1 ? 'review' : 'reviews'})
                                    </span>
                                </div>

                                {/* pricing and action */}
                                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider">Price</span>
                                        <span className="text-3xl font-bold text-slate-900">
                                            ${featureProduct.price}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={!featureProduct?.stock || featureProduct.stock <= 0 || cartLoading}
                                        className="flex items-center justify-center gap-3 bg-slate-950 hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer group sm:ml-auto lg:ml-0 w-full sm:w-auto"
                                    >
                                        {cartLoading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                <span>Adding...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBasket size={20} className="transition-transform group-hover:-translate-y-0.5" />
                                                <span>
                                                    {featureProduct?.stock > 0 ? "Add To Cart" : "Out of Stock"}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* product image */}
                            <div className="lg:col-span-7 w-full aspect-square md:aspect-4/3 lg:h-125 rounded-2xl overflow-hidden bg-slate-100 relative group shadow-inner">
                                <img
                                    src={featureProduct.image[0].url}
                                    alt={featureProduct.name}
                                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                {/* overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/10 to-transparent pointer-events-none" />
                            </div>

                        </div>

                    </div>
                </section>
            )}
        </>
    );
};

export default Feature;