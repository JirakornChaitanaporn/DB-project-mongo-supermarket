const express = require("express");
const { fetch, fetchById, create, update, deleteProduct , fetchProductByName , fetchIsLowQuantity} = require("../controllers/ProductController.js");

const product_route = express.Router();

product_route.get("/fetch", fetch);
product_route.get("/fetchById/:id", fetchById);
product_route.post("/create", create);
product_route.put("/update/:id", update);
product_route.delete("/delete/:id", deleteProduct);
product_route.get("/fetchProductByName/:pName" , fetchProductByName)
product_route.get("/fetchIsLowQuantity/:amount/:name", fetchIsLowQuantity)

module.exports = product_route;
