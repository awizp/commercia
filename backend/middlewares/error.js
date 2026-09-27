import HandleError from "../helpers/HandleError.js";

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // dublicate key error
    if (err.code === 11000) err = new HandleError(`This ${Object.keys(err.keyValue)} is already taken`, 400);

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};