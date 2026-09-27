import express from "express";

import { createProductReview, getAllProducts, getSingleProduct, deleteUserReview } from "../controller/productController.js";
import { verifyUser } from "../helpers/UserAuth.js";

const router = express.Router();

// user routes
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/review")
    .put(verifyUser, createProductReview)
    .delete(verifyUser, deleteUserReview);

export default router;
