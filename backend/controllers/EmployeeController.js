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
    res.status(200).json(updatedEmployee);
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
    res.status(204).json({ message: "Employee Deleted" });
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({ error: "Something went wrong while deleting employee" });
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
