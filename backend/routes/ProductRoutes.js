const express = require("express");
const { fetch, fetchById, create, update, deleteProduct } = require("../controllers/ProductController.js");

const product_route = express.Router();

product_route.get("/fetch", fetch);
product_route.get("/fetchById/:id", fetchById);
product_route.post("/create", create);
product_route.put("/update/:id", update);
product_route.delete("/delete/:id", deleteProduct);

module.exports = product_route;
