const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");

// Define schema
const CustomerSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone_number: {
        type: String,
        match: [/^\+?[0-9]{7,15}$/, "Please enter a valid phone number"]
    },
    loyalty_point: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, { collection: "customers" });

// Create
const create = async (req, res) => {
  try {
    const conn = createConnection();
    const Customer = conn.model("Customer", CustomerSchema);
    
    const customerData = new Customer(req.body);
    const savedCustomer = await customerData.save();
    
    await conn.close();
    res.status(200).json(savedCustomer);
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ error: "Something went wrong while creating customer" });
  }
};

// Read (fetch all or search by name)
const fetch = async (req, res) => {
  try {
    const conn = createConnection();
    const Customer = conn.model("Customer", CustomerSchema);
    
    const { search } = req.query;

    let query = {};
    if (search) {
      // Search by first_name OR last_name
      query.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } }
      ];
    }

    const customers = await Customer.find(query);
    await conn.close();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Fetch customers error:", error);
    res.status(500).json({ error: "Server error while fetching customers" });
  }
};

// Update
const update = async (req, res) => {
  try {
    const conn = createConnection();
    const Customer = conn.model("Customer", CustomerSchema);
    const id = req.params.id;
    
    const customerExist = await Customer.findOne({ _id: id });

    if (!customerExist) {
      await conn.close();
      return res.status(404).json({ message: "Customer Not Found" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
    await conn.close();
    res.status(201).json(updatedCustomer);
  } catch (error) {
    console.error("Update customer error:", error);
    res.status(500).json({ error: "Something went wrong while updating customer" });
  }
};

// Delete
const deleteCustomer = async (req, res) => {
  try {
    const conn = createConnection();
    const Customer = conn.model("Customer", CustomerSchema);
    const id = req.params.id;
    
    const customerExist = await Customer.findOne({ _id: id });

    if (!customerExist) {
      await conn.close();
      return res.status(404).json({ message: "Customer Not Found" });
    }

    await Customer.findByIdAndDelete(id);
    await conn.close();
    res.status(201).json({ message: "Customer Deleted" });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ error: "Something went wrong while deleting customer" });
  }
};

module.exports = { create, fetch, update, deleteCustomer };
