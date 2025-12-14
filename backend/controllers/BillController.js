const { createConnection } = require("../utils/mongo");
const { BillSchema } = require("../schemas/BillModel")
const { BillItemSchema } = require("../schemas/BillItemModel")
const { ProductSchema } = require("../schemas/ProductModel")
const { PromotionSchema } = require("../schemas/PromotionModel")
const { CustomerSchema } = require("../schemas/CustomerModel")
const { EmployeeSchema } = require("../schemas/EmployeeModel")

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
    const BillItem = conn.model("BillItem", BillItemSchema);
    const Product = conn.model("Product", ProductSchema);
    const Promotion = conn.model("Promotion", PromotionSchema);
    const Customer = conn.model("Customer", CustomerSchema);
    const Employee = conn.model("Employee", EmployeeSchema);

    const { search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};
    if (search) {
      // Example: search by customer_id or employee_id string
      // (You might want to adjust this to search by populated fields)
      query.$or = [
        { customer_id: { $regex: search, $options: "i" } },
        { employee_id: { $regex: search, $options: "i" } },
      ];
    }

    // Apply pagination
    const bills = await Bill.find(query)
      .populate("customer_id")   // include customer details
      .populate("employee_id")   // include employee details
      .populate({
        path: 'products',
        populate: {
          path: 'product_id'
        }
      })      // include bill items
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    // Count total matching documents
    const total = await Bill.countDocuments(query);

    conn.close();
    res.status(200).json({ bills, total });
  } catch (error) {
    console.error("Fetch bills error:", error);
    res.status(500).json({ error: "Server error while fetching bills" });
  }
};

// Update Bill
const update = async (req, res) => {
  const conn = createConnection();
  try {
    const Bill = conn.model("Bill", BillSchema);
    const { id } = req.params;

    // Check existence
    const billExist = await Bill.findById(id);
    if (!billExist) {
      return res.status(404).json({ message: "Bill Not Found" });
    }

    // Update with validation
    const updatedBill = await Bill.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedBill);
  } catch (error) {
    console.error("Update bill error:", error);
    return res.status(500).json({ error: "Something went wrong while updating bill" });
  } finally {
    await conn.close();
  }
};

// Delete Bill
const deleteBill = async (req, res) => {
  const conn = createConnection();
  try {
    const Bill = conn.model("Bill", BillSchema);
    const { id } = req.params;

    // Check existence
    const billExist = await Bill.findById(id);
    if (!billExist) {
      return res.status(404).json({ message: "Bill Not Found" });
    }

    // Delete
    await Bill.findByIdAndDelete(id);

    // Success response
    return res.status(200).json({ message: "Bill Deleted" });
  } catch (error) {
    console.error("Delete bill error:", error);
    return res.status(500).json({ error: "Something went wrong while deleting bill" });
  } finally {
    await conn.close();
  }
};

const fetchById = async (req, res) => {
  try {
    const conn = createConnection();
    const Bill = conn.model("Bill", BillSchema);
    const { id } = req.params;

    const bill = await Bill.findById(id);

    await conn.close();
    res.status(200).json(bill);
  } catch (error) {
    console.error("Fetch bill error:", error);
    res.status(500).json({ error: "Server error while fetching bill" });
  }
};

//query 7
const fetchByDateRange = async (req, res) => {
  try {
    const conn = createConnection();
    const Bill = conn.model("Bill", BillSchema);
    const start_date = req.params.start_date;
    const end_date = req.params.end_date;

    const bill = await Bill.aggregate([ 
      { $match: { "transaction_time": { $gte: new Date(start_date), $lt: new Date(end_date) } } }, 
      { $group: { _id: null, total: { $sum: "$total_amount" } } } ]);

    await conn.close();
    res.status(200).json(bill);
  } catch (error) {
    console.error("Fetch bill error:", error);
    res.status(500).json({ error: "Server error while fetching bill" });
  }
};

module.exports = { fetch, fetchById, create, update, deleteBill , fetchByDateRange };
