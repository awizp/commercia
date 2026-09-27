import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: { type: String, required: [true, "Please enter product name"] },
    description: { type: String, required: [true, "Please enter product description"] },
    price: { type: Number, required: [true, "Please enter product price"], maxLength: [7, "Price can't be exceeded 7 digit"] },
    mrp: { type: Number, required: [true, "Please enter product MRP"], maxLength: [7, "Price can't be exceeded 7 digit"] },
    ratings: { type: Number, default: 0 },
    image: [{
        public_id: { type: String, required: [true] },
        url: { type: String, required: [true] }
    }],
    category: { type: String, required: [true, "Please enter product category"] },
    stock: { type: Number, required: [true, "Please enter product stock"], default: 1 },
    numOfReviews: { type: Number, default: 0 },
    reviews: [{
        user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
        avatar: { type: String },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: { type: Date, default: Date.now() }
});

export default mongoose.model('Product', productSchema);