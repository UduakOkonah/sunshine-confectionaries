import { Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  CreditCard,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useOrders } from "../../context/OrderContext";
import DeliveryTimeline from "../../components/orders/DeliveryTimeline";

const steps = [
  {
    label: "Pending",
    icon: Clock,
    statusKeys: ["PENDING", "AWAITING_APPROVAL"],
  },
  {
    label: "Approved",
    icon: PackageCheck,
    statusKeys: ["APPROVED", "CONFIRMED"],
  },
  {
    label: "Preparing",
    icon: ShoppingBag,
    statusKeys: ["PROCESSING", "PREPARING", "IN_PROGRESS"],
  },
  {
    label: "On the Way",
    icon: Truck,
    statusKeys: ["OUT_FOR_DELIVERY", "ON_THE_WAY", "DISPATCHED"],
  },
  {
    label: "Delivered",
    icon: CheckCircle,
    statusKeys: ["DELIVERED", "COMPLETED"],
  },
];

const statusFilters = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Approved",
    value: "APPROVED",
  },
  {
    label: "Preparing",
    value: "PROCESSING",
  },
  {
    label: "On the Way",
    value: "OUT_FOR_DELIVERY",
  },
];

function MyOrders() {
  const { orders } = useOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [reviewingOrder, setReviewingOrder] = useState(null);

  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  const [confirmingDelivery, setConfirmingDelivery] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));

  const normalizeStatus = (status) => {
    if (!status) return "PENDING";

    return String(status).trim().toUpperCase().replaceAll(" ", "_");
  };

  const readableStatus = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === "AWAITING_APPROVAL") return "Awaiting Approval";
    if (normalized === "OUT_FOR_DELIVERY") return "Out for Delivery";
    if (normalized === "ON_THE_WAY") return "On the Way";
    if (normalized === "IN_PROGRESS") return "In Progress";

    return normalized
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getOrderStatus = (order) =>
    normalizeStatus(order.orderStatus || order.status || "PENDING");

  const getDeliveryStatus = (order) =>
    normalizeStatus(order.deliveryStatus || "PENDING");

  const getPaymentStatus = (order) =>
    normalizeStatus(order.paymentStatus || "NOT PAID");

  const getStatusClass = (status) => {
    const normalized = normalizeStatus(status);

    if (["APPROVED", "CONFIRMED"].includes(normalized)) {
      return "bg-green-100 text-green-700";
    }

    if (["DELIVERED", "COMPLETED"].includes(normalized)) {
      return "bg-blue-100 text-blue-700";
    }

    if (
      ["OUT_FOR_DELIVERY", "ON_THE_WAY", "DISPATCHED", "IN_PROGRESS"].includes(
        normalized
      )
    ) {
      return "bg-purple-100 text-purple-700";
    }

    if (["CANCELLED", "CANCELED", "REJECTED"].includes(normalized)) {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const getPaymentClass = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === "PAID") return "bg-green-100 text-green-700";
    if (normalized === "PART_PAID") return "bg-blue-100 text-blue-700";

    return "bg-red-100 text-red-700";
  };

const isDeliveredOrder = (order) => {
  return order.customerConfirmedDelivery === true;
};

