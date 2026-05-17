const mongoose = require("mongoose");
const CustomOrder = require("../models/CustomOrder");
const CustomPricing = require("../models/CustomPricing");

const generateTrackingCode = () => {
  const datePart = Date.now().toString().slice(-6);
  const randomPart = Math.floor(100 + Math.random() * 900);

  return `SC-${datePart}-${randomPart}`;
};

const getUploadedImagePath = (req) => {
  if (!req.file) return req.body.inspirationImage || "";

  if (req.file.buffer) {
    return `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;
  }

  return req.file.path || req.file.secure_url || req.file.url || "";
};

const createCustomOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      orderType,
      pricingId,
      quantity,
      flavor,
      eventDate,
      deliveryMethod,
      deliveryAddress,
      customText,
      note,
    } = req.body;

    if (!customerName || !phone || !orderType || !pricingId || !eventDate) {
      return res.status(400).json({
        message:
          "Customer name, phone number, order type, selected item, and event date are required.",
      });
    }

    if (!["CUSTOM", "BULK"].includes(orderType)) {
      return res.status(400).json({
        message: "Invalid order type.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(pricingId)) {
      return res.status(400).json({
        message: "Invalid selected item or price.",
      });
    }

    const pricing = await CustomPricing.findById(pricingId);

    if (!pricing) {
      return res.status(404).json({
        message: "Selected price/item was not found.",
      });
    }

    if (!pricing.isActive) {
      return res.status(400).json({
        message: "Selected price/item is no longer active.",
      });
    }

    if (pricing.orderType !== orderType) {
      return res.status(400).json({
        message: "Selected price does not match the order type.",
      });
    }

    let numericQuantity = Math.max(1, Number(quantity) || 1);

    if (orderType === "BULK" && pricing.minQuantity) {
      numericQuantity = Math.max(numericQuantity, Number(pricing.minQuantity));
    }

    const unitPrice = Number(pricing.price) || 0;
    const estimatedTotal = unitPrice * numericQuantity;

    const order = await CustomOrder.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email || "",
      orderType,
      itemCategory: pricing.itemCategory,
      itemName: pricing.itemName,
      size: pricing.size || pricing.packageLabel || "",
      flavor: flavor || "",
      quantity: numericQuantity,
      unitPrice,
      estimatedTotal,
      finalPrice: estimatedTotal,
      eventDate,
      deliveryMethod: deliveryMethod || "PICKUP",
      deliveryAddress: deliveryAddress || "",
      customText: customText || "",
      note: note || "",
      inspirationImage: getUploadedImagePath(req),
      status: "AWAITING_APPROVAL",
      paymentStatus: "NOT_PAID",
      adminNote: "",
      trackingCode: generateTrackingCode(),
    });

    return res.status(201).json({
      message: "Order submitted successfully and awaiting admin approval.",
      order,
    });
  } catch (error) {
    console.error("CUSTOM ORDER CREATE ERROR:", error);

    return res.status(500).json({
      message: "Failed to submit custom order.",
      error: error.message,
    });
  }
};

const getMyCustomOrders = async (req, res) => {
  try {
    const { phone, trackingCode } = req.query;

    const filter = {};

    if (trackingCode) {
      filter.trackingCode = trackingCode;
    } else if (phone) {
      filter.phone = phone;
    } else {
      return res.status(400).json({
        message: "Please provide phone number or tracking code.",
      });
    }

    const orders = await CustomOrder.find(filter).sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error("CUSTOM ORDER TRACK ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
};

const getAllCustomOrders = async (req, res) => {
  try {
    const orders = await CustomOrder.find().sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error("CUSTOM ORDER ADMIN FETCH ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch custom orders.",
      error: error.message,
    });
  }
};

const updateCustomOrder = async (req, res) => {
  try {
    const { status, finalPrice, adminNote, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid order ID.",
      });
    }

    const order = await CustomOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (status) order.status = status;
    if (finalPrice !== undefined) order.finalPrice = Number(finalPrice);
    if (adminNote !== undefined) order.adminNote = adminNote;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    return res.json({
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    console.error("CUSTOM ORDER UPDATE ERROR:", error);

    return res.status(500).json({
      message: "Failed to update order.",
      error: error.message,
    });
  }
};

module.exports = {
  createCustomOrder,
  getMyCustomOrders,
  getAllCustomOrders,
  updateCustomOrder,
};