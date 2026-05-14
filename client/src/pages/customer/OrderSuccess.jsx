import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, Clock } from "lucide-react";

function OrderSuccess() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || "Pending";
  const orderStatus = location.state?.orderStatus || "Pending";

  return (
    <section className="flex min-h-[70vh] items-center bg-[#FFF7D6] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[48px] bg-white p-10 text-center shadow-2xl">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
          <Clock size={56} />
        </div>

        <p className="mt-6 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          Order Submitted
        </p>

        <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
          Waiting for admin approval.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
          Your order has been received. It is currently pending until the admin
          approves it.
        </p>

        <div className="mt-6 rounded-[28px] bg-yellow-50 p-5">
          <p className="text-sm font-black text-slate-500">Order Number</p>
          <h2 className="mt-1 text-2xl font-black text-green-700">
            {orderNumber}
          </h2>

          <p className="mt-4 text-sm font-black text-slate-500">
            Current Status
          </p>
          <h3 className="mt-1 inline-flex rounded-full bg-yellow-300 px-5 py-2 text-sm font-black text-slate-900">
            {orderStatus}
          </h3>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/my-orders"
            className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-green-500 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:bg-green-600"
          >
            <CheckCircle size={18} />
            Track Order
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-yellow-100 px-7 py-4 text-sm font-black text-yellow-700 transition hover:bg-yellow-200"
          >
            <ShoppingBag size={18} />
            Order More
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;