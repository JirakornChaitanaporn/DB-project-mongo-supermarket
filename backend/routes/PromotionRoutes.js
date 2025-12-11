const express = require("express");
const { fetch, fetchById, create, update, deletePromotion } = require("../controllers/PromotionController.js");

const promotion_route = express.Router();

promotion_route.get("/fetch", fetch);
promotion_route.get("/fetchById/:id", fetchById);
promotion_route.post("/create", create);
promotion_route.put("/update/:id", update);
promotion_route.delete("/delete/:id", deletePromotion);

module.exports = promotion_route;
