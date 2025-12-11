import mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
    },
    category_description: {
        type: String,
    },
}, { collection: "categories" });