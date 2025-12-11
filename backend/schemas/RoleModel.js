const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
    },
    role_description: {
        type: String,
    },
    role_salary: {
        type: Number,
        required: true,
        min: 10000,
    },
}, { collection: "roles" });

module.exports = mongoose.model("Role", RoleSchema);
