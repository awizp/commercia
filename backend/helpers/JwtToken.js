// create token while register and login and saved token in cookies
export const sendJwtToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        expires: new Date(Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax"
    };

    res.status(statusCode).cookie("token", token, options).json({ success: true, user, token });
};

// clear cookies while logged out
export const clearJwtToken = (statusCode, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax"
    };

    res.status(statusCode).cookie("token", null, options).json({ success: true, message: "Logged out successfully!" });
};