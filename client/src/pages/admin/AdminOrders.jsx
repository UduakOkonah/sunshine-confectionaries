import { useMemo, useState } from "react";
import {
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Eye,
  Landmark,
  PackageCheck,
  Printer,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

import { useOrders } from "../../context/OrderContext";
import { exportOrdersToCSV } from "../../utils/exportOrders";

const orderStatusOptions = ["Pending", "Approved", "Cancelled"];

const paymentStatusOptions = [
  "Unpaid",
  "Pending Verification",
  "Paid",
  "Failed",
  "Refunded",
];

const deliveryStatusOptions = [
  "Not Started",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Failed",
];

function AdminOrders() {
  const { orders, updateOrder, deleteOrder } = useOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const getOrderId = (order) => order._id || order.id;
  const getItemId = (item) => item._id || item.id || item.name;

  const getPaymentIcon = (method) => {
    if (method === "bank-transfer") return Landmark;
    if (method === "card") return CreditCard;
    return Banknote;
  };

  const getPaymentLabel = (method) => {
    if (method === "bank-transfer") return "Bank Transfer";
    if (method === "card") return "Card Payment";
    if (method === "cash-on-delivery") return "Cash on Delivery";
    return "Not selected";
  };

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((order) => order.orderStatus === "Pending").length,
      approved: orders.filter((order) => order.orderStatus === "Approved")
        .length,
      delivered: orders.filter((order) => order.deliveryStatus === "Delivered")
        .length,
    };
  }, [orders]);

  const searchedOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = searchTerm.toLowerCase();

      return (
        order.orderNumber?.toLowerCase().includes(query) ||
        order.customerName?.toLowerCase().includes(query) ||
        order.phone?.toLowerCase().includes(query) ||
        order.deliveryZone?.toLowerCase().includes(query)
      );
    });
  }, [orders, searchTerm]);

  const activeOrders = searchedOrders.filter(
    (order) =>
      order.deliveryStatus !== "Delivered" &&
      order.orderStatus !== "Cancelled"
  );

  const completedOrders = searchedOrders.filter(
    (order) =>
      order.deliveryStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
  );

  const visibleActiveOrders =
    statusFilter === "Active"
      ? activeOrders
      : activeOrders.filter(
          (order) =>
            order.orderStatus === statusFilter ||
            order.paymentStatus === statusFilter ||
            order.deliveryStatus === statusFilter
        );

  const markDelivered = async (order) => {
    await updateOrder(getOrderId(order), {
      orderStatus: "Approved",
      deliveryStatus: "Delivered",
      paymentStatus:
        order.paymentStatus === "Paid" ? order.paymentStatus : "Paid",
    });
  };

  return (
    <section className="w-full overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[36px] border border-green-100 bg-gradient-to-br from-white via-green-50 to-yellow-50 p-6 shadow-xl sm:p-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-200/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-yellow-200/40 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-700 shadow-sm">
                Admin Orders
              </p>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Order Command Center
              </h1>

              <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
                Manage pending orders as active cards. Delivered and cancelled
                orders move into a compact history table.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => exportOrdersToCSV(orders)}
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-1 hover:bg-green-600"
              >
                <Download size={17} />
                Export CSV
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white px-5 py-3 text-sm font-black text-yellow-700 shadow-sm transition hover:-translate-y-1 hover:bg-yellow-50"
              >
                <Printer size={17} />
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Orders", value: stats.total, icon: Clock },
            { label: "Pending", value: stats.pending, icon: Clock },
            { label: "Approved", value: stats.approved, icon: PackageCheck },
            { label: "Delivered", value: stats.delivered, icon: CheckCircle },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[28px] bg-white p-5 shadow-lg"
            >
              <item.icon className="text-green-600" size={28} />
              <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                {item.label}
              </p>
              <h2 className="mt-1 text-4xl font-black text-slate-900">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-[28px] bg-white p-4 shadow-lg lg:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-[22px] bg-slate-50 px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by order number, customer, phone, zone..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-transparent text-sm font-bold outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 outline-none"
          >
            <option value="Active">Active Orders</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Pending Verification">Pending Payment</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">
              Active Orders
            </h2>
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
              {visibleActiveOrders.length} active
            </span>
          </div>

          {visibleActiveOrders.length === 0 ? (
            <div className="rounded-[32px] bg-white p-8 text-center shadow-lg">
              <Clock className="mx-auto text-yellow-500" size={46} />
              <h2 className="mt-4 text-2xl font-black text-slate-900">
                No Active Orders
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-600">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {visibleActiveOrders.map((order) => {
                const PaymentIcon = getPaymentIcon(order.paymentMethod);
                const orderId = getOrderId(order);

                return (
                  <article
                    key={orderId}
                    className="min-w-0 rounded-[32px] bg-white p-5 shadow-lg"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">
                          {order.orderNumber}
                        </p>
                        <h3 className="mt-1 truncate text-2xl font-black text-slate-900">
                          {order.customerName}
                        </h3>
                        <p className="mt-1 text-sm font-bold text-slate-500">
                          {order.phone}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm font-bold text-slate-500">
                          {order.address}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700"
                      >
                        <Eye size={15} />
                        Details
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-black text-yellow-700">
                        {order.orderStatus}
                      </span>
                      <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-black text-green-700">
                        {order.paymentStatus}
                      </span>
                      <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-black text-orange-700">
                        {order.deliveryStatus}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[22px] bg-yellow-50 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Total
                        </p>
                        <h3 className="mt-1 text-2xl font-black text-green-700">
                          {formatPrice(order.total)}
                        </h3>
                      </div>

                      <div className="rounded-[22px] bg-slate-50 p-4">
                        <PaymentIcon className="text-green-600" size={22} />
                        <p className="mt-2 text-sm font-black text-slate-900">
                          {getPaymentLabel(order.paymentMethod)}
                        </p>
                        <p className="mt-1 truncate text-xs font-bold text-slate-500">
                          {order.paymentReference || "No reference"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <select
                        value={order.orderStatus}
                        onChange={(event) =>
                          updateOrder(orderId, {
                            orderStatus: event.target.value,
                          })
                        }
                        className="rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-black outline-none focus:border-green-400"
                      >
                        {orderStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <select
                        value={order.paymentStatus}
                        onChange={(event) =>
                          updateOrder(orderId, {
                            paymentStatus: event.target.value,
                          })
                        }
                        className="rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-black outline-none focus:border-green-400"
                      >
                        {paymentStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <select
                        value={order.deliveryStatus}
                        onChange={(event) =>
                          updateOrder(orderId, {
                            deliveryStatus: event.target.value,
                          })
                        }
                        className="rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-black outline-none focus:border-green-400"
                      >
                        {deliveryStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <button
                        onClick={() =>
                          updateOrder(orderId, {
                            orderStatus: "Approved",
                            deliveryStatus:
                              order.deliveryStatus === "Not Started"
                                ? "Preparing"
                                : order.deliveryStatus,
                          })
                        }
                        className="rounded-full bg-green-500 px-4 py-3 text-xs font-black text-white"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateOrder(orderId, {
                            deliveryStatus: "Out for Delivery",
                          })
                        }
                        className="rounded-full bg-blue-500 px-4 py-3 text-xs font-black text-white"
                      >
                        Send Out
                      </button>

                      <button
                        onClick={() => markDelivered(order)}
                        className="rounded-full bg-slate-900 px-4 py-3 text-xs font-black text-white"
                      >
                        Mark Delivered
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">
              Completed / Archived Orders
            </h2>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
              {completedOrders.length} records
            </span>
          </div>

          <div className="overflow-hidden rounded-[32px] bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Order
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Customer
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Total
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Payment
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Delivery
                    </th>
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {completedOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-sm font-bold text-slate-500"
                      >
                        Delivered or cancelled orders will appear here.
                      </td>
                    </tr>
                  ) : (
                    completedOrders.map((order) => (
                      <tr key={getOrderId(order)} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <p className="text-sm font-black text-slate-900">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs font-bold text-slate-400">
                            {order.orderStatus}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-black text-slate-900">
                            {order.customerName}
                          </p>
                          <p className="text-xs font-bold text-slate-500">
                            {order.phone}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-black text-green-700">
                          {formatPrice(order.total)}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-black text-green-700">
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-black text-orange-700">
                            {order.deliveryStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[36px] bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">
                    {selectedOrder.orderNumber}
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    {selectedOrder.customerName}
                  </h2>
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    {selectedOrder.phone} • {selectedOrder.deliveryZone}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-full bg-red-50 p-3 text-red-500"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[22px] bg-yellow-50 p-4">
                  <p className="text-xs font-black text-slate-400">Order</p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {selectedOrder.orderStatus}
                  </p>
                </div>

                <div className="rounded-[22px] bg-green-50 p-4">
                  <p className="text-xs font-black text-slate-400">Payment</p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {selectedOrder.paymentStatus}
                  </p>
                </div>

                <div className="rounded-[22px] bg-orange-50 p-4">
                  <p className="text-xs font-black text-slate-400">Delivery</p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {selectedOrder.deliveryStatus}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[28px] bg-slate-50 p-5">
                <h3 className="text-lg font-black text-slate-900">
                  Items
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={getItemId(item)}
                      className="flex items-center gap-3 rounded-[20px] bg-white p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs font-bold text-slate-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-black text-green-700">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[28px] bg-green-50 p-5">
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm font-bold text-slate-600">
                  <span>Delivery</span>
                  <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                </div>
                <div className="mt-3 border-t border-green-100 pt-3">
                  <div className="flex justify-between text-xl font-black text-slate-900">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteOrder(getOrderId(selectedOrder))}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-100 px-5 py-3 text-sm font-black text-red-600"
              >
                <XCircle size={18} />
                Delete Order
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminOrders;