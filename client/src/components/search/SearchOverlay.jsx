import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import { useProducts } from "../../context/ProductContext";

function SearchOverlay({ isOpen, onClose }) {
  const { products } = useProducts();

  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];

    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(query.toLowerCase())
    );
  }, [products, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="mx-auto mt-10 max-w-3xl rounded-[40px] bg-white p-6 shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                  Search
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Find delicious treats.
                </h2>
              </div>

              <button
                onClick={onClose}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative mt-8">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                size={22}
              />

              <input
                autoFocus
                type="text"
                placeholder="Search cakes, pastries, cupcakes..."
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                className="w-full rounded-[28px] border border-slate-200 bg-slate-50 py-5 pl-14 pr-5 text-lg font-bold outline-none transition focus:border-green-400 focus:bg-white"
              />
            </div>

            {/* RESULTS */}
            <div className="mt-8 max-h-[500px] overflow-y-auto">
              {!query.trim() ? (
                <div className="rounded-[32px] bg-yellow-50 p-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                    <Sparkles size={36} />
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-slate-900">
                    Start searching
                  </h3>

                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Search for cakes, pastries, cupcakes, and more.
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-[32px] bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                    <ShoppingBag size={34} />
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-slate-900">
                    No products found
                  </h3>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product._id || product.id}
                      to={`/products/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-[28px] bg-slate-50 p-4 transition hover:bg-yellow-50"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-24 w-24 rounded-[20px] object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-black text-slate-900">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm font-bold text-slate-500">
                          {product.category}
                        </p>

                        <p className="mt-3 text-lg font-black text-green-700">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchOverlay;