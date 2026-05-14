import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

function Cart() {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <section className="bg-[#FFF7D6] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[40px] bg-white p-10 text-center shadow-xl">
          <ShoppingBag className="mx-auto text-green-600" size={56} />

          <h1 className="mt-6 text-4xl font-black text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-slate-600">
            Add cakes, pastries, or sweet treats to get started.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex rounded-[60px] bg-green-500 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:bg-green-600"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FFF7D6] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
              Your Cart
            </p>

            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
              Review your order.
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="rounded-[60px] border-2 border-red-200 px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-[32px] bg-white p-4 shadow-lg sm:grid-cols-[120px_1fr_auto]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-full rounded-[24px] object-cover sm:h-full"
                />

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">
                    {item.category}
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-900">
                    {item.name}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {item.description}
                  </p>

                  <p className="mt-3 text-lg font-black text-green-700">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-full bg-red-50 p-3 text-red-500 transition hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center gap-3 rounded-[60px] bg-yellow-50 p-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="rounded-full bg-white p-2 text-slate-700 shadow"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-6 text-center text-sm font-black">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="rounded-full bg-green-500 p-2 text-white shadow"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="text-lg font-black text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-[40px] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t border-yellow-100 pt-4">
                <div className="flex justify-between text-xl font-black text-slate-900">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-8 flex w-full justify-center rounded-[60px] bg-green-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-green-600"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="mt-3 flex w-full justify-center rounded-[60px] bg-yellow-100 px-6 py-4 text-sm font-black text-yellow-700 transition hover:bg-yellow-200"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Cart;