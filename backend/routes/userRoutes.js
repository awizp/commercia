import express from 'express';

import {
    forgotPassword,
    loginUser,
    logoutUser,
    profileDetails,
    registerUser,
    resetPassword,
    updatePassword,
    updateProfile
} from '../controller/userController.js';
import { verifyUser } from "../helpers/UserAuth.js";

const router = express.Router();

// user routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forget").post(forgotPassword);
router.route("/reset/:token").post(resetPassword);
router.route("/profile").get(verifyUser, profileDetails);
router.route("/update/password").put(verifyUser, updatePassword);
router.route("/update/profile").put(verifyUser, updateProfile);

export default router;