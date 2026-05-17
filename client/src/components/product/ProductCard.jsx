import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);

  const productId = product._id || product.id;
  const favorite = isInWishlist(productId);

  const stock = Number(product.stock ?? product.quantity ?? 99);
  const isOutOfStock = stock <= 0;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));

  const increaseQuantity = () => {
    if (isOutOfStock) return;

    setQuantity((current) => {
      const currentQuantity = Number(current) || 1;

      if (stock && currentQuantity >= stock) {
        toast.error("You have reached the available stock limit.");
        return currentQuantity;
      }

      return currentQuantity + 1;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((current) => {
      const currentQuantity = Number(current) || 1;
      return currentQuantity > 1 ? currentQuantity - 1 : 1;
    });
  };

  const handleManualQuantityChange = (event) => {
    const value = event.target.value;

    if (value === "") {
      setQuantity("");
      return;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return;

    if (numericValue < 1) {
      setQuantity(1);
      return;
    }

    if (stock && numericValue > stock) {
      setQuantity(stock);
      toast.error("You have reached the available stock limit.");
      return;
    }

    setQuantity(numericValue);
  };

  const handleQuantityBlur = () => {
    if (!quantity || Number(quantity) < 1) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    const finalQuantity = Number(quantity) || 1;

    addToCart(product, finalQuantity);
    toast.success(`${finalQuantity} ${product.name} added to cart.`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group overflow-hidden rounded-[26px] bg-white shadow-lg transition"
    >
      <div className="relative h-44 overflow-hidden bg-yellow-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 rounded-full bg-yellow-100 px-3 py-1.5 text-[10px] font-black text-yellow-700 shadow">
          {product.category}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition ${
            favorite ? "bg-red-500 text-white" : "bg-white text-slate-700"
          }`}
        >
          <Heart size={16} fill={favorite ? "currentColor" : "none"} />
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-full bg-red-500 px-4 py-2 text-xs font-black text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-1 text-base font-black text-slate-900">
              {product.name}
            </h2>

            <div className="mt-1.5 flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, index) => (
                <Star key={index} size={12} fill="currentColor" />
              ))}

              <span className="ml-1 text-[10px] font-black text-slate-400">
                5.0
              </span>
            </div>
          </div>

          <p className="shrink-0 text-sm font-black text-green-700">
            {formatPrice(product.price)}
          </p>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
          {product.description}
        </p>

        <div className="mt-4 rounded-[20px] bg-yellow-50 p-2.5">
          <p className="mb-2 text-center text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
            Quantity
          </p>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={Number(quantity) <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={14} />
            </button>

            <input
              type="number"
              min="1"
              max={stock}
              value={quantity}
              onChange={handleManualQuantityChange}
              onBlur={handleQuantityBlur}
              disabled={isOutOfStock}
              className="h-9 w-16 rounded-xl border border-yellow-200 bg-white text-center text-sm font-black text-slate-900 outline-none transition focus:border-green-400 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={isOutOfStock || Number(quantity) >= stock}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Plus size={14} />
            </button>
          </div>

          {!isOutOfStock && (
            <p className="mt-1.5 text-center text-[10px] font-bold text-slate-400">
              Available: {stock}
            </p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-green-500 px-3 py-2.5 text-[11px] font-black text-white shadow-md transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <ShoppingCart size={14} />
            Add
          </button>

          <Link
            to={`/products/${productId}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-yellow-100 px-3 py-2.5 text-[11px] font-black text-yellow-700 transition hover:bg-yellow-200"
          >
            <Eye size={14} />
            View
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;