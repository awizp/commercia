import mongoose from "mongoose";

export const connectDB = async (URI) => {
    try {
        const connection = await mongoose.connect(URI);
        console.log(`MongoDB connected with server : ${connection.connection.host}`);
    } catch (err) {
        console.log('Failed to connect with database', err.message);
    }
};