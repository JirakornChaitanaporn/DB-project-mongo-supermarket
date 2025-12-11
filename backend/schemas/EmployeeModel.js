import mongoose from "mongoose";

export const EmployeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First name is required"],
    },
    last_name: {
        type: String,
        required: [true, "Last name is required"],
    },
    phone_number: {
        type: String,
    },
    gender: {
        type: String,
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: [true, "Role ID is required"],
    },
    hire_date: {
        type: Date,
        default: Date.now,
    },
}, { collection: "employees" });