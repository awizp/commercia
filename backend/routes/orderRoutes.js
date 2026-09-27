import express from 'express';

import { verifyUser } from '../helpers/UserAuth.js';
import {
    cancelOrder,
    createNewOrder,
    getAllOrderDetails,
    getSingleOrderDetails
} from '../controller/orderController.js';

const router = express.Router();

router.route('/order/new').post(verifyUser, createNewOrder);
router.route('/order/:id')
    .get(verifyUser, getSingleOrderDetails)
    .delete(verifyUser, cancelOrder);
router.route('/orders/user').get(verifyUser, getAllOrderDetails);

export default router;