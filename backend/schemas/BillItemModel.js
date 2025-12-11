import mongoose from "mongoose";

export const BillItemSchema = new mongoose.Schema({
    bill_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
        required: [true, "Bill ID is required"],
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },
    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promotion",
        default: null,
    },
    final_price: {
        type: Number,
        required: [true, "Final price is required"],
        min: [0, "Final price cannot be negative"],
    },
}, { collection: "bill_items", timestamps: true });