import mongoose from "mongoose";

export const RoleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: [true, "role name is needed"],
    },
    role_description: {
        type: String,
    },
    role_salary: {
        type: Number,
        required: [true],
        min: [10000, "10000 is the minimun please do not be cruel"],
    },
}, { collection: "roles" });
