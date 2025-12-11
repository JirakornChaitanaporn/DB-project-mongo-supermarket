const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");

// Define schema
const EmployeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
    },
    gender: {
        type: String,
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },
    hire_date: {
        type: Date,
        default: Date.now,
    },
}, { collection: "employees"});

// Create
const create = async (req, res) => {
  try {
    const conn = createConnection();
    const Employee = conn.model("Employee", EmployeeSchema);
    
    const employeeData = new Employee(req.body);
    const savedEmployee = await employeeData.save();
    
    await conn.close();
    res.status(200).json(savedEmployee);
  } catch (error) {
    console.error("Create employee error:", error);
    res.status(500).json({ error: "Something went wrong while creating employee" });
  }
};

// Read (fetch all or search by first_name / last_name)
const fetch = async (req, res) => {
  try {
    const conn = createConnection();
    const Employee = conn.model("Employee", EmployeeSchema);
    
    // Define and register Role schema for population
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
    
    const Role = conn.model("Role", RoleSchema);
    
    const { search } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } }
      ];
    }

    const employees = await Employee.find(query)
      .populate("role_id", "role_name role_salary");

    await conn.close();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Fetch employees error:", error);
    res.status(500).json({ error: "Server error while fetching employees" });
  }
};

// Update
const update = async (req, res) => {
  try {
    const conn = createConnection();
    const Employee = conn.model("Employee", EmployeeSchema);
    const id = req.params.id;
    
    const employeeExist = await Employee.findOne({ _id: id });

    if (!employeeExist) {
      await conn.close();
      return res.status(404).json({ message: "Employee Not Found" });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    await conn.close();
    res.status(201).json(updatedEmployee);
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({ error: "Something went wrong while updating employee" });
  }
};

// Delete
const deleteEmployee = async (req, res) => {
  try {
    const conn = createConnection();
    const Employee = conn.model("Employee", EmployeeSchema);
    const id = req.params.id;
    
    const employeeExist = await Employee.findOne({ _id: id });

    if (!employeeExist) {
      await conn.close();
      return res.status(404).json({ message: "Employee Not Found" });
    }

    await Employee.findByIdAndDelete(id);
    await conn.close();
    res.status(201).json({ message: "Employee Deleted" });
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({ error: "Something went wrong while deleting employee" });
  }
};

module.exports = { create, fetch, update, deleteEmployee };
