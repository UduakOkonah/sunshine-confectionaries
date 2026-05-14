const axios = require("axios");
const Order = require("../models/Order");

const initializePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("user", "email name");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (String(order.user._id) !== String(req.user._id)) {
      return res.status(403).json({
        message: "You cannot pay for this order",
      });
    }

    const amountInKobo = Math.round(order.total * 100);

    const reference = `SUN-${order._id}-${Date.now()}`;

    const { data } = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: order.user.email,
        amount: amountInKobo,
        currency: "NGN",
        reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    order.paymentMethod = "card";
    order.paymentReference = reference;
    order.paymentStatus = "Pending Verification";

    await order.save();

    res.status(200).json({
      message: "Payment initialized",
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      accessCode: data.data.access_code,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Payment initialization failed",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const { data } = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = data.data;

    const order = await Order.findOne({
      paymentReference: reference,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found for this payment reference",
      });
    }

    if (paystackData.status === "success") {
      order.paymentStatus = "Paid";
      order.paymentMethod = "card";
    } else {
      order.paymentStatus = "Failed";
    }

    await order.save();

    res.status(200).json({
      message: "Payment verified",
      status: paystackData.status,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Payment verification failed",
    });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
};