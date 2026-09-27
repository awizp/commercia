import express from "express";

import { processPayment, verifyPayment, sendRazorpayApiKey } from "../controller/paymentController.js";
import { verifyUser } from '../helpers/UserAuth.js';

const router = express.Router();

router.route("/payment/process").post(verifyUser, processPayment);
router.route("/payment/verify").post(verifyUser, verifyPayment);
router.route("/razorpay/api-key").get(verifyUser, sendRazorpayApiKey);

export default router;