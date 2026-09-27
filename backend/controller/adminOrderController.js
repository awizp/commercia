import Order from "../models/OrderModel.js";
import Product from "../models/productModel.js";
import HandleError from "../helpers/HandleError.js";

// get all orders from all users
export const getAllOrders = async (req, res, next) => {
    const orders = await Order.find().populate("user", "name email");
    if (!orders) return next(new HandleError(`No orders are found`, 404));

    // find total amount
    let totalAmount = 0;
    orders.forEach(order => totalAmount += order.totalPrice);

    res.status(200).json({ success: true, orders, totalAmount });
};

// delete order by id
export const deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new HandleError(`Order detail not found`, 404));

    // checking the order details delivered already(it only needs to be deleted after delivery)
    if (order.orderStatus !== 'Delivered') return next(new HandleError(`Order can't be cancelled during processing`, 400));
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Order deleted succesfully" });
};

// update product order status
export const updateOrderStatus = async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    // if product already deleivered need to stop
    if (!order) return next(new HandleError(`Order details not found`, 404));
    if (order.orderStatus === 'Delivered') return next(new HandleError('This order has been already delivered', 400));

    // update stock after deleivery (here using promise all used to finish all the promise inside of it)
    await Promise.all(order.orderDetails.map(item => updateProductQuantity(item.product, item.quantity)));

    // update order value to deleivered and date of delivery
    order.orderStatus = req.body.status;
    if (order.orderStatus === 'Delivered') order.deliveredAt = Date.now();
    await order.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Order updated successfully', order });
};

// this one used to update product quantity by promise called above function
const updateProductQuantity = async (productId, productQuantity) => {
    const product = await Product.findById(productId);
    if (!product) return next(new HandleError(`Product doesn't exist`, 404));

    // decreasing the product quantity
    product.stock -= Number(productQuantity);
    await product.save({ validateBeforeSave: false });
};