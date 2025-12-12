const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");
const { CategorySchema } = require("../schemas/CategoryModel")
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

// Update Category
const update = async (req, res) => {
  const conn = createConnection();
  try {
    const Category = conn.model("Category", CategorySchema);
    const { id } = req.params;

    // Check existence
    const categoryExist = await Category.findById(id);
    if (!categoryExist) {
      return res.status(404).json({ message: "Category Not Found" });
    }

    // Update with validation
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Update category error:", error);
    return res.status(500).json({ error: "Something went wrong while updating category" });
  } finally {
    await conn.close();
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  const conn = createConnection();
  try {
    const Category = conn.model("Category", CategorySchema);
    const { id } = req.params;

    // Check existence
    const categoryExist = await Category.findById(id);
    if (!categoryExist) {
      return res.status(404).json({ message: "Category Not Found" });
    }

    // Delete
    await Category.findByIdAndDelete(id);

    // Success response
    return res.status(200).json({ message: "Category Deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    return res.status(500).json({ error: "Something went wrong while deleting category" });
  } finally {
    await conn.close();
  }
};

const fetchById = async (req, res) => {
    try {
        const conn = createConnection();
        const Category = conn.model("Category", CategorySchema);
        const { id } = req.params;

        const category = await Category.findById(id);

        await conn.close();
        res.status(200).json(category);
    } catch (error) {
        console.error("Fetch category error:", error);
        res.status(500).json({ error: "Server error while fetching category" });
    }
};

module.exports = { create, fetch, fetchById, update, deleteCategory };
