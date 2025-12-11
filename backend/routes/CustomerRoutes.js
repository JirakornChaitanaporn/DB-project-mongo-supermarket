const express = require("express");
const { fetch, fetchById, create, update, deleteCustomer } = require("../controllers/CustomerController.js");

const customer_route = express.Router();

customer_route.get("/fetch", fetch);
customer_route.get("/fetchById/:id", fetchById);
customer_route.post("/create", create);
customer_route.put("/update/:id", update);
customer_route.delete("/delete/:id", deleteCustomer);

module.exports = customer_route;
