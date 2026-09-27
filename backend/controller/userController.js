import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import HandleError from "../helpers/HandleError.js";
import User from "../models/userModel.js";
import { sendJwtToken, clearJwtToken } from "../helpers/JwtToken.js";
import { sendMail } from "../helpers/SendMail.js";

// register a new user
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, avatar } = req.body;

        if (!name) return next(new HandleError("Name cannot be empty", 400));
        if (!email) return next(new HandleError("Email cannot be empty", 400));
        if (!password) return next(new HandleError("Password cannot be empty", 400));

        // Check if user already exists to avoid MongoDB duplicate key crash (code 11000)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new HandleError("User already exists with this email", 400));
        }

        let avatarData = {
            public_id: "default_avatar",
            url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80"
        };

        // Upload to Cloudinary only if a valid base64 data URI was provided
        if (avatar && typeof avatar === "string" && avatar.startsWith("data:image")) {
            try {
                const myCloud = await cloudinary.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                    crop: "scale"
                });

                avatarData = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                // Graceful fallback to default avatar so registration does not fail
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            avatar: avatarData
        });

        sendJwtToken(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// login a user
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new HandleError("Email or Password cannot be empty", 400));
        }

        // Must explicitly select password because select: false is set in User schema
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new HandleError("Invalid Email or Password", 401));
        }

        const isValidPassword = await user.verifyPassword(password);
        if (!isValidPassword) {
            return next(new HandleError("Invalid Email or Password", 401));
        }

        sendJwtToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// logout user
export const logoutUser = async (req, res) => {
    clearJwtToken(200, res);
};

// reset password
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new HandleError("User does not exist", 400));

    let resetToken;

    try {
        resetToken = user.createPasswordResetToken();
        await user.save();
    } catch (err) {
        console.log(err);
        return next(new HandleError(`Couldn't save reset token, Try again later...`, 500));
    }

    const resetPasswordUrl = `${req.protocol}://${req.host}/reset/${resetToken}`;
    const message = `Reset your password using this link below:\n${resetPasswordUrl}\n\nThe link expires in 30 mins.\n\nIf this wasn't you please ignore this mail.`;
    const htmlMessage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; width: 100% !important; height: 100% !important;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background-color: #f4f4f7; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 570px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); overflow: hidden;">
                        <tr>
                            <td style="padding: 45px;">
                                <h1 style="margin-top: 0; color: #333333; font-size: 22px; font-weight: bold; text-align: left;">Reset Your Password</h1>
                                <p style="margin: 20px 0; font-size: 16px; line-height: 24px; color: #51545e;">You recently requested to reset your password. Click the button below to proceed. <strong>The link expires in 30 minutes.</strong></p>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto; width: 100%; text-align: center;">
                                    <tr>
                                        <td>
                                            <a href="${resetPasswordUrl}" target="_blank" style="background-color: #3869d4; border-radius: 5px; color: #ffffff; display: inline-block; font-size: 15px; font-weight: bold; line-height: 45px; text-decoration: none; width: 200px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">Reset Password</a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="margin: 25px 0 0 0; font-size: 14px; line-height: 20px; color: #74787e;">If you’re having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                                <p style="margin: 10px 0 0 0; font-size: 13px; line-height: 18px; word-break: break-all;"><a href="${resetPasswordUrl}" target="_blank" style="color: #3869d4;">${resetPasswordUrl}</a></p>
                                <hr style="border: none; border-top: 1px solid #e8e8f0; margin: 30px 0;">
                                <p style="margin: 0; font-size: 14px; line-height: 20px; color: #999999; font-style: italic;">If this wasn't you, please ignore this email safely. Your password will remain unchanged.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        await sendMail({ email: user.email, subject: "Password reset request", message, htmlMessage });
        res.status(200).json({ success: true, message: `Email successfully sent to ${user.email}, Check your mail` });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new HandleError(`Email couldn't be sent to ${user.email}, Please try again later...`, 500));
    }
};

// reset password while they get mail
export const resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return next(new HandleError(`Invalid or reset code expired`, 400));

        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) return next(new HandleError(`Password doesn't match, please check both passwords`, 400));

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Password changed successfully!" });
    } catch (err) {
        next(err);
    }
};

// getting user profile
export const profileDetails = async (req, res, next) => {
    try {
        // req.user is populated by isAuthenticatedUser middleware
        if (!req.user || !req.user.id) {
            return next(new HandleError("Please login to view profile details", 401));
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HandleError("User not found", 404));
        }

        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// update password
export const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findById(req.user.id).select("+password");
        const isCorrect = await user.verifyPassword(oldPassword);

        if (!isCorrect) return next(new HandleError("Incorrect old password", 400));
        if (newPassword !== confirmPassword) return next(new HandleError("Confirm password must be same as New password", 400));

        user.password = newPassword;
        await user.save();

        sendJwtToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// update profile details
export const updateProfile = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;

        const updatedData = {
            name: name?.trim(),
            email: email?.trim()
        };

        // If a new base64 avatar was selected
        if (avatar && typeof avatar === "string" && avatar.startsWith("data:image")) {
            const user = await User.findById(req.user.id);

            // Destroy previous image from Cloudinary if not default
            if (user.avatar?.public_id && user.avatar.public_id !== "default_avatar") {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            }

            // Upload new image to Cloudinary
            const myCloud = await cloudinary.uploader.upload(avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale"
            });

            updatedData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }

        const user = await User.findByIdAndUpdate(req.user.id, updatedData, {
            returnDocument: "after",
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (err) {
        next(err);
    }
};