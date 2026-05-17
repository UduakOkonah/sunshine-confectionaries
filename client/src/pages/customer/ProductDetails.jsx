import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductCard from "../../components/product/ProductCard";

import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    review: "",
  });
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const product = products.find(
    (item) => String(item._id || item.id) === String(id)
  );

  const productId = product?._id || product?.id || id;
  const reviewStorageKey = `sunshine_reviews_${productId}`;

  useEffect(() => {
    try {
      const savedReviews = JSON.parse(localStorage.getItem(reviewStorageKey));

      if (Array.isArray(savedReviews)) {
        setReviews(savedReviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      setReviews([]);
    }

    setReviewError("");
    setReviewSuccess("");
  }, [reviewStorageKey]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.category === product.category &&
          String(item._id || item.id) !== String(product._id || product.id)
      )
      .slice(0, 3);
  }, [products, product]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );

    return total / reviews.length;
  }, [reviews]);

  if (!product) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FFF7D6] px-4">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900">
            Product not found
          </h1>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 rounded-full bg-green-500 px-8 py-4 text-sm font-black text-white transition hover:bg-green-600"
          >
            Back to Products
          </button>
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

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  const favorite = isInWishlist(product._id || product.id);

  const availableStock = Number(product.stock ?? product.quantity ?? 99);
  const isOutOfStock = availableStock <= 0;

const increaseQuantity = () => {
  if (isOutOfStock) return;

  setQuantity((current) => {
    const currentQty = Number(current) || 1;

    if (availableStock && currentQty >= availableStock) {
      toast.error("You have reached the available stock limit.");
      return currentQty;
    }

    return currentQty + 1;
  });
};

