const { createConnection } = require("../utils/mongo");
const { SupplierSchema } = require("../schemas/SupplierModel");

// Create
const create = async (req, res) => {
  try {
    const conn = createConnection();
    const Supplier = conn.model("Supplier", SupplierSchema);

    const supplierData = new Supplier(req.body);
    const savedSupplier = await supplierData.save();

    await conn.close();
    res.status(201).json(savedSupplier);
  } catch (error) {
    console.error("Create supplier error:", error);
    res.status(500).json({ error: "Something went wrong while creating supplier" });
  }
};

// Read (fetch all or search by supplier_name)
const fetch = async (req, res) => {
  try {
    const conn = createConnection();
    const Supplier = conn.model("Supplier", SupplierSchema);

    const { search, page = 1, limit = 10 } = req.query;

    // Build query first
    let query = {};
    if (search) {
      query.supplier_name = { $regex: search, $options: "i" };
    }

    // Apply pagination
    const suppliers = await Supplier.find(query)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    // Count total matching documents
    const total = await Supplier.countDocuments(query);

    conn.close();
    res.status(200).json({ suppliers, total });
  } catch (error) {
    console.error("Fetch suppliers error:", error);
    res.status(500).json({ error: "Server error while fetching suppliers" });
  }
};

//query 5
const fetchSupplierProduct = async (req, res) => {
  try {
    const conn = createConnection();
    const Supplier = conn.model("Supplier", SupplierSchema);

    const sName = req.params.sName;

    const suppliers = await Supplier.aggregate([{ $match: { "supplier_name": { $regex: sName, $options: "i" } } }, 
      { $lookup: { from: "products", localField: "_id", foreignField: "supplier_id", as: "catalog" } }, 
      { $project: { supplier_name: 1, "catalog.product_name": 1, "catalog.quantity": 1 } }])

    await conn.close();
    return res.status(200).json(suppliers);
  } catch (error) {
    console.error("Fetch suppliers error:", error);
    return res.status(500).json({ error: "Server error while fetching suppliers" });
  }
};

// Update Supplier
const update = async (req, res) => {
  const conn = createConnection();
  try {
    const Supplier = conn.model("Supplier", SupplierSchema);
    const { id } = req.params;

    // Check existence
    const supplierExist = await Supplier.findById(id);
    if (!supplierExist) {
      return res.status(404).json({ message: "Supplier Not Found" });
    }

    // Update with validation
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error("Update supplier error:", error);
    return res.status(500).json({ error: "Something went wrong while updating supplier" });
  } finally {
    await conn.close();
  }
};

// Delete Supplier
const deleteSupplier = async (req, res) => {
  const conn = createConnection();
  try {
    const Supplier = conn.model("Supplier", SupplierSchema);
    const { id } = req.params;

    // Check existence
    const supplierExist = await Supplier.findById(id);
    if (!supplierExist) {
      return res.status(404).json({ message: "Supplier Not Found" });
    }

    // Delete
    await Supplier.findByIdAndDelete(id);

    // Success response
    return res.status(200).json({ message: "Supplier Deleted" });
  } catch (error) {
    console.error("Delete supplier error:", error);
    return res.status(500).json({ error: "Something went wrong while deleting supplier" });
  } finally {
    await conn.close();
  }
};

const fetchById = async (req, res) => {
  try {
    const conn = createConnection();
    const Supplier = conn.model("Supplier", SupplierSchema);
    const { id } = req.params;

    const supplier = await Supplier.findById(id);

    await conn.close();
    res.status(200).json(supplier);
  } catch (error) {
    console.error("Fetch supplier error:", error);
    res.status(500).json({ error: "Server error while fetching supplier" });
  }
};

module.exports = { create, fetch, fetchById, update, deleteSupplier, fetchSupplierProduct };
