const mongoose = require("mongoose");

const customOrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    orderType: {
      type: String,
      enum: ["CUSTOM", "BULK"],
      required: true,
      default: "CUSTOM",
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

    flavor: {
      type: String,
      trim: true,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    estimatedTotal: {
      type: Number,
      required: true,
      default: 0,
    },

    finalPrice: {
      type: Number,
      default: 0,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    deliveryMethod: {
      type: String,
      enum: ["PICKUP", "DELIVERY"],
      default: "PICKUP",
    },

    deliveryAddress: {
      type: String,
      trim: true,
      default: "",
    },

    customText: {
      type: String,
      trim: true,
      default: "",
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    inspirationImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "AWAITING_APPROVAL",
        "APPROVED",
        "REJECTED",
        "IN_PROGRESS",
        "READY",
        "COMPLETED",
      ],
      default: "AWAITING_APPROVAL",
    },

    paymentStatus: {
      type: String,
      enum: ["NOT_PAID", "PART_PAID", "PAID"],
      default: "NOT_PAID",
    },

    adminNote: {
      type: String,
      default: "",
    },

    trackingCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomOrder", customOrderSchema);