const decreaseQuantity = () => {
  setQuantity((current) => {
    const currentQty = Number(current) || 1;
    return currentQty > 1 ? currentQty - 1 : 1;
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

  if (availableStock && numericValue > availableStock) {
    setQuantity(availableStock);
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
  if (isOutOfStock) return;

  const finalQuantity = Number(quantity) || 1;
  addToCart(product, finalQuantity);
  toast.success(`${finalQuantity} ${product.name} added to cart.`);
};

const handleBuyNow = () => {
  if (isOutOfStock) return;

  const finalQuantity = Number(quantity) || 1;
  addToCart(product, finalQuantity);
  navigate("/cart");
};

  const handleReviewInput = (event) => {
    const { name, value } = event.target;

    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setReviewForm((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();

    const name = reviewForm.name.trim();
    const reviewText = reviewForm.review.trim();

    if (!name || !reviewText) {
      setReviewError("Please enter your name and review.");
      setReviewSuccess("");
      return;
    }

    if (reviewText.length < 10) {
      setReviewError("Your review should be at least 10 characters.");
      setReviewSuccess("");
      return;
    }

    const newReview = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      name,
      review: reviewText,
      rating: Number(reviewForm.rating),
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];

    setReviews(updatedReviews);
    localStorage.setItem(reviewStorageKey, JSON.stringify(updatedReviews));

    setReviewForm({
      name: "",
      rating: 5,
      review: "",
    });

    setReviewError("");
    setReviewSuccess("Review submitted successfully.");
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
              className="h-full max-h-[620px] w-full object-cover"
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

            <h1 className="mt-5 text-4xl font-black text-slate-900 sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-black text-yellow-700">
                <Star size={16} fill="currentColor" />
                {reviews.length
                  ? `${averageRating.toFixed(1)} Rating`
                  : "No Reviews Yet"}
              </div>

              <div
                className={`rounded-full px-3 py-1 text-sm font-black ${
                  isOutOfStock
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </div>

              <div className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-700 shadow-sm">
                {reviews.length} Review{reviews.length === 1 ? "" : "s"}
              </div>
            </div>

            <h2 className="mt-8 text-5xl font-black text-green-700">
              {formatPrice(product.price)}
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600">
              {product.description}
            </p>

            {/* QUANTITY */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="rounded-[30px] bg-white p-3 shadow-lg">
                  <p className="mb-2 text-center text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Quantity
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={Number(quantity) <= 1}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus size={18} />
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={availableStock}
                      value={quantity}
                      onChange={handleManualQuantityChange}
                      onBlur={handleQuantityBlur}
                      disabled={isOutOfStock}
                      className="h-12 w-20 rounded-2xl border border-slate-200 bg-white text-center text-lg font-black text-slate-900 outline-none transition focus:border-green-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={isOutOfStock || Number(quantity) >= availableStock}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {!isOutOfStock && (
                    <p className="mt-2 text-center text-xs font-bold text-slate-400">
                      Available: {availableStock}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition ${
                    favorite ? "bg-red-500 text-white" : "bg-white text-slate-700"
                  }`}
                >
                  <Heart size={22} fill={favorite ? "currentColor" : "none"} />
                </button>
              </div>

            {/* ACTIONS */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="inline-flex items-center gap-3 rounded-[60px] bg-green-500 px-8 py-5 text-sm font-black text-white shadow-xl shadow-green-200 transition hover:-translate-y-1 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="rounded-[60px] bg-white px-8 py-5 text-sm font-black text-slate-700 shadow-lg transition hover:-translate-y-1 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                Buy Now
              </button>
            </div>

            {/* ADVANCED FEATURES */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Truck,
                  title: "Fast Delivery",
                  text: "Quick dispatch for fresh orders.",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure Checkout",
                  text: "Safe and smooth order process.",
                },
                {
                  icon: RotateCcw,
                  title: "Fresh Guarantee",
                  text: "Made with premium ingredients.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] bg-white p-5 shadow-lg"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-4 text-sm font-black text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* REVIEWS */}
        <div className="mt-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                Reviews
              </p>

              <h2 className="mt-2 text-4xl font-black text-slate-900">
                Customer Reviews
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Reviews are submitted by customers directly from this page.
              </p>
            </div>

            <div className="w-fit rounded-full bg-yellow-100 px-5 py-3 text-sm font-black text-yellow-700">
              {reviews.length
                ? `${averageRating.toFixed(1)} Average Rating`
                : "Be the first to review"}
            </div>
          </div>

          {/* REVIEW FORM */}
          <motion.form
            onSubmit={handleSubmitReview}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-[36px] bg-white p-6 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                <MessageCircle size={22} />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Drop Your Review
                </h3>

                <p className="text-sm text-slate-500">
                  Tell other customers what you think.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div>
                <label className="text-sm font-black text-slate-800">
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={reviewForm.name}
                  onChange={handleReviewInput}
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-green-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-black text-slate-800">
                  Rating
                </label>

                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(rating)}
                      className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                        reviewForm.rating >= rating
                          ? "bg-yellow-400 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Star size={18} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-black text-slate-800">
                Your Review
              </label>

              <textarea
                name="review"
                value={reviewForm.review}
                onChange={handleReviewInput}
                placeholder="Write your honest review..."
                rows="5"
                className="mt-2 w-full resize-none rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold leading-7 text-slate-800 outline-none transition focus:border-green-400 focus:bg-white"
              />
            </div>

            {reviewError && (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {reviewError}
              </p>
            )}

            {reviewSuccess && (
              <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-600">
                {reviewSuccess}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 rounded-[60px] bg-green-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-green-200 transition hover:-translate-y-1 hover:bg-green-600"
            >
              Submit Review
            </button>
          </motion.form>

          {/* REVIEW LIST */}
          {reviews.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review, index) => (
                <motion.article
                  key={review.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-[32px] bg-white p-6 shadow-lg"
                >
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={18}
                        fill={
                          starIndex < Number(review.rating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    {review.review}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        {review.name}
                      </h3>

                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                      Verified
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[32px] bg-white p-8 text-center shadow-lg">
              <h3 className="text-xl font-black text-slate-900">
                No reviews yet
              </h3>

              <p className="mt-3 text-sm text-slate-500">
                Customers can now submit their own reviews from the form above.
              </p>
            </div>
          )}
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
              <ProductCard key={item._id || item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;