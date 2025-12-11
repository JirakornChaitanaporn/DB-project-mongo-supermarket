const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
    promotion_name: {
        type: String,
        required: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    discount_type: {
        type: String,
        enum: ["percent", "amount"],
        default: "amount",
    },
    discount_value: {
        type: Number,
        required: true,
        min: 0,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
}, { collection: "promotions" });

module.exports = mongoose.model("Promotion", PromotionSchema);
