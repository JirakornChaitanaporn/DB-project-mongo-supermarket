const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");

// Define schema
const BillItemSchema = new mongoose.Schema({
    bill_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
        required: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promotion",
        default: null, 
    },
    final_price: {
        type: Number,
        required: true,
        min: 0,
    },
}, { collection: "bill_items", timestamps: true });

// Create
const create = async (req, res) => {
  try {
    const conn = createConnection();
    const BillItem = conn.model("BillItem", BillItemSchema);
    
    const billItemData = new BillItem(req.body);
    const savedBillItem = await billItemData.save();
    
    await conn.close();
    res.status(200).json(savedBillItem);
  } catch (error) {
    console.error("Create bill item error:", error);
    res.status(500).json({ error: "Something went wrong while creating bill item" });
  }
};

const fetch = async (req, res) => {
  try {
    const conn = createConnection();
    const BillItem = conn.model("BillItem", BillItemSchema);
    
    // Register referenced schemas
    const BillSchema = new mongoose.Schema({
      customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
      employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
      products: [{ type: mongoose.Schema.Types.ObjectId, ref: "BillItem", default: [] }],
      total_amount: { type: Number, default: 0, min: 0 },
      transaction_time: { type: Date, default: Date.now }
    }, { collection: "bills" });
    conn.model("Bill", BillSchema);
    
    const ProductSchema = new mongoose.Schema({
      product_name: { type: String, required: true },
      price: { type: Number, required: true },
      supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
      category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
      quantity: { type: Number, required: true },
      created_at: { type: Date, default: Date.now }
    }, { collection: "products" });
    conn.model("Product", ProductSchema);
    
    const PromotionSchema = new mongoose.Schema({
      promotion_name: { type: String, required: true },
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      discount_type: { type: String, enum: ["percent", "amount"], default: "amount" },
      discount_value: { type: Number, required: true, min: 0 },
      start_date: { type: Date, required: true },
      end_date: { type: Date, required: true }
    }, { collection: "promotions" });
    conn.model("Promotion", PromotionSchema);
    
    const { bill_id, product_id, limit = 10, skip = 0 } = req.query;

    let query = {};
    if (bill_id) {
      if (!mongoose.Types.ObjectId.isValid(bill_id)) {
        await conn.close();
        return res.status(400).json({ error: "Invalid bill_id" });
      }
      query.bill_id = bill_id;
    }
    if (product_id) {
      if (!mongoose.Types.ObjectId.isValid(product_id)) {
        await conn.close();
        return res.status(400).json({ error: "Invalid product_id" });
      }
      query.product_id = product_id;
    }

    const billItems = await BillItem.find(query)
      .populate("bill_id", "total_amount transaction_time")
      .populate("product_id", "product_name price")
      .populate("promotion", "promotion_name discount_type discount_value")
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    if (!billItems.length) {
      await conn.close();
      return res.status(404).json({ message: "No bill items found" });
    }

    await conn.close();
    res.status(200).json(billItems);
  } catch (error) {
    console.error("Fetch bill items error:", error);
    res.status(500).json({ error: error.message || "Server error while fetching bill items" });
  }
};

// Update
const update = async (req, res) => {
  try {
    const conn = createConnection();
    const BillItem = conn.model("BillItem", BillItemSchema);
    const id = req.params.id;
    
    const billItemExist = await BillItem.findOne({ _id: id });

    if (!billItemExist) {
      await conn.close();
      return res.status(404).json({ message: "Bill Item Not Found" });
    }

    const updatedBillItem = await BillItem.findByIdAndUpdate(id, req.body, { new: true });
    await conn.close();
    res.status(201).json(updatedBillItem);
  } catch (error) {
    console.error("Update bill item error:", error);
    res.status(500).json({ error: "Something went wrong while updating bill item" });
  }
};

// Delete
const deleteBillItem = async (req, res) => {
  try {
    const conn = createConnection();
    const BillItem = conn.model("BillItem", BillItemSchema);
    const id = req.params.id;
    
    const billItemExist = await BillItem.findOne({ _id: id });

    if (!billItemExist) {
      await conn.close();
      return res.status(404).json({ message: "Bill Item Not Found" });
    }

    await BillItem.findByIdAndDelete(id);
    await conn.close();
    res.status(201).json({ message: "Bill Item Deleted" });
  } catch (error) {
    console.error("Delete bill item error:", error);
    res.status(500).json({ error: "Something went wrong while deleting bill item" });
  }
};

module.exports = { fetch, create, update, deleteBillItem };
