const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");
const { RoleSchema } = require("../schemas/RoleModel");

// Create
const create = async (req, res) => {
    try {
        const conn = createConnection();
        const Role = conn.model("Role", RoleSchema);

        const roleData = new Role(req.body);
        const valid_err = roleData.validateSync();
        if (valid_err) {
            return res.status(400).json(getMongoErrorMsg(valid_err.errors));
        }

        const savedRole = await roleData.save();

        conn.close();
        res.status(201).json(savedRole);
    } catch (error) {
        console.error("Create role error:", error);
        res.status(500).json({
            error: "Something went wrong while creating role",
        });
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
        conn.close();
        res.status(200).json(roles);
    } catch (error) {
        console.error("Fetch roles error:", error);
        res.status(500).json({ error: "Server error while fetching roles" });
    }
};

const fetchById = async (req, res) => {
    try {
        const conn = createConnection();
        const Role = conn.model("Role", RoleSchema);
        const { id } = req.params;

        const roles = await Role.findById(id);

        conn.close();
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

        const roleExist = await Role.findById(id);

        if (!roleExist) {
            conn.close();
            return res.status(404).json({ message: "Role Not Found" });
        }

        const updatedRole = await Role.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        conn.close();
        res.status(200).json(updatedRole);
    } catch (error) {
        console.error("Update role error:", error);
        res.status(500).json({
            error: "Something went wrong while updating role",
        });
    }
};

// Delete
const deleteRole = async (req, res) => {
    try {
        const conn = createConnection();
        const Role = conn.model("Role", RoleSchema);
        const { id } = req.params;

        const roleExist = await Role.findOne(id);

        if (!roleExist) {
            conn.close();
            return res.status(404).json({ message: "Role Not Found" });
        }

        await Role.findByIdAndDelete(id);
        conn.close();
        res.status(204).json({ message: "Role Deleted" });
    } catch (error) {
        console.error("Delete role error:", error);
        res.status(500).json({
            error: "Something went wrong while deleting role",
        });
    }
};

module.exports = { create, fetch, update, deleteRole, fetchById };
