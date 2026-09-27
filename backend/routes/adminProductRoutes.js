import express from 'express';

import {
    addNewProduct,
    deleteProduct,
    deleteProductReviews,
    getAllProducts,
    getProductReviews,
    updateProduct
} from "../controller/adminProductController.js";
import { roleBaseAccess, verifyUser } from "../helpers/UserAuth.js";

const router = express.Router();

// admin product routes
router.route('/products')
    .get(verifyUser, roleBaseAccess('admin'), getAllProducts);
router.route('/product/add')
    .post(verifyUser, roleBaseAccess('admin'), addNewProduct);
router.route('/product/:id')
    .put(verifyUser, roleBaseAccess('admin'), updateProduct)
    .delete(verifyUser, roleBaseAccess('admin'), deleteProduct);
router.route('/reviews')
    .get(verifyUser, roleBaseAccess('admin'), getProductReviews)
    .delete(verifyUser, roleBaseAccess('admin'), deleteProductReviews);

export default router;