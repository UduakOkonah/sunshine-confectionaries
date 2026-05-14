import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  ShoppingBag,
  Clock,
  CheckCircle,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";

function Profile() {
  const { user } = useAuth();
  const { orders } = useOrders();

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Pending"
  );

  const deliveredOrders = orders.filter(
    (order) => order.deliveryStatus === "Delivered"
  );

  return (
    <section className="bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          My Profile
        </p>

        <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
          Account overview.
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-[32px] bg-white p-6 shadow-xl">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
              <User size={40} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              {user?.name || "Customer"}
            </h2>

            <div className="mt-4 space-y-3 text-sm font-bold text-slate-600">
              <p className="flex items-center gap-2">
                <Mail size={17} className="text-green-600" />
                {user?.email || "No email"}
              </p>

              <p className="flex items-center gap-2">
                <Phone size={17} className="text-green-600" />
                {user?.phone || "No phone added"}
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                to="/my-orders"
                className="rounded-[60px] bg-green-500 px-5 py-3 text-center text-sm font-black text-white"
              >
                View My Orders
              </Link>

              <Link
                to="/products"
                className="rounded-[60px] bg-yellow-100 px-5 py-3 text-center text-sm font-black text-yellow-700"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>

          <div className="grid gap-5 sm:grid-cols-3">
            <article className="rounded-[32px] bg-white p-6 shadow-lg">
              <ShoppingBag className="text-green-600" size={34} />
              <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                Total Orders
              </p>
              <h3 className="mt-2 text-4xl font-black text-slate-900">
                {orders.length}
              </h3>
            </article>

            <article className="rounded-[32px] bg-white p-6 shadow-lg">
              <Clock className="text-yellow-600" size={34} />
              <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                Pending
              </p>
              <h3 className="mt-2 text-4xl font-black text-slate-900">
                {pendingOrders.length}
              </h3>
            </article>

            <article className="rounded-[32px] bg-white p-6 shadow-lg">
              <CheckCircle className="text-green-600" size={34} />
              <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                Delivered
              </p>
              <h3 className="mt-2 text-4xl font-black text-slate-900">
                {deliveredOrders.length}
              </h3>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;