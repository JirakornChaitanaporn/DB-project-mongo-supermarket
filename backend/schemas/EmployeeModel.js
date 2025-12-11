const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
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
        required: true,
    },
    hire_date: {
        type: Date,
        default: Date.now,
    },
}, { collection: "employees"});

module.exports = mongoose.model("Employee", EmployeeSchema);
