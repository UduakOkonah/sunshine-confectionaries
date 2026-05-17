import { Link, useLocation, useParams } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Home,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

function OrderSuccess() {
  const location = useLocation();
  const { trackingCode } = useParams();

  const orderNumber =
    trackingCode ||
    location.state?.trackingCode ||
    location.state?.orderNumber ||
    location.state?.orderId ||
    "Pending";

  const orderStatus =
    location.state?.orderStatus ||
    location.state?.status ||
    "AWAITING_APPROVAL";

  const orderType =
    location.state?.orderType ||
    location.state?.type ||
    "ORDER";

  const isPending =
    orderStatus === "PENDING" ||
    orderStatus === "AWAITING_APPROVAL" ||
    orderStatus === "AWAITING APPROVAL";

  const getReadableStatus = (status) => {
    if (!status) return "PENDING";
    return String(status).replaceAll("_", " ");
  };

  const getTitle = () => {
    if (isPending) return "Waiting for admin approval.";
    if (orderStatus === "APPROVED") return "Your order has been approved.";
    if (orderStatus === "COMPLETED") return "Your order is completed.";
    return "Order submitted successfully.";
  };

  const getMessage = () => {
    if (isPending) {
      return "Your order has been received. It is currently pending until the admin reviews and approves it.";
    }

    return "Your order has been received successfully. You can track the order status anytime.";
  };

  const getIcon = () => {
    if (isPending) return Clock;
    return CheckCircle;
  };

  const StatusIcon = getIcon();

  return (
    <section className="flex min-h-[70vh] items-center bg-[#FFF7D6] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[48px] bg-white p-10 text-center shadow-2xl">
        <div
          className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${
            isPending
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          <StatusIcon size={56} />
        </div>

        <p className="mt-6 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          {orderType === "CUSTOM" || orderType === "BULK"
            ? "Custom Order Submitted"
            : "Order Submitted"}
        </p>

        <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
          {getTitle()}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
          {getMessage()}
        </p>

        <div className="mt-6 rounded-[28px] bg-yellow-50 p-5">
          <p className="text-sm font-black text-slate-500">
            Order / Tracking Number
          </p>

          <h2 className="mt-1 break-words text-2xl font-black text-green-700">
            {orderNumber}
          </h2>

          <p className="mt-4 text-sm font-black text-slate-500">
            Current Status
          </p>

          <h3
            className={`mt-1 inline-flex rounded-full px-5 py-2 text-sm font-black ${
              isPending
                ? "bg-yellow-300 text-slate-900"
                : "bg-green-100 text-green-700"
            }`}
          >
            {getReadableStatus(orderStatus)}
          </h3>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to={
              orderNumber && orderNumber !== "Pending"
                ? `/my-orders?code=${orderNumber}`
                : "/my-orders"
            }
            className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-green-500 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:bg-green-600"
          >
            <PackageCheck size={18} />
            Track Order
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-yellow-100 px-7 py-4 text-sm font-black text-yellow-700 transition hover:bg-yellow-200"
          >
            <ShoppingBag size={18} />
            Order More
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-slate-100 px-7 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-200"
          >
            <Home size={18} />
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;