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

    const { search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};
    if (search) {
      query.promotion_name = { $regex: search, $options: "i" };
    }

    // Apply pagination
    const promotions = await Promotion.find(query)
      .populate("product_id") // optional: populate product details
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    // Count total matching documents
    const total = await Promotion.countDocuments(query);

    conn.close();
    res.status(200).json({ promotions, total });
  } catch (error) {
    console.error("Fetch promotions error:", error);
    res.status(500).json({ error: "Server error while fetching promotions" });
  }
};

// Update Promotion
const update = async (req, res) => {
  const conn = createConnection();
  try {
    const Promotion = conn.model("Promotion", PromotionSchema);
    const { id } = req.params;

    // Check existence
    const promotionExist = await Promotion.findById(id);
    if (!promotionExist) {
      return res.status(404).json({ message: "Promotion Not Found" });
    }

    // Update with validation
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedPromotion);
  } catch (error) {
    console.error("Update promotion error:", error);
    return res.status(500).json({ error: "Something went wrong while updating promotion" });
  } finally {
    await conn.close();
  }
};

// Delete Promotion
const deletePromotion = async (req, res) => {
  const conn = createConnection();
  try {
    const Promotion = conn.model("Promotion", PromotionSchema);
    const { id } = req.params;

    // Check existence
    const promotionExist = await Promotion.findById(id);
    if (!promotionExist) {
      return res.status(404).json({ message: "Promotion Not Found" });
    }

    // Delete
    await Promotion.findByIdAndDelete(id);

    // Success response
    return res.status(200).json({ message: "Promotion Deleted" });
  } catch (error) {
    console.error("Delete promotion error:", error);
    return res.status(500).json({ error: "Something went wrong while deleting promotion" });
  } finally {
    await conn.close();
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
