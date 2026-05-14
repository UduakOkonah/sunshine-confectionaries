import { motion } from "framer-motion";
import { Gift, Percent, Sparkles } from "lucide-react";

const promos = [
  {
    id: 1,
    title: "20% OFF Cupcakes",
    description: "Get sweet cupcake deals all weekend.",
  },
  {
    id: 2,
    title: "Buy 2 Cakes Get 1 Free",
    description: "Perfect for birthdays and celebrations.",
  },
  {
    id: 3,
    title: "Free Delivery Friday",
    description: "Free delivery within selected zones.",
  },
];

function Promotions() {
  return (
    <section className="bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          Promotions
        </p>

        <h1 className="text-5xl font-black text-slate-900">
          Sweet deals & discounts.
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {promos.map((promo, index) => (
            <motion.article
              key={promo.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              whileHover={{
                y: -5,
                scale: 1.01,
              }}
              className="relative overflow-hidden rounded-[36px] bg-white p-6 shadow-xl"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-200/40 blur-3xl" />

              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-green-100 text-green-700">
                  {index === 0 ? (
                    <Gift size={32} />
                  ) : index === 1 ? (
                    <Percent size={32} />
                  ) : (
                    <Sparkles size={32} />
                  )}
                </div>

                <h2 className="mt-6 text-3xl font-black text-slate-900">
                  {promo.title}
                </h2>

                <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                  {promo.description}
                </p>

                <button className="mt-6 rounded-[60px] bg-green-500 px-5 py-3 text-sm font-black text-white shadow-lg">
                  Claim Offer
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Promotions;