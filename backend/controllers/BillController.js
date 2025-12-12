const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");
const { BillSchema } = require("../schemas/BillModel");

// Create
const create = async (req, res) => {
    try {
        const conn = createConnection();
        const Bill = conn.model("Bill", BillSchema);

        const billData = new Bill(req.body);

        const valid_err = billData.validateSync();
        if (valid_err) {
            return res.status(400).json(getMongoErrorMsg(valid_err.errors));
        }

        const savedBill = await billData.save();

        await conn.close();
        res.status(200).json(savedBill);
    } catch (error) {
        console.error("Create bill error:", error);
        res.status(500).json({
            error: "Something went wrong while creating bill",
        });
    }
};

// Read (fetch all or search by customer_id or employee_id)
const fetch = async (req, res) => {
    try {
        const conn = createConnection();
        const Bill = conn.model("Bill", BillSchema);

        const { search } = req.query;

        let query = {};
        if (search) {
            // Search by first_name OR last_name
            query.$or = [
                { customer_id: search },
                { employee_id: search },
            ];
        }

        const bills = await Bill.find(query)
        conn.close();
        res.status(200).json(bills);
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
        const updatedBill = await Bill.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json(updatedBill);
    } catch (error) {
        console.error("Update bill error:", error);
        return res
            .status(500)
            .json({ error: "Something went wrong while updating bill" });
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
        return res
            .status(500)
            .json({ error: "Something went wrong while deleting bill" });
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

module.exports = { fetch, fetchById, create, update, deleteBill };
