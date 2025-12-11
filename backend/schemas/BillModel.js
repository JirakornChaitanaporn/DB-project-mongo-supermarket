import mongoose from "mongoose";

export const BillSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        default: null
    },
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: [true, "Employee ID is required"],
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BillItem",
        default: [],
    }],
    total_amount: {
        type: Number,
        default: 0,
        min: 0,
    },
    transaction_time: {
        type: Date,
        default: Date.now,
    }
}, { collection: "bills" });