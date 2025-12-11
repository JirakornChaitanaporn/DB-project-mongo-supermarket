const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone_number: {
        type: String,
        match: [/^\+?[0-9]{7,15}$/, "Please enter a valid phone number"]
    },
    loyalty_point: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, { collection: "customers" });

module.exports = mongoose.model("Customer", CustomerSchema);
