const express = require("express");
const { fetch, fetchById, create, update, deleteSupplier , fetchSupplierProduct} = require("../controllers/SupplierController.js");

const supplier_route = express.Router();

supplier_route.get("/fetch", fetch);
supplier_route.get("/fetchById/:id", fetchById);
supplier_route.post("/create", create);
supplier_route.put("/update/:id", update);
supplier_route.delete("/delete/:id", deleteSupplier);
supplier_route.get("/fetchSupplierProduct/:sName", fetchSupplierProduct)

module.exports = supplier_route;
