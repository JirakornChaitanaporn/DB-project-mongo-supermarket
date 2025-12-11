const express = require("express");
const { fetch, create, update, deleteBillItem } = require("../controllers/BillItemController");

const bill_item_route = express.Router();

bill_item_route.get("/fetch", fetch);
bill_item_route.post("/create", create);
bill_item_route.put("/update/:id", update);
bill_item_route.delete("/delete/:id", deleteBillItem);

module.exports = bill_item_route;
