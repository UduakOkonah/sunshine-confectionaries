import {
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  Landmark,
  PackageCheck,
  Truck,
  XCircle,
  Download,
  Printer,
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

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const getOrderId = (order) => order._id || order.id;

  const getItemId = (item) => item._id || item.id;

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

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[36px] border border-green-100 bg-gradient-to-br from-white via-green-50 to-yellow-50 p-6 shadow-xl sm:p-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-200/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-yellow-200/40 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="inline-flex items-center rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-700 shadow-sm">
                  Admin Orders
                </p>

                <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                  Manage Customer Orders
                </h1>

                <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
                  Approve orders, verify payments, monitor delivery progress,
                  and manage bakery operations from one dashboard.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => exportOrdersToCSV(orders)}
                  className="group inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-1 hover:bg-green-600"
                >
                  <Download size={17} />
                  Export CSV
                </button>

                <button
                  onClick={() => window.print()}
                  className="group inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white px-5 py-3 text-sm font-black text-yellow-700 shadow-sm transition hover:-translate-y-1 hover:bg-yellow-50"
                >
                  <Printer size={17} />
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-[32px] bg-white p-8 text-center shadow-lg">
            <Clock className="mx-auto text-yellow-500" size={46} />

            <h2 className="mt-4 text-2xl font-black text-slate-900">
              No Orders Yet
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-600">
              Customer orders will appear here once checkout is completed.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => {
              const PaymentIcon = getPaymentIcon(order.paymentMethod);
              const orderId = getOrderId(order);

              return (
                <article
                  key={orderId}
                  className="rounded-[32px] bg-white p-5 shadow-lg"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">
                        {order.orderNumber}
                      </p>

                      <h2 className="mt-1 text-2xl font-black text-slate-900">
                        {order.customerName}
                      </h2>

                      <div className="mt-2 space-y-1 text-sm font-bold text-slate-500">
                        <p>{order.phone}</p>
                        <p>{order.address}</p>
                        <p>{order.deliveryZone}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-black text-yellow-700">
                        Order: {order.orderStatus}
                      </span>

                      <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-black text-green-700">
                        Payment: {order.paymentStatus}
                      </span>

                      <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-black text-orange-700">
                        Delivery: {order.deliveryStatus}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
                    <div className="rounded-[24px] bg-yellow-50 p-4">
                      <h3 className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                        Order Items
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {order.items?.map((item) => (
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
                              <h4 className="text-sm font-black text-slate-900">
                                {item.name}
                              </h4>

                              <p className="text-xs font-bold text-slate-500">
                                Qty: {item.quantity}
                              </p>

                              <p className="mt-1 text-sm font-black text-green-700">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-slate-50 p-4">
                      <h3 className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                        Payment Details
                      </h3>

                      <div className="flex items-start gap-3 rounded-[20px] bg-white p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                          <PaymentIcon size={20} />
                        </div>

                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {getPaymentLabel(order.paymentMethod)}
                          </p>

                          <p className="mt-1 text-xs font-bold text-slate-500">
                            Ref: {order.paymentReference || "No reference"}
                          </p>

                          <p className="mt-1 text-xs font-bold text-slate-500">
                            Status: {order.paymentStatus}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm font-bold text-slate-600">
                          <span>Subtotal</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>

                        <div className="flex justify-between text-sm font-bold text-slate-600">
                          <span>Delivery</span>
                          <span>{formatPrice(order.deliveryFee)}</span>
                        </div>

                        <div className="border-t border-slate-200 pt-2">
                          <div className="flex justify-between text-lg font-black text-slate-900">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.note && (
                    <div className="mt-4 rounded-[24px] bg-yellow-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Customer Note
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {order.note}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-[24px] bg-slate-50 p-4">
                      <p className="mb-2 text-sm font-black text-slate-700">
                        Order Status
                      </p>

                      <select
                        value={order.orderStatus}
                        onChange={(event) =>
                          updateOrder(orderId, {
                            orderStatus: event.target.value,
                          })
                        }
                        className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-black outline-none focus:border-green-400"
                      >
                        {orderStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

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
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-[60px] bg-green-500 px-4 py-3 text-xs font-black text-white"
                      >
                        <PackageCheck size={16} />
                        Approve Order
                      </button>
                    </div>

                    <div className="rounded-[24px] bg-slate-50 p-4">
                      <p className="mb-2 text-sm font-black text-slate-700">
                        Payment Status
                      </p>

                      <select
                        value={order.paymentStatus}
                        onChange={(event) =>
                          updateOrder(orderId, {
                            paymentStatus: event.target.value,
                          })
                        }
                        className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-black outline-none focus:border-green-400"
                      >
                        {paymentStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          updateOrder(orderId, {
                            paymentStatus: "Paid",
                          })
                        }
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-[60px] bg-yellow-400 px-4 py-3 text-xs font-black text-slate-900"
                      >
                        <CheckCircle size={16} />
                        Mark Paid
                      </button>
                    </div>

                    <div className="rounded-[24px] bg-slate-50 p-4">
                      <p className="mb-2 text-sm font-black text-slate-700">
                        Delivery Status
                      </p>

                      <select
                        value={order.deliveryStatus}
                        onChange={(event) =>
                          updateOrder(orderId, {
                            deliveryStatus: event.target.value,
                          })
                        }
                        className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-black outline-none focus:border-green-400"
                      >
                        {deliveryStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          updateOrder(orderId, {
                            deliveryStatus: "Out for Delivery",
                          })
                        }
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-[60px] bg-blue-500 px-4 py-3 text-xs font-black text-white"
                      >
                        <Truck size={16} />
                        Send Out
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => deleteOrder(orderId)}
                      className="inline-flex items-center gap-2 rounded-[60px] bg-red-100 px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-200"
                    >
                      <XCircle size={18} />
                      Delete Order
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminOrders;