const mongoose = require("mongoose");

const BillItemSchema = new mongoose.Schema({
    bill_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
        required: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promotion",
        default: null, 
    },
    final_price: {
        type: Number,
        required: true,
        min: 0,
    },
}, { collection: "bill_items", timestamps: true });

module.exports = mongoose.model("BillItem", BillItemSchema);
