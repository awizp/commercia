import { Link } from "react-router";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

import { PageTitle, ScrollToTop } from "../components/ui";
import { Navbar, Footer } from "../components";

const OrderSuccess = () => {
    return (
        <>
            <ScrollToTop />
            <PageTitle title="Order Placed Successfully | Commercia" />
            <Navbar />

            <main className="w-full min-h-screen bg-purple-50/20 pt-30 pb-20 px-4 sm:px-6 flex items-center justify-center">
                <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-purple-100/70 shadow-xl text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                        <CheckCircle size={44} />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Payment Successful!
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                            Thank you for your purchase! Your order has been placed and is being prepared for shipment.
                        </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-3">
                        <Link
                            to="/orders"
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer"
                        >
                            <Package size={17} />
                            <span>View My Orders</span>
                        </Link>
                        <Link
                            to="/products"
                            className="w-full flex items-center justify-center gap-2 py-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-sm font-semibold transition"
                        >
                            <span>Continue Shopping</span>
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default OrderSuccess;