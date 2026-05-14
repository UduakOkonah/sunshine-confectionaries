import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
  const pendingOrders = orders.filter((order) => order.orderStatus === "Pending");
  const approvedOrders = orders.filter((order) => order.orderStatus === "Approved");
  const deliveredOrders = orders.filter((order) => order.deliveryStatus === "Delivered");
  const activeDeliveries = orders.filter(
    (order) => order.deliveryStatus === "Out for Delivery"
  );

  const totalRevenue = paidOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const customers = new Set(
    orders.map((order) => order.phone || order.customerName).filter(Boolean)
  ).size;

  const lowStockProducts = products.filter(
    (product) => Number(product.stock || 0) <= 5
  );

  const averageOrderValue = paidOrders.length
    ? totalRevenue / paidOrders.length
    : 0;

  const orderStatusData = [
    { name: "Pending", value: pendingOrders.length },
    { name: "Approved", value: approvedOrders.length },
    { name: "Delivered", value: deliveredOrders.length },
  ];

  const salesData = [
    { label: "Orders", value: orders.length },
    { label: "Paid", value: paidOrders.length },
    { label: "Delivered", value: deliveredOrders.length },
    { label: "Products", value: products.length },
  ];

  const revenueTrend = [
    { month: "Jan", revenue: Math.round(totalRevenue * 0.15) },
    { month: "Feb", revenue: Math.round(totalRevenue * 0.25) },
    { month: "Mar", revenue: Math.round(totalRevenue * 0.4) },
    { month: "Apr", revenue: Math.round(totalRevenue * 0.6) },
    { month: "May", revenue: Math.round(totalRevenue * 0.8) },
    { month: "Now", revenue: totalRevenue },
  ];

  const productRevenue = products
    .map((product) => {
      const sold = orders.reduce((total, order) => {
        const item = order.items?.find(
          (orderItem) =>
            String(orderItem.product || orderItem._id || orderItem.id) ===
              String(product._id || product.id) || orderItem.name === product.name
        );

        return total + (item?.quantity || 0);
      }, 0);

      return {
        name: product.name,
        sold,
        revenue: sold * Number(product.price || 0),
        image: product.image,
      };
    })
    .filter((product) => product.sold > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  const recentOrders = [...orders].slice(-4).reverse();

  const stats = [
    {
      title: "Revenue",
      value: formatPrice(totalRevenue),
      note: "Paid orders only",
      icon: Banknote,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Orders",
      value: orders.length,
      note: `${pendingOrders.length} pending`,
      icon: ShoppingBag,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Products",
      value: products.length,
      note: `${lowStockProducts.length} low stock`,
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Customers",
      value: customers,
      note: "Unique customers",
      icon: Users,
      color: "bg-pink-100 text-pink-700",
    },
  ];

  const statusCards = [
    {
      label: "System Online",
      value: "Live",
      icon: Activity,
      color: "text-green-600",
    },
    {
      label: "Average Order",
      value: formatPrice(averageOrderValue),
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      label: "Active Deliveries",
      value: activeDeliveries.length,
      icon: Truck,
      color: "text-purple-600",
    },
    {
      label: "Paid Orders",
      value: paidOrders.length,
      icon: CreditCard,
      color: "text-blue-600",
    },
  ];

  return (
    <section className="w-full overflow-x-hidden bg-[#FFF7D6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative min-w-0 overflow-hidden rounded-[34px] bg-gradient-to-br from-green-700 via-emerald-700 to-green-900 p-6 text-white shadow-xl sm:p-8"
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative z-10 flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-100">
                Sunshine Mission Control
              </p>

              <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
                Bakery Operations Dashboard
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-green-50">
                Monitor orders, revenue, products, payments, delivery movement,
                and customer activity from one admin cockpit.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/products"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-green-700 shadow-lg transition hover:-translate-y-1"
              >
                Products
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-5 py-3 text-sm font-black text-slate-900 shadow-lg transition hover:-translate-y-1"
              >
                Orders
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="min-w-0 rounded-[28px] bg-white p-5 shadow-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}
              >
                <stat.icon size={24} />
              </div>

              <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {stat.title}
              </p>

              <h2 className="mt-2 break-words text-3xl font-black text-slate-900">
                {stat.value}
              </h2>

              <p className="mt-2 text-sm font-bold text-slate-500">
                {stat.note}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[1fr_360px]">
          <div className="min-w-0 rounded-[32px] bg-white p-5 shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Revenue Trend
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Sales Performance
                </h2>
              </div>

              <div className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
                {formatPrice(totalRevenue)}
              </div>
            </div>

            <div className="mt-6 h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#16a34a"
                    strokeWidth={4}
                    fill="url(#revenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="min-w-0 rounded-[32px] bg-white p-5 shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Order Status
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Order Breakdown
            </h2>

            <div className="mt-6 h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                  >
                    {orderStatusData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={["#facc15", "#22c55e", "#fb923c"][index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[1fr_420px]">
          <div className="min-w-0 rounded-[32px] bg-white p-5 shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Business Metrics
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Operations Overview
            </h2>

            <div className="mt-6 h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    radius={[12, 12, 0, 0]}
                    fill="#22c55e"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="min-w-0 rounded-[32px] bg-white p-5 shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Recent Orders
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Latest Activity
            </h2>

            <div className="mt-5 space-y-3">
              {recentOrders.length === 0 ? (
                <p className="rounded-[24px] bg-yellow-50 p-5 text-sm font-bold text-slate-500">
                  No orders yet.
                </p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order._id || order.id}
                    className="flex items-center justify-between gap-3 rounded-[22px] bg-yellow-50 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-900">
                        {order.customerName || "Customer"}
                      </p>
                      <p className="truncate text-xs font-bold text-slate-500">
                        {order.orderNumber || "No order number"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black text-green-700">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs font-bold text-slate-500">
                        {order.orderStatus || "Pending"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 rounded-[32px] bg-white p-5 shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Product Performance
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Top Products
            </h2>

            <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
              {productRevenue.length === 0 ? (
                <p className="rounded-[22px] bg-slate-50 p-5 text-sm font-bold text-slate-500">
                  No product sales data yet.
                </p>
              ) : (
                productRevenue.map((product) => (
                  <div
                    key={product.name}
                    className="flex min-w-0 items-center gap-4 rounded-[22px] bg-slate-50 p-4"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-14 w-14 shrink-0 rounded-[16px] object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-xs font-bold text-slate-500">
                        Sold: {product.sold}
                      </p>
                      <p className="text-sm font-black text-green-700">
                        {formatPrice(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="min-w-0 rounded-[32px] bg-white p-5 shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Operations Feed
            </p>

            <div className="mt-5 space-y-3">
              {statusCards.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 rounded-[20px] bg-slate-50 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <item.icon className={`${item.color} shrink-0`} size={21} />
                    <p className="truncate text-sm font-black text-slate-800">
                      {item.label}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-black text-slate-500">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Products", to: "/admin/products", icon: Package },
            { title: "Orders", to: "/admin/orders", icon: ShoppingBag },
            { title: "Settings", to: "/admin/settings", icon: ShieldCheck },
            { title: "Reports", to: "/admin/orders", icon: TrendingUp },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group min-w-0 rounded-[26px] bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <item.icon className="text-green-600" size={26} />

              <h3 className="mt-4 text-lg font-black text-slate-900">
                {item.title}
              </h3>

              <p className="mt-1 text-sm font-bold text-slate-500">
                Open module
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;