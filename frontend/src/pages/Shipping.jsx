import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Phone, Building, Globe, Mailbox, Compass, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { PageTitle, ScrollToTop } from "../components/ui";
import { Navbar, Footer, CheckoutSteps } from "../components";
import { saveShippingInfo } from "../features/cart/cartSlice.js";

const Shipping = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { shippingInfo = {}, cartItems = [] } = useSelector((state) => state.cart || {});

    const [address, setAddress] = useState(shippingInfo.address || "");
    const [city, setCity] = useState(shippingInfo.city || "");
    const [state, setState] = useState(shippingInfo.state || "");
    const [pincode, setPincode] = useState(shippingInfo.pincode || shippingInfo.postalCode || "");
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
    const [country, setCountry] = useState(shippingInfo.country || "India");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error("Your cart is empty. Add products first.", { position: "bottom-center" });
            navigate("/products");
            return;
        }

        if (!state.trim()) {
            toast.error("Please enter your State", { position: "bottom-center" });
            return;
        }

        if (phoneNo.toString().trim().length < 10) {
            toast.error("Phone number must be at least 10 digits", { position: "bottom-center" });
            return;
        }

        dispatch(saveShippingInfo({
            address,
            city,
            state: state.trim(),
            pincode: Number(pincode),
            phoneNo: Number(phoneNo),
            country
        }));

        navigate("/order/confirm");
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Shipping Address | Commercia" />
            <Navbar />

            <main className="w-full min-h-screen bg-purple-50/20 pt-30 pb-20 px-4 sm:px-6">
                <div className="custom-container max-w-3xl mx-auto space-y-6">

                    <CheckoutSteps shipping={true} />

                    <div className="bg-white rounded-3xl p-7 sm:p-10 border border-purple-100/70 shadow-xl space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Delivery Address
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                    Where should we deliver your order?
                                </p>
                            </div>
                            <Link
                                to="/cart"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
                            >
                                <ArrowLeft size={15} />
                                <span>Back to Cart</span>
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Street Address */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    Street Address
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-slate-400">
                                        <MapPin size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="123 Anna Salai, Suite 4B"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* City & State */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        City
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-slate-400">
                                            <Building size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="Chennai"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        State
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-slate-400">
                                            <Compass size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            placeholder="Tamil Nadu"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* PIN Code, Phone, Country */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Pincode
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-slate-400">
                                            <Mailbox size={18} />
                                        </span>
                                        <input
                                            type="number"
                                            required
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            placeholder="600001"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Phone Number
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-slate-400">
                                            <Phone size={18} />
                                        </span>
                                        <input
                                            type="tel"
                                            required
                                            value={phoneNo}
                                            onChange={(e) => setPhoneNo(e.target.value)}
                                            placeholder="9876543210"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Country
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-slate-400">
                                            <Globe size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            placeholder="India"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer"
                            >
                                <span>Continue to Order Review</span>
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
};

export default Shipping;