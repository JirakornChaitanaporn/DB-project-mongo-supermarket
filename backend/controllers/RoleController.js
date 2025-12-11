const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");

// Define schema
const RoleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
    },
    role_description: {
        type: String,
    },
    role_salary: {
        type: Number,
        required: true,
        min: 10000,
    },
}, { collection: "roles" });

// Create
const create = async (req, res) => {
  try {
    const conn = createConnection();
    const Role = conn.model("Role", RoleSchema);
    
    const roleData = new Role(req.body);
    const savedRole = await roleData.save();
    
    await conn.close();
    res.status(200).json(savedRole);
  } catch (error) {
    console.error("Create role error:", error);
    res.status(500).json({ error: "Something went wrong while creating role" });
  }
};

// Read (fetch all or search by role_name)
const fetch = async (req, res) => {
  try {
    const conn = createConnection();
    const Role = conn.model("Role", RoleSchema);
    const { search } = req.query;

    let query = {};
    if (search) {
      query.role_name = { $regex: search, $options: "i" };
    }

    const roles = await Role.find(query);
    await conn.close();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Fetch roles error:", error);
    res.status(500).json({ error: "Server error while fetching roles" });
  }
};

// Update
const update = async (req, res) => {
  try {
    const conn = createConnection();
    const Role = conn.model("Role", RoleSchema);
    const id = req.params.id;
    
    const roleExist = await Role.findOne({ _id: id });

    if (!roleExist) {
      await conn.close();
      return res.status(404).json({ message: "Role Not Found" });
    }

    const updatedRole = await Role.findByIdAndUpdate(id, req.body, { new: true });
    await conn.close();
    res.status(201).json(updatedRole);
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Something went wrong while updating role" });
  }
};

// Delete
const deleteRole = async (req, res) => {
  try {
    const conn = createConnection();
    const Role = conn.model("Role", RoleSchema);
    const id = req.params.id;
    
    const roleExist = await Role.findOne({ _id: id });

    if (!roleExist) {
      await conn.close();
      return res.status(404).json({ message: "Role Not Found" });
    }

    await Role.findByIdAndDelete(id);
    await conn.close();
    res.status(201).json({ message: "Role Deleted" });
  } catch (error) {
    console.error("Delete role error:", error);
    res.status(500).json({ error: "Something went wrong while deleting role" });
  }
};

module.exports = { create, fetch, update, deleteRole };
