const express = require("express");
const { fetch, fetchById, create, update, deleteEmployee } = require("../controllers/EmployeeController.js");

const employee_route = express.Router();

employee_route.get("/fetch", fetch);
employee_route.get("/fetchById/:id", fetchById);
employee_route.post("/create", create);
employee_route.put("/update/:id", update);
employee_route.delete("/delete/:id", deleteEmployee);

module.exports = employee_route;
