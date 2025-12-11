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

    const { search } = req.query;

    let query = {};
    if (search) {
      query.supplier_name = { $regex: search, $options: "i" };
    }

    const suppliers = await Supplier.find(query);
    await conn.close();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Fetch suppliers error:", error);
    res.status(500).json({ error: "Server error while fetching suppliers" });
  }
};

// Update
const update = async (req, res) => {
  try {
    const conn = createConnection();
    const Supplier = conn.model("Supplier", SupplierSchema);
    const id = req.params.id;

    const supplierExist = await Supplier.findOne({ _id: id });

    if (!supplierExist) {
      await conn.close();
      return res.status(404).json({ message: "Supplier Not Found" });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
    await conn.close();
    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error("Update supplier error:", error);
    res.status(500).json({ error: "Something went wrong while updating supplier" });
  }
};

// Delete
const deleteSupplier = async (req, res) => {
  try {
    const conn = createConnection();
    const Supplier = conn.model("Supplier", SupplierSchema);
    const id = req.params.id;

    const supplierExist = await Supplier.findOne({ _id: id });

    if (!supplierExist) {
      await conn.close();
      return res.status(404).json({ message: "Supplier Not Found" });
    }

    await Supplier.findByIdAndDelete(id);
    await conn.close();
    res.status(204).json({ message: "Supplier Deleted" });
  } catch (error) {
    console.error("Delete supplier error:", error);
    res.status(500).json({ error: "Something went wrong while deleting supplier" });
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

module.exports = { create, fetch, fetchById, update, deleteSupplier };
