const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");

// Define schema
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

// Create
const create = async (req, res) => {
    try {
        const conn = createConnection();
        const Category = conn.model("Category", CategorySchema);
        
        const categoryData = new Category(req.body);
        const savedCategory = await categoryData.save();
        
        await conn.close();
        res.status(200).json(savedCategory);
    } catch (error) {
        console.error("Create category error:", error);
        res.status(500).json({ error: "Something went wrong while creating category" });
    }
};

// Read
const fetch = async (req, res) => {
    try {
        const conn = createConnection();
        const Category = conn.model("Category", CategorySchema);
        
        const { search } = req.query;

        let query = {};
        if (search) {
        query.category_name = { $regex: search, $options: "i" };
        }

        const categories = await Category.find(query);
        await conn.close();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Fetch categories error:", error);
        res.status(500).json({ error: "Server error while fetching categories" });
    }
};

// Update
const update = async (req, res) => {
    try {
        const conn = createConnection();
        const Category = conn.model("Category", CategorySchema);
        const id = req.params.id;
        
        const categoryExist = await Category.findOne({ _id: id });

        if (!categoryExist) {
        await conn.close();
        return res.status(404).json({ message: "Category Not Found" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        await conn.close();
        res.status(201).json(updatedCategory);
    } catch (error) {
        console.error("Update category error:", error);
        res.status(500).json({ error: "Something went wrong while updating category" });
    }
};

// Delete
const deleteCategory = async (req, res) => {
    try {
        const conn = createConnection();
        const Category = conn.model("Category", CategorySchema);
        const id = req.params.id;
        
        const categoryExist = await Category.findOne({ _id: id });

        if (!categoryExist) {
        await conn.close();
        return res.status(404).json({ message: "Category Not Found" });
        }

        await Category.findByIdAndDelete(id);
        await conn.close();
        res.status(201).json({ message: "Category Deleted" });
    } catch (error) {
        console.error("Delete category error:", error);
        res.status(500).json({ error: "Something went wrong while deleting category" });
    }
};

module.exports = { create, fetch, update, deleteCategory };
