import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CakeSlice,
  Truck,
  Sparkles,
  Star,
  ShieldCheck,
  Clock,
  Gift,
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";

function Home() {
  const { featuredProducts } = useProducts();

  const perks = [
    { icon: CakeSlice, label: "Fresh Bakes" },
    { icon: Truck, label: "Fast Delivery" },
    { icon: Sparkles, label: "Custom Orders" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FFF7D6] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl"
        />

        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-green-300/25 blur-3xl"
        />

        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-[-120px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-300/20 blur-3xl"
        />

        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            animate={{ y: [0, -24, 0] }}
            transition={{ duration: 3 + index * 0.35, repeat: Infinity }}
            className="absolute rounded-full bg-white/60"
            style={{
              width: `${7 + index}px`,
              height: `${7 + index}px`,
              left: `${index * 8}%`,
              top: `${18 + index * 5}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-yellow-700 shadow-lg"
          >
            <Sparkles size={16} />
            Premium bakery experience
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
          >
            Sweet treats from a{" "}
            <span className="bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              cheerful bakery kitchen.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl text-lg font-medium leading-8 text-slate-600"
          >
            Order cakes, pastries, cupcakes, doughnuts, and dessert boxes with a
            smooth checkout, fast delivery, and real-time order tracking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-7 py-4 text-sm font-black text-white shadow-xl shadow-green-200 transition hover:scale-105 hover:bg-green-600"
            >
              Start Ordering
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/custom-cake"
              className="inline-flex items-center justify-center rounded-full border-2 border-green-500 bg-white px-7 py-4 text-sm font-black text-green-700 shadow-sm transition hover:bg-green-50"
            >
              Custom Cake
            </Link>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {perks.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-[28px] bg-white/90 p-4 text-center shadow-lg backdrop-blur"
              >
                <item.icon className="mx-auto text-green-600" />
                <p className="mt-2 text-sm font-black text-slate-700">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Clock, label: "Delivery Time", value: "Fast" },
              { icon: ShieldCheck, label: "Quality", value: "Premium" },
              { icon: Gift, label: "Packages", value: "Custom" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-3xl bg-white/90 p-4 shadow-md backdrop-blur"
              >
                <item.icon className="text-green-600" />
                <p className="mt-2 text-xs font-bold text-slate-500">
                  {item.label}
                </p>
                <h3 className="text-lg font-black text-slate-900">
                  {item.value}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-yellow-300/40 blur-3xl" />
          <div className="absolute -bottom-10 -right-8 h-44 w-44 rounded-full bg-green-300/40 blur-3xl" />

          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, 1.5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="relative rounded-[52px] bg-white p-5 shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1488477181946-6428a0291777"
              alt="Delicious bakery dessert"
              className="h-[430px] w-full rounded-[44px] object-cover lg:h-[560px]"
            />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute left-8 top-8 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-green-700 shadow-md backdrop-blur-xl"
            >
              Freshly baked today
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity }}
              className="absolute -bottom-8 left-6 right-6 rounded-[34px] bg-white p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-green-700">
                  Popular this week
                </p>

                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-xs font-black text-slate-800">4.9</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                {featuredProducts.slice(0, 3).map((product) => (
                  <div key={product._id || product.id}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-full rounded-2xl object-cover"
                    />
                    <p className="mt-1 truncate text-xs font-black text-slate-700">
                      {product.name}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Home;