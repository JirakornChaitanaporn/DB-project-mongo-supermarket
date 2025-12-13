const { createConnection } = require("../utils/mongo");
const { EmployeeSchema } = require("../schemas/EmployeeModel");
const { RoleSchema } = require("../schemas/RoleModel");

// Create
const create = async (req, res) => {
  try {
    const conn = createConnection();
    const Employee = conn.model("Employee", EmployeeSchema);

    const employeeData = new Employee(req.body);
    const savedEmployee = await employeeData.save();

    await conn.close();
    res.status(201).json(savedEmployee);
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
    const Role = conn.model("Role", RoleSchema);
    
    const { search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};
    if (search) {
      // Search by first_name or last_name
      query.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
      ];
    }

    // Apply pagination
    const employees = await Employee.find(query)
      .populate("role_id") // include role details
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    // Count total matching documents
    const total = await Employee.countDocuments(query);

    conn.close();
    res.status(200).json({ employees, total });
  } catch (error) {
    console.error("Fetch employees error:", error);
    res.status(500).json({ error: "Server error while fetching employees" });
  }
};

// Update Employee
const update = async (req, res) => {
  const conn = createConnection();
  try {
    const Employee = conn.model("Employee", EmployeeSchema);
    const { id } = req.params;

    // Check existence
    const employeeExist = await Employee.findById(id);
    if (!employeeExist) {
      return res.status(404).json({ message: "Employee Not Found" });
    }

    // Update with validation
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Update employee error:", error);
    return res.status(500).json({ error: "Something went wrong while updating employee" });
  } finally {
    await conn.close();
  }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
  const conn = createConnection();
  try {
    const Employee = conn.model("Employee", EmployeeSchema);
    const { id } = req.params;

    // Check existence
    const employeeExist = await Employee.findById(id);
    if (!employeeExist) {
      return res.status(404).json({ message: "Employee Not Found" });
    }

    // Delete
    await Employee.findByIdAndDelete(id);

    // Success response
    return res.status(200).json({ message: "Employee Deleted" });
  } catch (error) {
    console.error("Delete employee error:", error);
    return res.status(500).json({ error: "Something went wrong while deleting employee" });
  } finally {
    await conn.close();
  }
};

const fetchById = async (req, res) => {
  try {
    const conn = createConnection();
    const Employee = conn.model("Employee", EmployeeSchema);
    const { id } = req.params;

    const employee = await Employee.findById(id);

    await conn.close();
    res.status(200).json(employee);
  } catch (error) {
    console.error("Fetch employee error:", error);
    res.status(500).json({ error: "Server error while fetching employee" });
  }
};

module.exports = { create, fetch, fetchById, update, deleteEmployee };
