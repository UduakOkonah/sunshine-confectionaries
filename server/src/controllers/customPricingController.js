const CustomPricing = require("../models/CustomPricing");

const getPublicPricing = async (req, res) => {
  try {
    const prices = await CustomPricing.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(prices);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pricing.",
      error: error.message,
    });
  }
};

const getAdminPricing = async (req, res) => {
  try {
    const prices = await CustomPricing.find().sort({ createdAt: -1 });
    res.json(prices);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch admin pricing.",
      error: error.message,
    });
  }
};

const createPricing = async (req, res) => {
  try {
    const price = await CustomPricing.create(req.body);

    res.status(201).json({
      message: "Pricing added successfully.",
      price,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create pricing.",
      error: error.message,
    });
  }
};

const updatePricing = async (req, res) => {
  try {
    const price = await CustomPricing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!price) {
      return res.status(404).json({
        message: "Pricing not found.",
      });
    }

    res.json({
      message: "Pricing updated successfully.",
      price,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update pricing.",
      error: error.message,
    });
  }
};

const deletePricing = async (req, res) => {
  try {
    const price = await CustomPricing.findByIdAndDelete(req.params.id);

    if (!price) {
      return res.status(404).json({
        message: "Pricing not found.",
      });
    }

    res.json({
      message: "Pricing deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete pricing.",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicPricing,
  getAdminPricing,
  createPricing,
  updatePricing,
  deletePricing,
};