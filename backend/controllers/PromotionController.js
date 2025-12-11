const { createConnection } = require("../utils/mongo");
const mongoose = require("mongoose");
const { PromotionSchema } = require("../schemas/PromotionModel");

// Create
const create = async (req, res) => {
  try {
    const conn = createConnection();
    const Promotion = conn.model("Promotion", PromotionSchema);

    const promotionData = new Promotion(req.body);
    const savedPromotion = await promotionData.save();

    await conn.close();
    res.status(200).json(savedPromotion);
  } catch (error) {
    console.error("Create promotion error:", error);
    res.status(500).json({ error: "Something went wrong while creating promotion" });
  }
};

// Read (fetch all or search by promotion_name)
const fetch = async (req, res) => {
  try {
    const conn = createConnection();
    const Promotion = conn.model("Promotion", PromotionSchema);

    // Register referenced schemas
    const ProductSchema = new mongoose.Schema({
      product_name: { type: String, required: true },
      price: { type: Number, required: true },
      supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
      category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
      quantity: { type: Number, required: true },
      created_at: { type: Date, default: Date.now }
    }, { collection: "products" });
    conn.model("Product", ProductSchema);

    const { search } = req.query;

    let query = {};
    if (search) {
      query.promotion_name = { $regex: search, $options: "i" };
    }

    const promotions = await Promotion.find(query)
      .populate("product_id", "product_name price");

    await conn.close();
    res.status(200).json(promotions);
  } catch (error) {
    console.error("Fetch promotions error:", error);
    res.status(500).json({ error: "Server error while fetching promotions" });
  }
};

// Update
const update = async (req, res) => {
  try {
    const conn = createConnection();
    const Promotion = conn.model("Promotion", PromotionSchema);
    const id = req.params.id;

    const promotionExist = await Promotion.findOne({ _id: id });

    if (!promotionExist) {
      await conn.close();
      return res.status(404).json({ message: "Promotion Not Found" });
    }

    const updatedPromotion = await Promotion.findByIdAndUpdate(id, req.body, { new: true });
    await conn.close();
    res.status(201).json(updatedPromotion);
  } catch (error) {
    console.error("Update promotion error:", error);
    res.status(500).json({ error: "Something went wrong while updating promotion" });
  }
};

// Delete
const deletePromotion = async (req, res) => {
  try {
    const conn = createConnection();
    const Promotion = conn.model("Promotion", PromotionSchema);
    const id = req.params.id;

    const promotionExist = await Promotion.findOne({ _id: id });

    if (!promotionExist) {
      await conn.close();
      return res.status(404).json({ message: "Promotion Not Found" });
    }

    await Promotion.findByIdAndDelete(id);
    await conn.close();
    res.status(201).json({ message: "Promotion Deleted" });
  } catch (error) {
    console.error("Delete promotion error:", error);
    res.status(500).json({ error: "Something went wrong while deleting promotion" });
  }
};

const fetchById = async (req, res) => {
  try {
    const conn = createConnection();
    const Promotion = conn.model("Promotion", PromotionSchema);
    const { id } = req.params;

    const promotion = await Promotion.findById(id);

    await conn.close();
    res.status(200).json(promotion);
  } catch (error) {
    console.error("Fetch promotion error:", error);
    res.status(500).json({ error: "Server error while fetching promotion" });
  }
};

module.exports = { create, fetch, fetchById, update, deletePromotion };
