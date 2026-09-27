import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import adminUserRouter from "./routes/adminUserRoutes.js";
import adminProductRouter from "./routes/adminProductRoutes.js";
import adminOrderRouter from "./routes/adminOrderRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import errorHandler from "./middlewares/error.js";

const app = express();

// cors middleware
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS policy violation: Origin not allowed"));
        }
    },
    credentials: true
}));

// mongodb server is slow so using cloudflare dns
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

// JSON and URL encoded body parsers with limits for Base64 avatars
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Cookie parser
app.use(cookieParser());

// Photo upload middleware
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

// User access routers
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

// Admin access routers
app.use("/api/v1/admin", adminUserRouter);
app.use("/api/v1/admin", adminProductRouter);
app.use("/api/v1/admin", adminOrderRouter);

// Razorpay payment routers
app.use("/api/v1", paymentRouter);

// Error handler middleware (must be registered after routes)
app.use(errorHandler);

export default app;