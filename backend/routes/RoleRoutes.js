const express = require("express");
const { fetch, create, update, deleteRole , fetchById } = require("../controllers/RoleController.js");

const role_route = express.Router();

role_route.get("/fetch", fetch);
role_route.get("/fetchById/:id", fetchById)
role_route.post("/create", create);
role_route.put("/update/:id", update);
role_route.delete("/delete/:id", deleteRole);

module.exports = role_route;
