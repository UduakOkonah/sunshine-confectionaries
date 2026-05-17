import axios from "axios";
import {
  CheckCircle,
  Clock,
  History,
  ImageIcon,
  Save,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "https://sunshine-confectionaries.onrender.com/api";

const statusOptions = [
  "AWAITING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "IN_PROGRESS",
  "READY",
  "COMPLETED",
];

const paymentStatusOptions = ["NOT_PAID", "PART_PAID", "PAID"];

const historyStatuses = ["COMPLETED", "REJECTED"];

function AdminCustomOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getAdminToken = () => {
    return (
      localStorage.getItem("sunshine-token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      ""
    );
  };

  const getAuthConfig = () => {
    const token = getAdminToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = getAdminToken();

      if (!token) {
        toast.error("Admin token not found. Please login again.");
        return;
      }

      const { data } = await axios.get(
        `${API_URL}/custom-orders/admin`,
        getAuthConfig()
      );

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch custom orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const updateOrder = async (orderId, payload) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/custom-orders/admin/${orderId}`,
        payload,
        getAuthConfig()
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );

      toast.success("Order updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order.");
    }
  };

  const handleFieldChange = (orderId, field, value) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              [field]: value,
            }
          : order
      )
    );
  };

  const getStatusStyle = (status) => {
    if (status === "APPROVED") return "bg-green-100 text-green-700";
    if (status === "REJECTED") return "bg-red-100 text-red-700";
    if (status === "COMPLETED") return "bg-blue-100 text-blue-700";
    if (status === "IN_PROGRESS") return "bg-purple-100 text-purple-700";
    if (status === "READY") return "bg-cyan-100 text-cyan-700";

    return "bg-yellow-100 text-yellow-700";
  };

  const getPaymentStyle = (status) => {
    if (status === "PAID") return "bg-green-100 text-green-700";
    if (status === "PART_PAID") return "bg-blue-100 text-blue-700";

    return "bg-red-100 text-red-700";
  };

  const readableStatus = (status) => {
    if (!status) return "PENDING";
    return status.replaceAll("_", " ");
  };

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return orders;

    return orders.filter((order) => {
      const searchText = [
        order.customerName,
        order.phone,
        order.email,
        order.itemName,
        order.size,
        order.orderType,
        order.status,
        order.paymentStatus,
        order.trackingCode,
        order.deliveryMethod,
        order.deliveryAddress,
        order.customText,
        order.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchText.includes(term);
    });
  }, [orders, searchTerm]);

  const activeOrders = useMemo(() => {
    return filteredOrders.filter(
      (order) => !historyStatuses.includes(order.status)
    );
  }, [filteredOrders]);

  const historyOrders = useMemo(() => {
    return filteredOrders.filter((order) =>
      historyStatuses.includes(order.status)
    );
  }, [filteredOrders]);

  const summary = useMemo(() => {
    return {
      total: orders.length,
      awaiting: orders.filter((order) => order.status === "AWAITING_APPROVAL")
        .length,
      inProgress: orders.filter((order) => order.status === "IN_PROGRESS")
        .length,
      ready: orders.filter((order) => order.status === "READY").length,
      history: orders.filter((order) => historyStatuses.includes(order.status))
        .length,
    };
  }, [orders]);

  if (loading) {
    return (
      <section className="p-6">
        <p className="font-bold text-slate-600">Loading custom orders...</p>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-green-600">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Custom Order Requests
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage custom and bulk orders. Active requests stay as compact
            cards, while completed or rejected orders move into the history
            table.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="w-fit rounded-full bg-green-500 px-5 py-3 text-sm font-black text-white transition hover:bg-green-600"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl bg-white p-5 shadow">
          <p className="text-xs font-black uppercase text-slate-400">
            Total Orders
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            {summary.total}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow">
          <p className="text-xs font-black uppercase text-slate-400">
            Awaiting
          </p>
          <h2 className="mt-2 text-3xl font-black text-yellow-600">
            {summary.awaiting}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow">
          <p className="text-xs font-black uppercase text-slate-400">
            In Progress
          </p>
          <h2 className="mt-2 text-3xl font-black text-purple-600">
            {summary.inProgress}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow">
          <p className="text-xs font-black uppercase text-slate-400">Ready</p>
          <h2 className="mt-2 text-3xl font-black text-cyan-600">
            {summary.ready}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow">
          <p className="text-xs font-black uppercase text-slate-400">
            History
          </p>
          <h2 className="mt-2 text-3xl font-black text-blue-600">
            {summary.history}
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-5 shadow">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by customer, phone, item, tracking code, status..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-green-400"
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Active Requests
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Pending, Approved, In Progress & Ready
            </h2>
          </div>

          <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-600 shadow">
            {activeOrders.length} active
          </p>
        </div>

        {activeOrders.length === 0 ? (
          <div className="mt-5 rounded-3xl bg-white p-8 text-center shadow">
            <Clock className="mx-auto text-yellow-500" size={42} />

            <h2 className="mt-4 text-xl font-black text-slate-900">
              No active custom orders
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              New customer requests will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            {activeOrders.map((order) => (
              <article
                key={order._id}
                className="rounded-[28px] bg-white p-4 shadow-lg"
              >
                <div className="grid gap-4 md:grid-cols-[110px_1fr]">
                  <div>
                    {order.inspirationImage ? (
                      <img
                        src={order.inspirationImage}
                        alt={order.itemName}
                        className="h-28 w-full rounded-[20px] object-cover shadow-sm md:h-32"
                      />
                    ) : (
                      <div className="flex h-28 w-full items-center justify-center rounded-[20px] bg-yellow-50 text-slate-400 md:h-32">
                        <ImageIcon size={28} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-black text-slate-900">
                          {order.itemName} {order.size ? `— ${order.size}` : ""}
                        </h3>

                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {order.customerName} • {order.phone}
                        </p>

                        {order.email && (
                          <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                            {order.email}
                          </p>
                        )}

                        <p className="mt-1 text-xs font-bold text-green-700">
                          {order.trackingCode}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-[11px] font-black ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {readableStatus(order.status)}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-4">
                      <div className="rounded-2xl bg-yellow-50 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-400">
                          Type
                        </p>
                        <p className="mt-1 text-xs font-black text-slate-900">
                          {order.orderType}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-yellow-50 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-400">
                          Qty
                        </p>
                        <p className="mt-1 text-xs font-black text-slate-900">
                          {order.quantity}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-yellow-50 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-400">
                          Est.
                        </p>
                        <p className="mt-1 text-xs font-black text-green-700">
                          {formatNaira(order.estimatedTotal)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-yellow-50 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-400">
                          Date
                        </p>
                        <p className="mt-1 text-xs font-black text-slate-900">
                          {formatDate(order.eventDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-4">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-400">
                          Unit
                        </p>
                        <p className="mt-1 text-xs font-black text-slate-900">
                          {formatNaira(order.unitPrice)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-400">
                          Final
                        </p>
                        <p className="mt-1 text-xs font-black text-green-700">
                          {formatNaira(order.finalPrice)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-400">
                          Delivery
                        </p>
                        <p className="mt-1 text-xs font-black text-slate-900">
                          {order.deliveryMethod}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase text-slate-400">
                          Payment
                        </p>
                        <p className="mt-1 text-xs font-black text-slate-900">
                          {readableStatus(order.paymentStatus)}
                        </p>
                      </div>
                    </div>

                    {(order.deliveryAddress || order.customText || order.note) && (
                      <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs leading-6 text-slate-600">
                        {order.deliveryAddress && (
                          <p>
                            <span className="font-black text-slate-900">
                              Address:
                            </span>{" "}
                            {order.deliveryAddress}
                          </p>
                        )}

                        {order.customText && (
                          <p>
                            <span className="font-black text-slate-900">
                              Custom Text:
                            </span>{" "}
                            {order.customText}
                          </p>
                        )}

                        {order.note && (
                          <p>
                            <span className="font-black text-slate-900">
                              Note:
                            </span>{" "}
                            {order.note}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-4 grid gap-2 md:grid-cols-4">
                      <select
                        value={order.status || "AWAITING_APPROVAL"}
                        onChange={(event) =>
                          handleFieldChange(
                            order._id,
                            "status",
                            event.target.value
                          )
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold outline-none focus:border-green-400"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {readableStatus(status)}
                          </option>
                        ))}
                      </select>

                      <select
                        value={order.paymentStatus || "NOT_PAID"}
                        onChange={(event) =>
                          handleFieldChange(
                            order._id,
                            "paymentStatus",
                            event.target.value
                          )
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold outline-none focus:border-green-400"
                      >
                        {paymentStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {readableStatus(status)}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        value={order.finalPrice || ""}
                        onChange={(event) =>
                          handleFieldChange(
                            order._id,
                            "finalPrice",
                            event.target.value
                          )
                        }
                        placeholder="Final price"
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold outline-none focus:border-green-400"
                      />

                      <input
                        type="text"
                        value={order.adminNote || ""}
                        onChange={(event) =>
                          handleFieldChange(
                            order._id,
                            "adminNote",
                            event.target.value
                          )
                        }
                        placeholder="Admin note"
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold outline-none focus:border-green-400"
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateOrder(order._id, {
                            status: order.status,
                            finalPrice: Number(order.finalPrice) || 0,
                            adminNote: order.adminNote || "",
                            paymentStatus: order.paymentStatus || "NOT_PAID",
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2.5 text-xs font-black text-white transition hover:bg-green-600"
                      >
                        <Save size={14} />
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateOrder(order._id, {
                            status: "APPROVED",
                            finalPrice:
                              Number(order.finalPrice) ||
                              Number(order.estimatedTotal) ||
                              0,
                            adminNote:
                              order.adminNote ||
                              "Approved. Please proceed with payment.",
                            paymentStatus: order.paymentStatus || "NOT_PAID",
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateOrder(order._id, {
                            status: "REJECTED",
                            finalPrice:
                              Number(order.finalPrice) ||
                              Number(order.estimatedTotal) ||
                              0,
                            adminNote:
                              order.adminNote ||
                              "Sorry, this request cannot be accepted at the moment.",
                            paymentStatus: order.paymentStatus || "NOT_PAID",
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2.5 text-xs font-black text-white transition hover:bg-red-600"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              History Table
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Completed & Rejected Orders
            </h2>
          </div>

          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-600 shadow">
            <History size={16} />
            {historyOrders.length} records
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl bg-white shadow">
          {historyOrders.length === 0 ? (
            <div className="p-8 text-center">
              <History className="mx-auto text-slate-300" size={42} />

              <h3 className="mt-4 text-xl font-black text-slate-900">
                No history yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Completed or rejected orders will move here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Tracking
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Customer
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Item
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Qty
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Final
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Payment
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Event Date
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {historyOrders.map((order) => (
                    <tr key={order._id} className="transition hover:bg-yellow-50">
                      <td className="px-5 py-4">
                        <p className="text-sm font-black text-slate-900">
                          {order.trackingCode || "N/A"}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {order.orderType}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-black text-slate-900">
                          {order.customerName}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {order.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-black text-slate-900">
                          {order.itemName}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {order.size || "No size"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-700">
                        {order.quantity}
                      </td>

                      <td className="px-5 py-4 text-sm font-black text-green-700">
                        {formatNaira(order.finalPrice || order.estimatedTotal)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-black ${getPaymentStyle(
                            order.paymentStatus
                          )}`}
                        >
                          {readableStatus(order.paymentStatus)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-600">
                        {formatDate(order.eventDate)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-black ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {readableStatus(order.status)}
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
    </section>
  );
}

export default AdminCustomOrders;