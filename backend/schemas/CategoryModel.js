const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true,
    },
    category_description: {
        type: String,
    },
}, { collection: "categories" });

module.exports = mongoose.model("Category", CategorySchema);
