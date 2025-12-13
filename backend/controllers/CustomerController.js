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

    const { search, page = 1, limit = 10 } = req.query;

    let query = {};
    if (search) {
      query.first_name = { $regex: search, $options: "i" } ;
    }

    // Apply pagination
    const customers = await Customer.find(query)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    // Count total matching documents
    const total = await Customer.countDocuments(query);

    conn.close();
    res.status(200).json({ customers, total });
  } catch (error) {
    console.error("Fetch customers error:", error);
    res.status(500).json({ error: "Server error while fetching customers" });
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

// Update Customer
const update = async (req, res) => {
  const conn = createConnection();
  try {
    const Customer = conn.model("Customer", CustomerSchema);
    const { id } = req.params;

    // Check existence
    const customerExist = await Customer.findById(id);
    if (!customerExist) {
      return res.status(404).json({ message: "Customer Not Found" });
    }

    // Update with validation
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Update customer error:", error);
    return res.status(500).json({
      error: "Something went wrong while updating customer",
    });
  } finally {
    await conn.close();
  }
};

// Delete Customer
const deleteCustomer = async (req, res) => {
  const conn = createConnection();
  try {
    const Customer = conn.model("Customer", CustomerSchema);
    const { id } = req.params;

    // Check existence
    const customerExist = await Customer.findById(id);
    if (!customerExist) {
      return res.status(404).json({ message: "Customer Not Found" });
    }

    // Delete
    await Customer.findByIdAndDelete(id);

    // Success response
    return res.status(200).json({ message: "Customer Deleted" });
  } catch (error) {
    console.error("Delete customer error:", error);
    return res.status(500).json({
      error: "Something went wrong while deleting customer",
    });
  } finally {
    await conn.close();
  }
};

module.exports = { create, fetch, update, deleteCustomer , fetchById };
