import path from "node:path";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import app from "./app.js";
import { connectDB } from "./config/db.js";

// Load config.env only if running locally or if NODE_ENV is not production
if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: path.resolve(import.meta.dirname, "config/config.env") });
}

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Render injects PORT dynamically
const PORT = process.env.PORT || 8000;
const URI = process.env.DB_URI;

// Connect Database
connectDB(URI);

// uncaught error handling
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to uncaught exception`);
    process.exit(1);
});

// Start Server
const server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`)
);

// unhandled rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to unhandled rejection`);

    server.close(() => {
        process.exit(1);
    });
});