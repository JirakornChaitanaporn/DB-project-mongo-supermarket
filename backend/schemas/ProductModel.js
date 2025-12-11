const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, { collection: "products" });

module.exports = mongoose.model("Product", ProductSchema);
