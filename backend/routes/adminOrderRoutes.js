import express from 'express';

import { verifyUser, roleBaseAccess } from '../helpers/UserAuth.js';
import {
    deleteOrder,
    getAllOrders,
    updateOrderStatus
} from '../controller/adminOrderController.js';

const router = express.Router();

// admin routes
router.route('/orders')
    .get(verifyUser, roleBaseAccess('admin'), getAllOrders);
router.route('/order/:id')
    .put(verifyUser, roleBaseAccess('admin'), updateOrderStatus)
    .delete(verifyUser, roleBaseAccess('admin'), deleteOrder);

export default router;