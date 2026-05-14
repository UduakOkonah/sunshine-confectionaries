import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();

  const favorite = isInWishlist(product._id || product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <motion.article
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      className="group overflow-hidden rounded-[32px] bg-white shadow-lg transition"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${product._id || product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </Link>

        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition ${
            favorite
              ? "bg-red-500 text-white"
              : "bg-white/90 text-slate-700"
          }`}
        >
          <Heart
            size={18}
            fill={favorite ? "currentColor" : "none"}
          />
        </button>

        <div className="absolute left-4 top-4 rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-slate-900">
          {product.category}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/products/${product._id || product.id}`}>
              <h2 className="text-xl font-black text-slate-900 transition hover:text-green-600">
                {product.name}
              </h2>
            </Link>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-black text-yellow-700">
            <Star size={14} fill="currentColor" />
            4.9
          </div>
        </div>

        {/* PRICE + BUTTON */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Price
            </p>

            <h3 className="mt-1 text-2xl font-black text-green-700">
              {formatPrice(product.price)}
            </h3>
          </div>

          <button
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 rounded-[60px] bg-green-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-1 hover:bg-green-600"
          >
            <ShoppingCart size={17} />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;