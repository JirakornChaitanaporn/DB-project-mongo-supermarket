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

// Read (fetch all or search by product_name)
const fetch = async (req, res) => {
  try {
    const conn = createConnection();
    const Product = conn.model("Product", ProductSchema);

    // Register referenced schemas
    const CategorySchema = new mongoose.Schema({
      category_name: { type: String, required: true, unique: true },
      category_description: { type: String }
    }, { collection: "categories" });
    conn.model("Category", CategorySchema);

    const SupplierSchema = new mongoose.Schema({
      supplier_name: { type: String, required: true },
      contacts: {
        person: { type: String, required: true },
        email: { type: String },
        phone: { type: String, required: true }
      },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postal_code: { type: String, required: true },
        country: { type: String, required: true }
      }
    }, { collection: "suppliers" });
    conn.model("Supplier", SupplierSchema);

    const { search } = req.query;

    let query = {};
    if (search) {
      query.product_name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .populate("category_id", "category_name category_description")
      .populate("supplier_id", "supplier_name contacts");

    await conn.close();
    res.status(200).json(products);
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
