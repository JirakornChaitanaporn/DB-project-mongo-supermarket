const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");

// Define schema
const BillSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        default: null
    },
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BillItem",
        default: [],
    }],
    total_amount: {
        type: Number,
        default: 0,
        min: 0,
    },
    transaction_time: {
        type: Date,
        default: Date.now,
    }
}, { collection: "bills" });

// Create
const create = async (req, res) => {
  try {
    const conn = createConnection();
    const Bill = conn.model("Bill", BillSchema);
    
    const billData = new Bill(req.body);
    const savedBill = await billData.save();
    
    await conn.close();
    res.status(200).json(savedBill);
  } catch (error) {
    console.error("Create bill error:", error);
    res.status(500).json({ error: "Something went wrong while creating bill" });
  }
};

// Read (fetch all or search by customer_id or employee_id)
const fetch = async (req, res) => {
  try {
    const conn = createConnection();
    const Bill = conn.model("Bill", BillSchema);
    
    // Register referenced schemas
    const CustomerSchema = new mongoose.Schema({
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      email: { type: String, unique: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"] },
      phone_number: { type: String, match: [/^\+?[0-9]{7,15}$/, "Please enter a valid phone number"] },
      loyalty_point: { type: Number, default: 0 },
      created_at: { type: Date, default: Date.now }
    }, { collection: "customers" });
    conn.model("Customer", CustomerSchema);
    
    const BillItemSchema = new mongoose.Schema({
      bill_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bill", required: true },
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      promotion: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion", default: null },
      final_price: { type: Number, required: true, min: 0 }
    }, { collection: "bill_items", timestamps: true });
    conn.model("BillItem", BillItemSchema);
    
    const ProductSchema = new mongoose.Schema({
      product_name: { type: String, required: true },
      price: { type: Number, required: true },
      supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
      category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
      quantity: { type: Number, required: true },
      created_at: { type: Date, default: Date.now }
    }, { collection: "products" });
    conn.model("Product", ProductSchema);
    
    const { search } = req.query;

    let query = {};
    if (search) {
      // Search by first_name OR last_name
      query.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } }
      ];
    }

    const bills = await Bill.find(query)
      .populate("customer_id", "first_name last_name")
      .populate("products")
      .populate({
        path: "products",
        populate: { path: "product_id", select: "product_name price" }
      });

    await conn.close();
    res.status(200).json(bills);
  } catch (error) {
    console.error("Fetch bills error:", error);
    res.status(500).json({ error: "Server error while fetching bills" });
  }
};

// Update
const update = async (req, res) => {
  try {
    const conn = createConnection();
    const Bill = conn.model("Bill", BillSchema);
    const id = req.params.id;
    
    const billExist = await Bill.findOne({ _id: id });

    if (!billExist) {
      await conn.close();
      return res.status(404).json({ message: "Bill Not Found" });
    }

    const updatedBill = await Bill.findByIdAndUpdate(id, req.body, { new: true });
    await conn.close();
    res.status(201).json(updatedBill);
  } catch (error) {
    console.error("Update bill error:", error);
    res.status(500).json({ error: "Something went wrong while updating bill" });
  }
};

// Delete
const deleteBill = async (req, res) => {
  try {
    const conn = createConnection();
    const Bill = conn.model("Bill", BillSchema);
    const id = req.params.id;
    
    const billExist = await Bill.findOne({ _id: id });

    if (!billExist) {
      await conn.close();
      return res.status(404).json({ message: "Bill Not Found" });
    }

    await Bill.findByIdAndDelete(id);
    await conn.close();
    res.status(201).json({ message: "Bill Deleted" });
  } catch (error) {
    console.error("Delete bill error:", error);
    res.status(500).json({ error: "Something went wrong while deleting bill" });
  }
};

module.exports = { fetch, create, update, deleteBill };
