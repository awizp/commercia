import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            maxLength: [25, "Invalid name! Please enter your name fewer than 25 characters"],
            minLength: [3, "Name should be contain more than 3 characters"]
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            validate: [validator.isEmail, "Please enter valid email address"]
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minLength: [8, "Password should be contain 8 characters"],
            select: false
        },
        avatar: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        role: {
            type: String,
            default: "user"
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    { timestamps: true }
);

// save password with hashing before user saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// create jwt token when user register
userSchema.methods.getJwtToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// verify password by bcrypt
userSchema.methods.verifyPassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};

// create token by crypto for email validation and reset password
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken;
};

export default mongoose.model("User", userSchema);