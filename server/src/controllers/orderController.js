const Order = require("../models/Order");

const generateOrderNumber = () => {
  const random = Math.floor(100000 + Math.random() * 900000);

  return `SUN-${random}`;
};

const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      deliveryZone,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentReference,
      note,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      orderNumber: generateOrderNumber(),
      customerName,
      phone,
      address,
      deliveryZone,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentReference,
      note,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const {
      orderStatus,
      paymentStatus,
      deliveryStatus,
    } = req.body;

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (deliveryStatus) {
      order.deliveryStatus = deliveryStatus;
    }

    await order.save();

    res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};