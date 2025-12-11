const express = require("express");
const { fetch, create, update, deleteBill } = require("../controllers/BillController.js");

const bill_route = express.Router();

bill_route.get("/fetch", fetch);
bill_route.post("/create", create);
bill_route.put("/update/:id", update);
bill_route.delete("/delete/:id", deleteBill);

module.exports = bill_route;
