import { Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  CreditCard,
  PackageCheck,
  Truck,
} from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import DeliveryTimeline from "../../components/orders/DeliveryTimeline";

const steps = [
  {
    label: "Pending",
    icon: Clock,
  },
  {
    label: "Approved",
    icon: PackageCheck,
  },
  {
    label: "On the Way",
    icon: Truck,
  },
  {
    label: "Delivered",
    icon: CheckCircle,
  },
];

function MyOrders() {
  const { orders } = useOrders();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  const isStepActive = (order, step) => {
    if (step === "Pending") {
      return order.orderStatus === "Pending" || order.orderStatus === "Approved";
    }

    if (step === "Approved") {
      return order.orderStatus === "Approved";
    }

    if (step === "On the Way") {
      return (
        order.deliveryStatus === "Out for Delivery" ||
        order.deliveryStatus === "Delivered"
      );
    }

    if (step === "Delivered") {
      return order.deliveryStatus === "Delivered";
    }

    return false;
  };

  return (
    <section className="bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
              My Orders
            </p>

            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
              Track your orders.
            </h1>

            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
              Follow your bakery order from pending approval to delivery.
            </p>
          </div>

          <Link
            to="/products"
            className="rounded-[60px] bg-green-500 px-6 py-3 text-center text-sm font-black text-white shadow-lg transition hover:bg-green-600"
          >
            Order More
          </Link>
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
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-[30px] bg-white p-5 shadow-lg"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">
                      {order.orderNumber}
                    </p>

                    <h2 className="mt-1 text-xl font-black text-slate-900">
                      {order.customerName}
                    </h2>

                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {order.deliveryZone} • {order.address}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
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
                </div>

                <div className="mt-5 rounded-[24px] bg-yellow-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-4">
                    {steps.map((step) => {
                      const Icon = step.icon;
                      const active = isStepActive(order, step.label);

                      return (
                        <div
                          key={step.label}
                          className={`flex items-center gap-3 rounded-[20px] p-3 ${
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
                            <p className="text-xs font-black">{step.label}</p>
                            <p className="text-[11px] font-bold opacity-80">
                              {active ? "Active" : "Waiting"}
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
                      {formatPrice(order.total)}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Payment Method
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-black text-slate-700">
                      <CreditCard size={16} className="text-green-600" />
                      {order.paymentMethod || "Not selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Items
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-700">
                      {order.items?.length || 0} item
                      {order.items?.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyOrders;