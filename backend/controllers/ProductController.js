const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");

// Define schema
const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, { collection: "products" });

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

// Update
const update = async (req, res) => {
  try {
    const conn = createConnection();
    const Product = conn.model("Product", ProductSchema);
    const id = req.params.id;
    
    const productExist = await Product.findById(id);

    if (!productExist) {
      await conn.close();
      return res.status(404).json({ message: "Product Not Found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    await conn.close();
    res.status(201).json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Something went wrong while updating product" });
  }
};

// Delete
const deleteProduct = async (req, res) => {
  try {
    const conn = createConnection();
    const Product = conn.model("Product", ProductSchema);
    const id = req.params.id;
    
    const productExist = await Product.findById(id);

    if (!productExist) {
      await conn.close();
      return res.status(404).json({ message: "Product Not Found" });
    }

    await Product.findByIdAndDelete(id);
    await conn.close();
    res.status(201).json({ message: "Product Deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Something went wrong while deleting product" });
  }
};

module.exports = { create, fetch, update, deleteProduct };
