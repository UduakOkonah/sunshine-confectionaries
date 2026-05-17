const express = require("express");

const {
  createCustomOrder,
  getMyCustomOrders,
  getAllCustomOrders,
  updateCustomOrder,
} = require("../controllers/customOrderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", upload.single("image"), createCustomOrder);

router.get("/track", getMyCustomOrders);

router.get("/admin", protect, adminOnly, getAllCustomOrders);

router.patch("/admin/:id", protect, adminOnly, updateCustomOrder);

module.exports = router;