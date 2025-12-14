const { createConnection } = require("../utils/mongo");
const { BillItemSchema } = require("../schemas/BillItemModel");
const { BillSchema } = require("../schemas/BillModel");
const { ProductSchema } = require("../schemas/ProductModel");
const { PromotionSchema } = require("../schemas/PromotionModel");

// Create
const create = async (req, res) => {
    try {
        const conn = createConnection();
        const BillItem = conn.model("BillItem", BillItemSchema);

        const true_price = req.body.price * req.body.quantity
        req.body.final_price = true_price

        const billItemData = new BillItem(req.body); // create document from body

        const valid_err = billItemData.validateSync();
        if (valid_err) {
            return res.status(400).json(getMongoErrorMsg(valid_err.errors));
        }
        const savedBillItem = await billItemData.save();

        // savedBillItem._id and to product array in bill
        const Bill = conn.model("Bill", BillSchema);
        // Check existence
        const billExist = await Bill.findById(req.body.bill_id);
        if (!billExist) {
            return res.status(404).json({ message: "Bill Item Not Found" });
        }

        // Update with validation
        const updatedBill = await Bill.findByIdAndUpdate(
            req.body.bill_id,
            {
                $inc: { total_amount: savedBillItem.final_price },
                $push: { products: savedBillItem._id }
            },
            { new: true, runValidators: true }
        );

        conn.close();
        res.status(200).json(savedBillItem);
    } catch (error) {
        console.error("Create bill item error:", error);
        res.status(500).json({
            error: "Something went wrong while creating bill item",
        });
    }
};

const fetch = async (req, res) => {
    try {
        const conn = createConnection();
        const BillItem = conn.model("BillItem", BillItemSchema);
        const Bill = conn.model("Bill", BillSchema);
        const Product = conn.model("Product", ProductSchema);
        const Promotion = conn.model("Promotion", PromotionSchema);

        const { search, page = 1, limit = 10 } = req.query;

        // Build query
        let query = {};
        if (search) {
            // Example: search by product_id or bill_id string
            // (You may want to adjust this to search by populated product name)
            query.$or = [
                { bill_id: { $regex: search, $options: "i" } },
                { product_id: { $regex: search, $options: "i" } },
            ];
        }

        // Apply pagination
        const billItems = await BillItem.find(query)
            .populate("bill_id") // include bill details
            .populate("product_id") // include product details
            .populate("promotion") // include promotion details
            .skip((page - 1) * Number(limit))
            .limit(Number(limit));

        // Count total matching documents
        const total = await BillItem.countDocuments(query);

        conn.close();
        res.status(200).json({ billItems, total });
    } catch (error) {
        console.error("Fetch bill items error:", error);
        res.status(500).json({
            error: "Server error while fetching bill items",
        });
    }
};

// Update Bill Item
const update = async (req, res) => {
    const conn = createConnection();
    try {
        const Product = conn.model("Product", ProductSchema);
        const BillItem = conn.model("BillItem", BillItemSchema);
        const { id } = req.params;

        // Check existence
        const billItemExist = await BillItem.findById(id);
        if (!billItemExist) {
            return res.status(404).json({ message: "Bill Item Not Found" });
        }

        // Calculate new final_price if quantity and price are provided
        if (req.body.quantity && req.body.price) {
            req.body.final_price = req.body.quantity * req.body.price;
        }

        // Update with validation
        const updatedBillItem = await BillItem.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('product_id');

        return res.status(200).json(updatedBillItem);
    } catch (error) {
        console.error("Update bill item error:", error);
        return res
            .status(500)
            .json({ error: "Something went wrong while updating bill item" });
    } finally {
        await conn.close();
    }
};

// Delete Bill Item
const deleteBillItem = async (req, res) => {
    const conn = createConnection();
    try {
        const BillItem = conn.model("BillItem", BillItemSchema);
        const { id } = req.params;

        // Check existence
        const billItemExist = await BillItem.findById(id);
        if (!billItemExist) {
            return res.status(404).json({ message: "Bill Item Not Found" });
        }

        // Delete
        await BillItem.findByIdAndDelete(id);

        // Success response
        return res.status(200).json({ message: "Bill Item Deleted" });
    } catch (error) {
        console.error("Delete bill item error:", error);
        return res
            .status(500)
            .json({ error: "Something went wrong while deleting bill item" });
    } finally {
        await conn.close();
    }
};

const fetchById = async (req, res) => {
    try {
        const conn = createConnection();
        const BillItem = conn.model("BillItem", BillItemSchema);
        const { id } = req.params;

        const billItem = await BillItem.findById(id);

        await conn.close();
        res.status(200).json(billItem);
    } catch (error) {
        console.error("Fetch bill item error:", error);
        res.status(500).json({
            error: "Server error while fetching bill item",
        });
    }
};


//query 8
const fetchBestSellingItem = async (req, res) => {
    try {
        const conn = createConnection();
        const BillItem = conn.model("BillItem", BillItemSchema);
        const limit = req.params.limit;

        const billItem = await BillItem.aggregate([ 
            { $group: { _id: "$product_id", sold: { $sum: "$quantity" } } }, 
            { $sort: { sold: -1 } }, { $limit: Number(limit) } ]);

        await conn.close();
        res.status(200).json(billItem);
    } catch (error) {
        console.error("Fetch bill item error:", error);
        res.status(500).json({
            error: "Server error while fetching bill item",
        });
    }
};

module.exports = { fetch, fetchById, create, update, deleteBillItem , fetchBestSellingItem};
