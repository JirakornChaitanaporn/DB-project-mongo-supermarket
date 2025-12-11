import mongoose from "mongoose";

export const PromotionSchema = new mongoose.Schema({
    promotion_name: {
        type: String,
        required: [true, "Promotion name is required"],
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required"],
    },
    discount_type: {
        type: String,
        enum: ["percent", "amount"],
        default: "amount",
    },
    discount_value: {
        type: Number,
        required: [true, "Discount value is required"],
        min: [0, "Discount value cannot be negative"],
    },
    start_date: {
        type: Date,
        required: [true, "Start date is required"],
    },
    end_date: {
        type: Date,
        required: [true, "End date is required"],
    },
}, { collection: "promotions" });