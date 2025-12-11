const { createConnection, getMongoErrorMsg } = require("../utils/mongo");
const { CustomerSchema } = require("../schemas/CustomerModel");

// Create
const create = async (req, res) => {
    try {
        const conn = createConnection();
        const Customer = conn.model("Customer", CustomerSchema);

        const customerData = new Customer(req.body);
		const valid_err = customerData.validateSync();
		if (valid_err) {
			return res.status(400).json(getMongoErrorMsg(valid_err.errors));
		}
        await customerData.save();
        conn.close();

        res.status(200).json(customerData);
    } catch (error) {
        console.error("Create customer error:", error);
        res.status(500).json({
            error: "Something went wrong while creating customer",
        });
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
                { last_name: { $regex: search, $options: "i" } },
            ];
        }

        const customers = await Customer.find({});
        conn.close();

        res.status(200).json(customers);
    } catch (error) {
        console.error("Fetch customers error:", error);
        res.status(500).json({
            error: "Server error while fetching customers",
        });
    }
};

const fetchById = async (req,res) => {
	try {
        const conn = createConnection();
        const Customer = conn.model("Customer", CustomerSchema);

        const {id} = req.params;
        const customers = await Customer.findById(id);
        conn.close();

        res.status(200).json(customers);

    } catch (error) {
        console.error("Fetch customers error:", error);
        res.status(500).json({
            error: "Server error while fetching customers",
        });
    }
}

// Update
const update = async (req, res) => {
    try {
        const conn = createConnection();
        const Customer = conn.model("Customer", CustomerSchema);
        const { id } = req.params;

        const customerExist = await Customer.findById(id);

        if (!customerExist) {
            conn.close();
            return res.status(404).json({ message: "Customer Not Found" });
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        conn.close();
        res.json(updatedCustomer);
    } catch (error) {
        console.error("Update customer error:", error);
        res.status(500).json({
            error: "Something went wrong while updating customer",
        });
    }
};

// Delete
const deleteCustomer = async (req, res) => {
    try {
        const conn = createConnection();
        const Customer = conn.model("Customer", CustomerSchema);
        const { id } = req.params;

        const customerExist = await Customer.findById(id);

        if (!customerExist) {
            conn.close();
            return res.status(404).json({ message: "Customer Not Found" });
        }

        await Customer.findByIdAndDelete(id);
        conn.close();
        res.status(204).json({ message: "Customer Deleted" });
    } catch (error) {
        console.error("Delete customer error:", error);
        res.status(500).json({
            error: "Something went wrong while deleting customer",
        });
    }
};

module.exports = { create, fetch, update, deleteCustomer , fetchById };
