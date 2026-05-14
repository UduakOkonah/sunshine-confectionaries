import { motion } from "framer-motion";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";

import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";

import ProductCard from "../../components/product/ProductCard";

import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();

  const { products } = useProducts();

  const { addToCart } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);

  const product = products.find(
    (item) => String(item._id || item.id) === String(id)
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.category === product.category &&
          (item._id || item.id) !== (product._id || product.id)
      )
      .slice(0, 3);
  }, [products, product]);

  if (!product) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FFF7D6] px-4">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900">
            Product not found
          </h1>
        </div>
      </section>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  const favorite = isInWishlist(product._id || product.id);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <section className="bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-[40px] bg-white shadow-2xl"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
              {product.category}
            </div>

            <h1 className="mt-5 text-5xl font-black text-slate-900">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-black text-yellow-700">
                <Star size={16} fill="currentColor" />
                4.9 Rating
              </div>

              <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-black text-green-700">
                In Stock
              </div>
            </div>

            <h2 className="mt-8 text-5xl font-black text-green-700">
              {formatPrice(product.price)}
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600">
              {product.description}
            </p>

            {/* QUANTITY */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-[60px] bg-white p-2 shadow-lg">
                <button
                  onClick={decreaseQuantity}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                >
                  <Minus size={18} />
                </button>

                <span className="w-14 text-center text-lg font-black text-slate-900">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white transition hover:bg-green-600"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition ${
                  favorite
                    ? "bg-red-500 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                <Heart
                  size={22}
                  fill={favorite ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleAddToCart}
                className="inline-flex items-center gap-3 rounded-[60px] bg-green-500 px-8 py-5 text-sm font-black text-white shadow-xl shadow-green-200 transition hover:-translate-y-1 hover:bg-green-600"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button className="rounded-[60px] bg-white px-8 py-5 text-sm font-black text-slate-700 shadow-lg transition hover:bg-slate-50">
                Buy Now
              </button>
            </div>

            {/* FEATURES */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                "Freshly Baked",
                "Premium Ingredients",
                "Fast Delivery",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] bg-white p-5 text-center shadow-lg"
                >
                  <p className="text-sm font-black text-slate-800">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* REVIEWS */}
        <div className="mt-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                Reviews
              </p>

              <h2 className="mt-2 text-4xl font-black text-slate-900">
                Customer Reviews
              </h2>
            </div>

            <div className="rounded-full bg-yellow-100 px-5 py-3 text-sm font-black text-yellow-700">
              4.9 Average Rating
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                name: "Emilia",
                review:
                  "Absolutely amazing taste and beautiful presentation.",
              },
              {
                name: "Daniel",
                review:
                  "Delivery was fast and the cupcakes were super fresh.",
              },
              {
                name: "Esther",
                review:
                  "Best bakery experience I’ve had in a long time.",
              },
            ].map((review, index) => (
              <motion.article
                key={review.name}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[32px] bg-white p-6 shadow-lg"
              >
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  {review.review}
                </p>

                <div className="mt-6">
                  <h3 className="text-sm font-black text-slate-900">
                    {review.name}
                  </h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-20">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
              More Treats
            </p>

            <h2 className="mt-2 text-4xl font-black text-slate-900">
              Related Products
            </h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;