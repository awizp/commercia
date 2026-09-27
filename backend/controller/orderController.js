import HandleError from "../helpers/HandleError.js";
import Order from "../models/OrderModel.js";

// create a new order
export const createNewOrder = async (req, res, next) => {
    const { shippingAddress, orderDetails, orderStatus, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const newOrder = {
        shippingAddress,
        orderDetails,
        orderStatus,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        createdAt: Date.now(),
        user: req.user._id
    };

    const order = await Order.create(newOrder);
    res.status(201).json({ success: true, message: "Order placed successfully", order });
};

// get single order
export const getSingleOrderDetails = async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate("user", "name email");
    if (!order) return next(new HandleError('Order details not found', 404));
    res.status(200).json({ success: true, order });
};

// get all order details
export const getAllOrderDetails = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) return next(new HandleError(`No orders are found!`, 404));
    res.status(200).json({ success: true, orders });
};

// cancel order
export const cancelOrder = async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    // check order user and the requesting user are the same
    if (!order) return next(new HandleError(`Order details not found`, 404));
    if (order.user.toString() !== req.user._id.toString()) return next(new HandleError("Unauthorized action", 400));
    if (order.orderStatus == 'Delivered') return next(new HandleError(`This order has already been delivered`, 400));

    await Order.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Order is cancelled" });
};