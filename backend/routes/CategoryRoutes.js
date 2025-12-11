const express = require("express");
const { fetch, fetchById, create, update, deleteCategory } = require("../controllers/CategoryController.js");

const category_route = express.Router();

category_route.get("/fetch", fetch);
category_route.get("/fetchById/:id", fetchById);
category_route.post("/create", create);
category_route.put("/update/:id", update);
category_route.delete("/delete/:id", deleteCategory);

module.exports = category_route;
