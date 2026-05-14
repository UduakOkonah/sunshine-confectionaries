import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchMyOrders = async () => {
    if (!isAuthenticated || user?.role === "admin") return;

    try {
      setLoadingOrders(true);
      const { data } = await api.get("/orders/my-orders");
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load your orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAllOrders = async () => {
    if (!isAuthenticated || user?.role !== "admin") return;

    try {
      setLoadingOrders(true);
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    if (user?.role === "admin") {
      fetchAllOrders();
    } else {
      fetchMyOrders();
    }
  }, [isAuthenticated, user]);

  const createOrder = async (orderData) => {
    try {
      const cleanedItems = orderData.items.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        image: item.image,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      }));

      const { data } = await api.post("/orders", {
        ...orderData,
        items: cleanedItems,
      });

      setOrders((currentOrders) => [data.order, ...currentOrders]);

      toast.success("Order placed. Waiting for admin approval.");

      return data.order;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order");
      return null;
    }
  };

  const updateOrder = async (orderId, updates) => {
    try {
      const { data } = await api.put(`/orders/${orderId}`, updates);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === data.order._id ? data.order : order
        )
      );

      toast.success("Order updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders((currentOrders) =>
      currentOrders.filter((order) => order._id !== orderId)
    );

    toast.success("Order removed locally");

    // Backend delete route can be added later.
  };

  const orderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((order) => order.orderStatus === "Pending").length,
      approved: orders.filter((order) => order.orderStatus === "Approved")
        .length,
      delivered: orders.filter((order) => order.deliveryStatus === "Delivered")
        .length,
    };
  }, [orders]);

  const value = {
    orders,
    loadingOrders,
    orderStats,
    fetchMyOrders,
    fetchAllOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }

  return context;
}