const express = require("express");
const { fetch, create, update, deleteSupplier } = require("../controllers/SupplierController.js");

const supplier_route = express.Router();

supplier_route.get("/fetch", fetch);
supplier_route.post("/create", create);
supplier_route.put("/update/:id", update);
supplier_route.delete("/delete/:id", deleteSupplier);

module.exports = supplier_route;
