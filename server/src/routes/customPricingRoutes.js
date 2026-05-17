const express = require("express");

const {
  getPublicPricing,
  getAdminPricing,
  createPricing,
  updatePricing,
  deletePricing,
} = require("../controllers/customPricingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route: customer page uses this to see active prices
router.get("/", getPublicPricing);

// Admin routes
router.get("/admin", protect, adminOnly, getAdminPricing);
router.post("/admin", protect, adminOnly, createPricing);
router.patch("/admin/:id", protect, adminOnly, updatePricing);
router.delete("/admin/:id", protect, adminOnly, deletePricing);

module.exports = router;