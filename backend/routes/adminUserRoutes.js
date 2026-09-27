import express from "express";

import { roleBaseAccess, verifyUser } from "../helpers/UserAuth.js";
import {
    deleteUser,
    getAdminSingleUser,
    getAdminUsers,
    updateUserRole
} from "../controller/adminUserController.js";

const router = express.Router();

router.route("/users").get(verifyUser, roleBaseAccess('admin'), getAdminUsers);
router.route("/user/:id")
    .get(verifyUser, roleBaseAccess('admin'), getAdminSingleUser)
    .put(verifyUser, roleBaseAccess('admin'), updateUserRole)
    .delete(verifyUser, roleBaseAccess('admin'), deleteUser);

export default router;