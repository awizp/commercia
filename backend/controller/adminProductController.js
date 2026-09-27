import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";
import HandleError from "../helpers/HandleError.js";

// get all products
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        if (!products) return next(new HandleError("No products found!", 400));
        res.status(200).json({ success: true, productsCount: products.length, products });
    } catch (err) {
        next(err);
    }
};

// add new product
export const addNewProduct = async (req, res, next) => {
    try {
        let rawImages = [];

        // Support both "images" or "image" payload keys from frontend
        const incomingImages = req.body.images || req.body.image;

        if (typeof incomingImages === "string") {
            rawImages.push(incomingImages);
        } else if (Array.isArray(incomingImages)) {
            rawImages = incomingImages;
        }

        if (rawImages.length === 0) {
            return next(new HandleError("Please provide at least one product image", 400));
        }

        const uploadedImages = [];

        // Upload each base64 image to the "products" folder in Cloudinary
        for (let i = 0; i < rawImages.length; i++) {
            const myCloud = await cloudinary.uploader.upload(rawImages[i], {
                folder: "products",
                crop: "scale"
            });

            uploadedImages.push({
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            });
        }

        // Assign the uploaded array to the schema's "image" field
        req.body.image = uploadedImages;
        req.body.user = req.user.id;

        const newProduct = await Product.create(req.body);

        res.status(201).json({ success: true, product: newProduct });
    } catch (err) {
        next(err);
    }
};

// update product
export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return next(new HandleError("Product Not found", 404));

        const incomingImages = req.body.images || req.body.image;

        // If new images were provided, delete old images and upload new ones
        if (incomingImages !== undefined) {
            let rawImages = [];

            if (typeof incomingImages === "string") {
                rawImages.push(incomingImages);
            } else if (Array.isArray(incomingImages)) {
                rawImages = incomingImages;
            }

            if (rawImages.length > 0) {
                // Delete previous images from Cloudinary
                for (let i = 0; i < product.image.length; i++) {
                    if (product.image[i]?.public_id) {
                        await cloudinary.uploader.destroy(product.image[i].public_id);
                    }
                }

                // Upload new images
                const uploadedImages = [];
                for (let i = 0; i < rawImages.length; i++) {
                    const myCloud = await cloudinary.uploader.upload(rawImages[i], {
                        folder: "products",
                        crop: "scale"
                    });

                    uploadedImages.push({
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url
                    });
                }

                req.body.image = uploadedImages;
            }
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: "after",
            runValidators: true
        });

        res.status(200).json({ success: true, product });
    } catch (err) {
        next(err);
    }
};

// delete product
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return next(new HandleError("Product Not found", 404));

        // Delete associated product images from Cloudinary
        for (let i = 0; i < product.image.length; i++) {
            if (product.image[i]?.public_id) {
                await cloudinary.uploader.destroy(product.image[i].public_id);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: `${product.name} details removed successfully` });
    } catch (err) {
        next(err);
    }
};

// get all reviews
export const getProductReviews = async (req, res, next) => {
    try {
        const { id } = req.query;

        const product = await Product.findById(id);
        if (!product) return next(new HandleError("Product doesn't exist", 400));

        res.status(200).json({ success: true, reviews: product.reviews });
    } catch (err) {
        next(err);
    }
};

// delete product reviews
export const deleteProductReviews = async (req, res, next) => {
    try {
        const { productId, reviewId } = req.query;

        const product = await Product.findById(productId);
        if (!product) return next(new HandleError("Product doesn't exist", 400));

        // Filter out target review
        const reviews = product.reviews.filter(review => review._id.toString() !== reviewId.toString());

        // Recalculate average rating & review count
        let sum = 0;
        reviews.forEach(review => sum += review.rating);

        const ratings = reviews.length > 0 ? (sum / reviews.length) : 0;
        const numOfReviews = reviews.length;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { reviews, ratings, numOfReviews },
            { returnDocument: "after", runValidators: true }
        );

        res.status(200).json({ success: true, message: "Review deleted successfully", product: updatedProduct });
    } catch (err) {
        next(err);
    }
};