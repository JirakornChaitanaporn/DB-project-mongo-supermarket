const express = require("express");
const { fetch, fetchById, create, update, deleteBill , fetchByDateRange } = require("../controllers/BillController.js");

const bill_route = express.Router();

bill_route.get("/fetch", fetch);
bill_route.get("/fetchById/:id", fetchById);
bill_route.post("/create", create);
bill_route.put("/update/:id", update);
bill_route.delete("/delete/:id", deleteBill);
bill_route.get("/fetchByDateRange/:start_date/:end_date", fetchByDateRange)

module.exports = bill_route;
