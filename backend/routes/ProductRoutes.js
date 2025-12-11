const express = require("express");
const { fetch, create, update, deleteProduct } = require("../controllers/ProductController.js");

const product_route = express.Router();

product_route.get("/fetch", fetch);
product_route.post("/create", create);
product_route.put("/update/:id", update);
product_route.delete("/delete/:id", deleteProduct);

module.exports = product_route;
