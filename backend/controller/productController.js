import Product from '../models/productModel.js';
import HandleError from '../helpers/HandleError.js';
import APIHelper from '../helpers/APIHelper.js';

// get all products
export const getAllProducts = async (req, res, next) => {
    // fetch all unique categories from the entire collection
    const categories = await Product.distinct("category");

    // build the query chain for filtering & search
    const apiHelper = new APIHelper(Product.find(), req.query).search().filter();

    // count matching documents after filters/search
    const filteredQuery = apiHelper.query.clone();
    const resultPerPage = 6;
    const productCount = await filteredQuery.countDocuments();
    const totalPages = Math.ceil(productCount / resultPerPage) || 1;
    const pageNumber = Number(req.query.page) || 1;

    // check page existence
    if (productCount > 0 && pageNumber > totalPages) {
        return next(new HandleError("This page does not exist", 404));
    }

    // paginate and execute
    apiHelper.pagination(resultPerPage);
    const products = await apiHelper.query;

    res.status(200).json({ success: true, products, productCount, resultPerPage, totalPages, currentPage: pageNumber, categories });
};

// get single product
export const getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new HandleError('Product Not found', 404));
    res.status(200).json({ success: true, product });
};

// add or update product review
export const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        if (!productId) {
            return next(new HandleError("Product ID is required", 400));
        }

        if (!rating || Number(rating) < 1 || Number(rating) > 5) {
            return next(new HandleError("Rating must be between 1 and 5", 400));
        }

        if (!comment || !comment.trim()) {
            return next(new HandleError("Review comment is required", 400));
        }

        const product = await Product.findById(productId);
        if (!product) {
            return next(new HandleError("Product doesn't exist", 404));
        }

        // Safely extract avatar with fallback
        const userAvatar =
            req.user?.avatar?.url ||
            (typeof req.user?.avatar === "string" ? req.user.avatar : "") ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80";

        const newReview = {
            user: req.user._id,
            name: req.user.name,
            avatar: userAvatar,
            rating: Number(rating),
            comment: comment.trim()
        };

        const userIdStr = req.user._id.toString();

        // Check if review already exists
        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === userIdStr
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === userIdStr) {
                    rev.rating = Number(rating);
                    rev.comment = comment.trim();
                    rev.avater = userAvatar;
                }
            });
        } else {
            product.reviews.push(newReview);
        }

        // Update count of reviews
        product.numOfReviews = product.reviews.length;

        // Recalculate average ratings
        let sum = 0;
        product.reviews.forEach((rev) => {
            sum += rev.rating;
        });

        product.ratings = product.numOfReviews > 0 ? (sum / product.numOfReviews) : 0;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: isReviewed ? "Review updated successfully!" : "Review added successfully!",
            product
        });
    } catch (err) {
        next(err);
    }
};

// delete user review (by the review owner)
export const deleteUserReview = async (req, res, next) => {
    try {
        const { productId } = req.query;

        const product = await Product.findById(productId);
        if (!product) return next(new HandleError("Product doesn't exist", 404));

        // Check if the user has a review on this product
        const hasReview = product.reviews.some(
            (rev) => rev.user.toString() === req.user._id.toString()
        );

        if (!hasReview) {
            return next(new HandleError("You have not reviewed this product yet", 400));
        }

        // Filter out the logged-in user's review
        const reviews = product.reviews.filter(
            (rev) => rev.user.toString() !== req.user._id.toString()
        );

        // Recalculate average rating & review count
        let sum = 0;
        reviews.forEach((rev) => (sum += rev.rating));

        const ratings = reviews.length > 0 ? sum / reviews.length : 0;
        const numOfReviews = reviews.length;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { reviews, ratings, numOfReviews },
            { returnDocument: "after", runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Review removed successfully",
            product: updatedProduct
        });
    } catch (err) {
        next(err);
    }
};