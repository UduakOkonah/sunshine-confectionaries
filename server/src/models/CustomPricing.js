const mongoose = require("mongoose");

const customPricingSchema = new mongoose.Schema(
  {
    orderType: {
      type: String,
      enum: ["CUSTOM", "BULK"],
      required: true,
    },

    itemCategory: {
      type: String,
      required: true,
      trim: true,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: String,
      trim: true,
      default: "",
    },

    packageLabel: {
      type: String,
      trim: true,
      default: "",
    },

    minQuantity: {
      type: Number,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomPricing", customPricingSchema);