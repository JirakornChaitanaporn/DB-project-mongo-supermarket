import mongoose from "mongoose";

export const CustomerSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true,"firstname is needed"],
    },
    last_name: {
        type: String,
        required: [true, "lastname is needed"],
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
