const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");
const {ProductSchema} = require("../schemas/ProductModel")

// Create
const create = async (req, res) => {
  try {
    const conn = createConnection();
    const Product = conn.model("Product", ProductSchema);

    const productData = new Product(req.body);
    const savedProduct = await productData.save();

    await conn.close();
    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Something went wrong while creating product" });
  }
};

// Read (fetch all or search by role_name)
const fetch = async (req, res) => {
  try {
    const conn = createConnection();
    const Product = conn.model("Product", ProductSchema);

    const { search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};
    if (search) {
      query.product_name = { $regex: search, $options: "i" };
    }

    // Apply pagination
    const products = await Product.find(query)
      .populate("supplier_id") // optional: include supplier details
      .populate("category_id") // optional: include category details
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    // Count total matching documents
    const total = await Product.countDocuments(query);

    conn.close();
    res.status(200).json({ products, total });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ error: "Server error while fetching products" });
  }
};

// Update Product
const update = async (req, res) => {
  const conn = createConnection();
  try {
    const Product = conn.model("Product", ProductSchema);
    const { id } = req.params;

    // Check existence
    const productExist = await Product.findById(id);
    if (!productExist) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // Update with validation
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({ error: "Something went wrong while updating product" });
  } finally {
    await conn.close();
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const conn = createConnection();
  try {
    const Product = conn.model("Product", ProductSchema);
    const { id } = req.params;

    // Check existence
    const productExist = await Product.findById(id);
    if (!productExist) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // Delete
    await Product.findByIdAndDelete(id);

    // Success response
    return res.status(200).json({ message: "Product Deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ error: "Something went wrong while deleting product" });
  } finally {
    await conn.close();
  }
};

const fetchById = async (req, res) => {
  try {
    const conn = createConnection();
    const Product = conn.model("Product", ProductSchema);
    const { id } = req.params;

    const product = await Product.findById(id);

    await conn.close();
    res.status(200).json(product);
  } catch (error) {
    console.error("Fetch product error:", error);
    res.status(500).json({ error: "Server error while fetching product" });
  }
};

module.exports = { create, fetch, fetchById, update, deleteProduct };
