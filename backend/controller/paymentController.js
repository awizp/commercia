import Razorpay from "razorpay";
import crypto from "crypto";

import HandleError from "../helpers/HandleError.js";

// Helper function ensures dotenv is loaded before instantiating
const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET,
        currency: "USD"
    });
};

// Send Razorpay Public Key ID to frontend
export const sendRazorpayApiKey = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            apiKey: process.env.RAZORPAY_API_KEY
        });
    } catch (err) {
        next(err);
    }
};

// Create Razorpay Order
export const processPayment = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return next(new HandleError("Amount is required", 400));
        }

        const razorpay = getRazorpayInstance();

        const options = {
            amount: Math.round(Number(amount) * 100), // amount in paise (1 INR = 100 paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order: razorpayOrder
        });
    } catch (err) {
        console.error("Razorpay Order Error:", err);
        return next(new HandleError(err.message || "Payment initiation failed. Try again.", 500));
    }
};

// Verify Payment Signature
export const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return next(new HandleError("Payment details missing for verification", 400));
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return next(new HandleError("Payment verification failed! Invalid signature.", 400));
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            paymentId: razorpay_payment_id
        });
    } catch (err) {
        next(err);
    }
};