const canConfirmDelivery = (order) => {
  const orderStatus = getOrderStatus(order);
  const deliveryStatus = getDeliveryStatus(order);

  return (
    ["DELIVERED", "COMPLETED"].includes(orderStatus) ||
    ["DELIVERED", "COMPLETED"].includes(deliveryStatus)
  );
};

  const isStepActive = (order, step) => {
    const orderStatus = getOrderStatus(order);
    const deliveryStatus = getDeliveryStatus(order);

    const activeStatuses = [orderStatus, deliveryStatus];

    if (step.label === "Pending") {
      return true;
    }

    if (step.label === "Approved") {
      return [
        "APPROVED",
        "CONFIRMED",
        "PROCESSING",
        "PREPARING",
        "IN_PROGRESS",
        "OUT_FOR_DELIVERY",
        "ON_THE_WAY",
        "DISPATCHED",
        "DELIVERED",
        "COMPLETED",
      ].some((status) => activeStatuses.includes(status));
    }

    if (step.label === "Preparing") {
      return [
        "PROCESSING",
        "PREPARING",
        "IN_PROGRESS",
        "OUT_FOR_DELIVERY",
        "ON_THE_WAY",
        "DISPATCHED",
        "DELIVERED",
        "COMPLETED",
      ].some((status) => activeStatuses.includes(status));
    }

    if (step.label === "On the Way") {
      return [
        "OUT_FOR_DELIVERY",
        "ON_THE_WAY",
        "DISPATCHED",
        "DELIVERED",
        "COMPLETED",
      ].some((status) => activeStatuses.includes(status));
    }

    if (step.label === "Delivered") {
      return ["DELIVERED", "COMPLETED"].some((status) =>
        activeStatuses.includes(status)
      );
    }

    return step.statusKeys.some((status) => activeStatuses.includes(status));
  };

  const getOrderDate = (order) => {
    const date = order.createdAt || order.orderDate || order.date;

    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getOrderTotal = (order) => {
    return order.total || order.totalAmount || order.grandTotal || 0;
  };

  const getOrderItemsCount = (order) => {
    return order.items?.length || order.orderItems?.length || 0;
  };

  const searchedOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return orders || [];

    return (orders || []).filter((order) => {
      const searchableText = [
        order.orderNumber,
        order.customerName,
        order.phone,
        order.address,
        order.deliveryZone,
        order.orderStatus,
        order.deliveryStatus,
        order.paymentStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(term);
    });
  }, [orders, searchTerm]);

  const activeOrders = useMemo(() => {
    return searchedOrders.filter((order) => {
      if (isDeliveredOrder(order)) return false;

      if (activeFilter === "ALL") return true;

      const orderStatus = getOrderStatus(order);
      const deliveryStatus = getDeliveryStatus(order);

      return orderStatus === activeFilter || deliveryStatus === activeFilter;
    });
  }, [searchedOrders, activeFilter]);

  const orderHistory = useMemo(() => {
    return searchedOrders.filter((order) => isDeliveredOrder(order));
  }, [searchedOrders]);

  const summary = useMemo(() => {
    const allOrders = orders || [];

    return {
      total: allOrders.length,
      active: allOrders.filter((order) => !isDeliveredOrder(order)).length,
      delivered: allOrders.filter((order) => isDeliveredOrder(order)).length,
      pending: allOrders.filter((order) => getOrderStatus(order) === "PENDING")
        .length,
    };
  }, [orders]);

  const handleConfirmDelivery = async (order) => {
  try {
    setConfirmingDelivery(true);

    await fetch(
      `http://localhost:5000/api/orders/${order._id}/confirm-delivery`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setReviewingOrder(order);
  } catch (error) {
    console.error(error);
  } finally {
    setConfirmingDelivery(false);
  }
};

const handleSubmitReview = async () => {
  try {
    await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId:
          reviewingOrder.items?.[0]?.product?._id ||
          reviewingOrder.items?.[0]?.product,

        orderId: reviewingOrder._id,

        customerName: reviewingOrder.customerName,

        rating: reviewData.rating,

        comment: reviewData.comment,
      }),
    });

    setReviewingOrder(null);

    setReviewData({
      rating: 5,
      comment: "",
    });
  } catch (error) {
    console.error(error);
  }
};

  return (
    <section className="min-h-screen bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
              My Orders
            </p>

            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
              Track your orders.
            </h1>

            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
              Follow your bakery orders from pending approval to delivery.
              Delivered orders are moved into your order history table.
            </p>
          </div>

          <Link
            to="/products"
            className="rounded-[60px] bg-green-500 px-6 py-3 text-center text-sm font-black text-white shadow-lg transition hover:bg-green-600"
          >
            Order More
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[28px] bg-white p-5 shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Total Orders
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {summary.total}
            </h2>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Active Orders
            </p>
            <h2 className="mt-2 text-3xl font-black text-green-700">
              {summary.active}
            </h2>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Pending
            </p>
            <h2 className="mt-2 text-3xl font-black text-yellow-600">
              {summary.pending}
            </h2>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Delivered History
            </p>
            <h2 className="mt-2 text-3xl font-black text-blue-700">
              {summary.delivered}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-[32px] bg-white p-5 shadow-xl">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search order number, customer name, status, address..."
                className="w-full rounded-[22px] border border-yellow-200 bg-yellow-50 py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-green-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-full px-5 py-3 text-xs font-black transition ${
                    activeFilter === filter.value
                      ? "bg-green-500 text-white shadow-lg shadow-green-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-[32px] bg-white p-8 text-center shadow-xl">
            <Clock className="mx-auto text-yellow-500" size={44} />

            <h2 className="mt-4 text-2xl font-black text-slate-900">
              No orders yet
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-600">
              Your placed orders will appear here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-[60px] bg-green-500 px-6 py-3 text-sm font-black text-white"
            >
              Start Ordering
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                    Live Tracking
                  </p>

                  <h2 className="mt-1 text-3xl font-black text-slate-900">
                    Active Orders
                  </h2>
                </div>

                <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-600 shadow">
                  {activeOrders.length} active
                </p>
              </div>

              {activeOrders.length === 0 ? (
                <div className="mt-5 rounded-[28px] bg-white p-8 text-center shadow-lg">
                  <PackageCheck
                    className="mx-auto text-green-600"
                    size={42}
                  />

                  <h3 className="mt-4 text-xl font-black text-slate-900">
                    No active orders
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Active orders will appear here until they are delivered.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-5">
                  {activeOrders.map((order, index) => (
                    <article
                      key={order._id || order.id || order.orderNumber || index}
                      className="rounded-[34px] bg-white p-5 shadow-xl"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">
                            {order.orderNumber || "Pending Order No"}
                          </p>

                          <h2 className="mt-1 text-xl font-black text-slate-900">
                            {order.customerName || "Customer"}
                          </h2>

                          <p className="mt-1 text-sm font-bold text-slate-500">
                            {order.deliveryZone || "No zone"} •{" "}
                            {order.address || "No address"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-black ${getStatusClass(
                              order.orderStatus
                            )}`}
                          >
                            {readableStatus(order.orderStatus)}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-black ${getPaymentClass(
                              order.paymentStatus
                            )}`}
                          >
                            {readableStatus(order.paymentStatus)}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-black ${getStatusClass(
                              order.deliveryStatus
                            )}`}
                          >
                            {readableStatus(order.deliveryStatus)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 rounded-[24px] bg-yellow-50 p-4">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                          {steps.map((step) => {
                            const Icon = step.icon;
                            const active = isStepActive(order, step);

                            return (
                              <div
                                key={step.label}
                                className={`flex items-center gap-3 rounded-[20px] p-3 transition ${
                                  active
                                    ? "bg-green-500 text-white shadow-md"
                                    : "bg-white text-slate-500"
                                }`}
                              >
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                    active ? "bg-white/20" : "bg-yellow-100"
                                  }`}
                                >
                                  <Icon size={18} />
                                </div>

                                <div>
                                  <p className="text-xs font-black">
                                    {step.label}
                                  </p>
                                  <p className="text-[11px] font-bold opacity-80">
                                    {active ? "Done" : "Waiting"}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-8 rounded-[28px] bg-slate-50 p-5">
                        <h3 className="mb-6 text-lg font-black text-slate-900">
                          Delivery Timeline
                        </h3>

                        <DeliveryTimeline
                          currentStatus={order.deliveryStatus || "Pending"}
                        />
                      </div>

                      <div className="mt-5 grid gap-3 border-t border-yellow-100 pt-4 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            Total
                          </p>

                          <h3 className="mt-1 text-xl font-black text-green-700">
                            {formatPrice(getOrderTotal(order))}
                          </h3>
                        </div>

                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            Payment Method
                          </p>

                          <p className="mt-1 flex items-center gap-2 text-sm font-black text-slate-700">
                            <CreditCard
                              size={16}
                              className="text-green-600"
                            />
                            {order.paymentMethod || "Not selected"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                            Items
                          </p>

                          <p className="mt-1 text-sm font-black text-slate-700">
                            {getOrderItemsCount(order)} item
                            {getOrderItemsCount(order) === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-14">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                    Archive
                  </p>

                  <h2 className="mt-1 text-3xl font-black text-slate-900">
                    Delivered Order History
                  </h2>
                </div>

                <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-600 shadow">
                  {orderHistory.length} delivered
                </p>
              </div>

              <div className="mt-5 overflow-hidden rounded-[28px] bg-white shadow-xl">
                {orderHistory.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle
                      className="mx-auto text-slate-300"
                      size={42}
                    />

                    <h3 className="mt-4 text-xl font-black text-slate-900">
                      No delivered orders yet
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Once an order is marked as delivered, it will move here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                            Order No
                          </th>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                            Customer
                          </th>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                            Items
                          </th>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                            Total
                          </th>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                            Payment
                          </th>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                            Delivered
                          </th>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {orderHistory.map((order, index) => (
                          <tr
                            key={
                              order._id || order.id || order.orderNumber || index
                            }
                            className="transition hover:bg-yellow-50"
                          >
                            <td className="px-5 py-4">
                              <p className="text-sm font-black text-slate-900">
                                {order.orderNumber || "N/A"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm font-black text-slate-900">
                                {order.customerName || "Customer"}
                              </p>

                              <p className="mt-1 text-xs font-semibold text-slate-400">
                                {order.deliveryZone || "No zone"}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-slate-600">
                              {getOrderItemsCount(order)}
                            </td>

                            <td className="px-5 py-4 text-sm font-black text-green-700">
                              {formatPrice(getOrderTotal(order))}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1.5 text-xs font-black ${getPaymentClass(
                                  order.paymentStatus
                                )}`}
                              >
                                {readableStatus(order.paymentStatus)}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-slate-600">
                              {getOrderDate(order)}
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-black text-blue-700">
                                <CheckCircle size={14} />
                                Delivered
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default MyOrders;