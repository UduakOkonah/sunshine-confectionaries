import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const normalizeOrders = (data) => {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.orders)) return data.orders;

    if (Array.isArray(data?.order)) return data.order;

    return [];
  };

  const fetchMyOrders = async () => {
    if (!isAuthenticated || user?.role === "admin") return;

    try {
      setLoadingOrders(true);

      const { data } = await api.get("/orders/my-orders");

      setOrders(normalizeOrders(data));
    } catch (error) {
      setOrders([]);
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

      setOrders(normalizeOrders(data));
    } catch (error) {
      setOrders([]);
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

      const newOrder = data.order || data;

      setOrders((currentOrders) =>
        Array.isArray(currentOrders)
          ? [newOrder, ...currentOrders]
          : [newOrder]
      );

      toast.success("Order placed. Waiting for admin approval.");

      return newOrder;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order");
      return null;
    }
  };

  const updateOrder = async (orderId, updates) => {
    try {
      const { data } = await api.put(`/orders/${orderId}`, updates);

      const updatedOrder = data.order || data;

      setOrders((currentOrders) =>
        Array.isArray(currentOrders)
          ? currentOrders.map((order) =>
              (order._id || order.id) ===
              (updatedOrder._id || updatedOrder.id)
                ? updatedOrder
                : order
            )
          : []
      );

      toast.success("Order updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders((currentOrders) =>
      Array.isArray(currentOrders)
        ? currentOrders.filter(
            (order) => (order._id || order.id) !== orderId
          )
        : []
    );

    toast.success("Order removed locally");
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  const orderStats = useMemo(() => {
    return {
      total: safeOrders.length,
      pending: safeOrders.filter((order) => order.orderStatus === "Pending")
        .length,
      approved: safeOrders.filter((order) => order.orderStatus === "Approved")
        .length,
      delivered: safeOrders.filter(
        (order) => order.deliveryStatus === "Delivered"
      ).length,
    };
  }, [safeOrders]);

  const value = {
    orders: safeOrders,
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