import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        unique:[true, "This product has already existed"],
        required: [true, "Product name is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: [true, "Supplier ID is required"],
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category ID is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0, "Quantity cannot be negative"],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, { collection: "products" });