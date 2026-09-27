import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CreditCard, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import CommerciaLogo from "/images/logo.png";
import { PageTitle, ScrollToTop } from "../components/ui";
import { Navbar, Footer, CheckoutSteps } from "../components";
import { clearCart } from "../features/cart/cartSlice.js";
import { createOrder, removeOrderErrors } from "../features/orders/orderSlice.js";

const Payment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isProcessing, setIsProcessing] = useState(false);
    const isPaymentSuccessRef = useRef(false); // Prevents session guard from firing after success

    const { user } = useSelector((state) => state.user);
    const { cartItems = [], shippingInfo = {} } = useSelector((state) => state.cart || {});
    const { error: orderError } = useSelector((state) => state.order || {});

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo") || "{}");

    // Guard against direct page access without prior steps
    useEffect(() => {
        // Skip check if payment was just completed or is currently processing
        if (isPaymentSuccessRef.current || isProcessing) return;

        if (!orderInfo?.totalPrice || cartItems.length === 0) {
            toast.error("Invalid checkout session. Please start over.", { position: "bottom-center" });
            navigate("/cart");
        }
    }, [orderInfo?.totalPrice, cartItems.length, navigate, isProcessing]);

    useEffect(() => {
        const orderSuccessHandle = () => {
            toast.error(orderError, { position: "bottom-center" });
            dispatch(removeOrderErrors());
            setIsProcessing(false);
        };

        if (orderError) {
            orderSuccessHandle();
        }
    }, [orderError, dispatch]);

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            // Fetch Razorpay Public Key
            const { data: keyData } = await axios.get("/api/v1/razorpay/api-key", { withCredentials: true });
            const apiKey = keyData.apiKey;

            // Create Razorpay order from backend
            const { data: orderData } = await axios.post(
                "/api/v1/payment/process",
                { amount: orderInfo.totalPrice },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            const rzpOrder = orderData.order;

            // Configure Razorpay modal options
            const options = {
                key: apiKey,
                amount: rzpOrder.amount,
                currency: "INR",
                name: "Commercia Store",
                description: `Payment for Order #${rzpOrder.id.slice(-6)}`,
                image: CommerciaLogo,
                order_id: rzpOrder.id,
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: shippingInfo?.phoneNo || ""
                },
                theme: {
                    color: "#9333ea"
                },
                handler: async function (response) {
                    try {
                        // Verify payment signature on backend
                        const { data: verifyData } = await axios.post(
                            "/api/v1/payment/verify",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            },
                            {
                                headers: { "Content-Type": "application/json" },
                                withCredentials: true
                            }
                        );

                        if (verifyData.success) {
                            // Set flag so cleanup re-render doesn't trigger the session guard
                            isPaymentSuccessRef.current = true;

                            const finalOrder = {
                                shippingAddress: {
                                    address: shippingInfo.address || "",
                                    city: shippingInfo.city || "",
                                    state: shippingInfo.state || "Tamil Nadu",
                                    country: shippingInfo.country || "India",
                                    pincode: Number(shippingInfo.pincode || shippingInfo.postalCode || 0),
                                    phoneNo: Number(shippingInfo.phoneNo || 0)
                                },
                                orderDetails: cartItems.map((i) => ({
                                    name: i.name,
                                    price: Number(i.price),
                                    quantity: Number(i.quantity),
                                    image: typeof i.image === "string" ? i.image : (i.image?.url || i.images?.[0]?.url || ""),
                                    product: i.product
                                })),
                                itemPrice: Number(orderInfo.itemPrice ?? orderInfo.itemsPrice ?? 0),
                                taxPrice: Number(orderInfo.taxPrice || 0),
                                shippingPrice: Number(orderInfo.shippingPrice || 0),
                                totalPrice: Number(orderInfo.totalPrice || 0),
                                paymentInfo: {
                                    id: response.razorpay_payment_id,
                                    status: "Paid"
                                }
                            };

                            // Save order & clear states
                            await dispatch(createOrder(finalOrder)).unwrap();
                            dispatch(clearCart());
                            sessionStorage.removeItem("orderInfo");

                            toast.success("Payment completed & Order placed!", { position: "bottom-center" });
                            navigate("/order/success");
                        }
                    } catch (err) {
                        isPaymentSuccessRef.current = false;
                        toast.error(err?.response?.data?.message || err || "Payment verification failed", {
                            position: "bottom-center"
                        });
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        toast.error("Payment cancelled by user", { position: "bottom-center" });
                    }
                }
            };

            const razorpayWindow = new window.Razorpay(options);
            razorpayWindow.open();
        } catch (err) {
            console.error("Razorpay initiation error:", err);
            toast.error(err.response?.data?.message || "Could not initiate payment. Try again.", {
                position: "bottom-center"
            });
            setIsProcessing(false);
        }
    };

    return (
        <>
            <ScrollToTop />
            <PageTitle title="Payment | Commercia" />
            <Navbar />

            <main className="w-full min-h-screen bg-purple-50/20 pt-30 pb-20 px-4 sm:px-6">
                <div className="custom-container max-w-2xl mx-auto space-y-6">

                    {/* Step Tracker */}
                    <CheckoutSteps shipping={true} confirmOrder={true} payment={true} />

                    {/* Payment Card */}
                    <div className="bg-white rounded-3xl p-7 sm:p-10 border border-purple-100/70 shadow-xl space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Secure Payment
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                    Complete your purchase using Razorpay Gateway
                                </p>
                            </div>
                            <Link
                                to="/order/confirm"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
                            >
                                <ArrowLeft size={15} />
                                <span>Back to Review</span>
                            </Link>
                        </div>

                        {/* Order Summary Box */}
                        <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-100 space-y-3">
                            <div className="flex justify-between items-center text-xs sm:text-sm text-slate-600">
                                <span>Items Subtotal</span>
                                <span className="font-semibold text-slate-800">
                                    ${(orderInfo?.itemPrice ?? orderInfo?.itemsPrice)?.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm text-slate-600">
                                <span>Estimated Tax (18%)</span>
                                <span className="font-semibold text-slate-800">
                                    ${orderInfo?.taxPrice?.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm text-slate-600">
                                <span>Shipping Fee</span>
                                <span className="font-semibold text-slate-800">
                                    {orderInfo?.shippingPrice === 0 ? "FREE" : `$${orderInfo?.shippingPrice?.toFixed(2)}`}
                                </span>
                            </div>

                            <div className="border-t border-purple-200/60 pt-3 flex justify-between items-center text-base font-bold text-slate-900">
                                <span>Total Payable Amount</span>
                                <span className="text-2xl font-extrabold text-purple-600">
                                    ${orderInfo?.totalPrice?.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Payment Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <CheckCircle2 size={16} className="text-purple-600 shrink-0" />
                                <span>Cards, UPI, NetBanking & Wallets</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <ShieldCheck size={16} className="text-purple-600 shrink-0" />
                                <span>PCI-DSS Compliant Encryption</span>
                            </div>
                        </div>

                        {/* Pay Now Button */}
                        <button
                            type="button"
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl text-base font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Opening Payment Gateway...</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    <span>Pay ${orderInfo?.totalPrice?.toFixed(2)} with Razorpay</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
};

export default Payment;