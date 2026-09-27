import jwt from "jsonwebtoken";

import HandleError from "./HandleError.js";
import User from "../models/userModel.js";

// user authentication
export const verifyUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        // if cookie not defined
        if (!token) {
            return next(new HandleError("Access denied! Please login to access", 401));
        }

        // Verify token with secret key
        const secretKey = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
        const decodedData = jwt.verify(token, secretKey);

        // Fetch user by ID stored in token payload
        req.user = await User.findById(decodedData.id);

        if (!req.user) {
            return next(new HandleError("User no longer exists. Please login again.", 401));
        }

        next();
    } catch (error) {
        // Catches expired or malformed JWT errors and returns clean 401 instead of crashing with 500
        return next(new HandleError("Invalid or expired session. Please login again.", 401));
    }
};

// user authorization whom access resources
export const roleBaseAccess = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new HandleError(`Role: ${req.user?.role || "user"} is not allowed to access this resource`, 403));
        }
        next();
    };
};