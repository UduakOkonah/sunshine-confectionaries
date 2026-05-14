const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    name: String,
    image: String,
    category: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    deliveryZone: {
      type: String,
      required: true,
    },

    items: [orderItemSchema],

    subtotal: {
      type: Number,
      required: true,
    },

    deliveryFee: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["bank-transfer", "card", "cash-on-delivery"],
      required: true,
    },

    paymentReference: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Pending Verification", "Paid", "Failed", "Refunded"],
      default: "Unpaid",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"],
      default: "Pending",
    },

    deliveryStatus: {
      type: String,
      enum: [
        "Not Started",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Failed",
      ],
      default: "Not Started",
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);