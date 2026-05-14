import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BadgePercent,
  Package,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const approvedOrders = orders.filter(
    (order) => order.orderStatus === "Approved"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Pending"
  ).length;

  const activeDeliveries = orders.filter(
    (order) => order.deliveryStatus === "Out for Delivery"
  ).length;

  const stats = [
    {
      title: "Products",
      value: products.length,
      icon: Package,
      accent: "from-emerald-400 to-green-500",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
    },
    {
      title: "Orders",
      value: orders.length,
      icon: ShoppingBag,
      accent: "from-yellow-300 to-orange-400",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },
    {
      title: "Deliveries",
      value: activeDeliveries,
      icon: Truck,
      accent: "from-orange-300 to-red-400",
      bg: "bg-orange-100",
      text: "text-orange-700",
    },
    {
      title: "Pending",
      value: pendingOrders,
      icon: BadgePercent,
      accent: "from-pink-300 to-rose-400",
      bg: "bg-pink-100",
      text: "text-pink-700",
    },
  ];

  return (
    <section className="min-h-screen bg-[#FFF7D6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[40px] bg-white p-6 shadow-2xl sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
                Sunshine Admin Center
              </p>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
                Bakery Operations{" "}
                <span className="bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Control products, orders, payments, and delivery operations from
                one bakery management dashboard.
              </p>
            </div>

            <Link
              to="/admin/products"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-green-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-green-200 transition hover:scale-105 hover:bg-green-600"
            >
              Manage Products
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[28px] bg-green-50 p-5">
              <Activity className="text-green-600" />
              <p className="mt-3 text-sm font-bold text-slate-500">
                System Status
              </p>
              <h3 className="text-xl font-black text-green-700">Online</h3>
            </div>

            <div className="rounded-[28px] bg-yellow-50 p-5">
              <ShieldCheck className="text-yellow-600" />
              <p className="mt-3 text-sm font-bold text-slate-500">
                Approved Orders
              </p>
              <h3 className="text-xl font-black text-yellow-700">
                {approvedOrders}
              </h3>
            </div>

            <div className="rounded-[28px] bg-orange-50 p-5">
              <TrendingUp className="text-orange-600" />
              <p className="mt-3 text-sm font-bold text-slate-500">
                Daily Operations
              </p>
              <h3 className="text-xl font-black text-orange-700">Active</h3>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-[34px] bg-white p-6 shadow-xl"
            >
              <div
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${stat.accent} opacity-20 blur-2xl`}
              />

              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-3xl ${stat.bg}`}
              >
                <stat.icon className={stat.text} size={30} />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                {stat.title}
              </p>

              <h2 className="mt-2 text-5xl font-black text-slate-900">
                {stat.value}
              </h2>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;