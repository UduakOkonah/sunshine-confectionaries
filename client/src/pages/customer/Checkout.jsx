import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Banknote,
  CreditCard,
  Landmark,
  MapPin,
  MessageSquare,
  Phone,
  Truck,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";

const deliveryZones = [
  { id: 1, name: "Calabar South", fee: 800 },
  { id: 2, name: "Marian", fee: 1000 },
  { id: 3, name: "Ekorinim", fee: 1200 },
  { id: 4, name: "8 Miles", fee: 1500 },
  { id: 5, name: "Outside Calabar", fee: 2500 },
];

const businessAccount = {
  bankName: "Opay",
  accountName: "Sunshine Confectionaries",
  accountNumber: "1234567890",
};

const paymentMethods = [
  {
    id: "bank-transfer",
    title: "Bank Transfer",
    description: "Send money to bakery account.",
    icon: Landmark,
  },
  {
    id: "card",
    title: "Card",
    description: "Pay with debit/credit card.",
    icon: CreditCard,
  },
  {
    id: "cash-on-delivery",
    title: "Cash",
    description: "Pay when order arrives.",
    icon: Banknote,
  },
];

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    note: "",
    deliveryZone: "",
    paymentMethod: "",
    transferReference: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const selectedZone = deliveryZones.find(
    (zone) => zone.name === formData.deliveryZone
  );

  const deliveryFee = selectedZone ? selectedZone.fee : 0;
  const finalTotal = cartTotal + deliveryFee;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const getPaymentStatus = () => {
    if (formData.paymentMethod === "cash-on-delivery") return "Unpaid";
    if (formData.paymentMethod === "bank-transfer")
      return "Pending Verification";
    if (formData.paymentMethod === "card") return "Paid";
    return "Unpaid";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.customerName ||
      !formData.phone ||
      !formData.address ||
      !formData.deliveryZone
    ) {
      toast.error("Please fill in your delivery details");
      return;
    }

    if (!formData.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (
      formData.paymentMethod === "bank-transfer" &&
      !formData.transferReference
    ) {
      toast.error("Enter transfer reference or sender name");
      return;
    }

    if (
      formData.paymentMethod === "card" &&
      (!formData.cardName ||
        !formData.cardNumber ||
        !formData.cardExpiry ||
        !formData.cardCvv)
    ) {
      toast.error("Please fill card details");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const order = await createOrder({
      customerName: formData.customerName,
      phone: formData.phone,
      address: formData.address,
      note: formData.note,
      deliveryZone: formData.deliveryZone,
      paymentMethod: formData.paymentMethod,
      paymentStatus: getPaymentStatus(),
      paymentReference:
        formData.paymentMethod === "bank-transfer"
          ? formData.transferReference
          : formData.paymentMethod === "card"
          ? `CARD-${Date.now().toString().slice(-6)}`
          : "Cash on Delivery",
      items: cartItems,
      subtotal: cartTotal,
      deliveryFee,
      total: finalTotal,
    });
    if (!order) return;

    clearCart();

    navigate("/order-success", {
      state: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
      },
    });
  };

  return (
    <section className="bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          Checkout
        </p>

        <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
          Complete your order.
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Choose delivery and payment. Your order stays pending until admin
          approves it.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-[32px] bg-white p-5 shadow-xl sm:p-6"
          >
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Delivery Details
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <User size={17} className="text-green-600" />
                    Full Name
                  </span>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
                  />
                </label>

                <label>
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <Phone size={17} className="text-green-600" />
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
                  />
                </label>

                <label>
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <Truck size={17} className="text-green-600" />
                    Delivery Zone
                  </span>

                  <select
                    name="deliveryZone"
                    value={formData.deliveryZone}
                    onChange={handleChange}
                    className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
                  >
                    <option value="">Select delivery zone</option>
                    {deliveryZones.map((zone) => (
                      <option key={zone.id} value={zone.name}>
                        {zone.name} - {formatPrice(zone.fee)}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <MapPin size={17} className="text-green-600" />
                    Delivery Address
                  </span>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter delivery address"
                    className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
                  />
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <MessageSquare size={17} className="text-green-600" />
                    Order Note
                  </span>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Any special instruction?"
                    rows="3"
                    className="w-full resize-none rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
                  />
                </label>
              </div>
            </div>

            <div className="border-t border-yellow-100 pt-5">
              <h2 className="text-xl font-black text-slate-900">Payment</h2>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setFormData((currentData) => ({
                        ...currentData,
                        paymentMethod: method.id,
                      }))
                    }
                    className={`rounded-[22px] border-2 p-3 text-left transition ${
                      formData.paymentMethod === method.id
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-yellow-100 bg-yellow-50 hover:border-yellow-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                          formData.paymentMethod === method.id
                            ? "bg-green-500 text-white"
                            : "bg-white text-yellow-600"
                        }`}
                      >
                        <method.icon size={19} />
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-slate-900">
                          {method.title}
                        </h3>
                        <p className="mt-1 text-xs leading-4 text-slate-500">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {formData.paymentMethod === "bank-transfer" && (
                <div className="mt-4 rounded-[24px] bg-yellow-50 p-4">
                  <h3 className="text-base font-black text-slate-900">
                    Transfer Details
                  </h3>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[18px] bg-white p-3">
                      <p className="text-xs font-black text-slate-400">Bank</p>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {businessAccount.bankName}
                      </p>
                    </div>

                    <div className="rounded-[18px] bg-white p-3">
                      <p className="text-xs font-black text-slate-400">
                        Account No.
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {businessAccount.accountNumber}
                      </p>
                    </div>

                    <div className="rounded-[18px] bg-white p-3">
                      <p className="text-xs font-black text-slate-400">
                        Account Name
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {businessAccount.accountName}
                      </p>
                    </div>
                  </div>

                  <input
                    type="text"
                    name="transferReference"
                    value={formData.transferReference}
                    onChange={handleChange}
                    placeholder="Transfer reference / sender name"
                    className="mt-4 w-full rounded-[20px] border border-yellow-200 bg-white px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
                  />
                </div>
              )}

              {formData.paymentMethod === "card" && (
                <div className="mt-4 rounded-[24px] bg-green-50 p-4">
                  <h3 className="text-base font-black text-slate-900">
                    Card Details
                  </h3>

                  <p className="mt-1 text-xs font-bold text-slate-500">
                    Demo card form. Later connect Paystack or Flutterwave.
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="Name on card"
                      className="rounded-[20px] border border-green-200 bg-white px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 md:col-span-2"
                    />

                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="Card number"
                      maxLength="19"
                      className="rounded-[20px] border border-green-200 bg-white px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 md:col-span-2"
                    />

                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="rounded-[20px] border border-green-200 bg-white px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
                    />

                    <input
                      type="password"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleChange}
                      placeholder="CVV"
                      maxLength="4"
                      className="rounded-[20px] border border-green-200 bg-white px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
                    />
                  </div>
                </div>
              )}

              {formData.paymentMethod === "cash-on-delivery" && (
                <div className="mt-4 rounded-[24px] bg-orange-50 p-4">
                  <h3 className="text-base font-black text-slate-900">
                    Cash on Delivery
                  </h3>
                  <p className="mt-1 text-sm font-bold text-slate-600">
                    You will pay when your order arrives.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-[60px] bg-green-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-green-600"
            >
              Place Order
            </button>
          </form>

          <aside className="h-fit rounded-[32px] bg-white p-5 shadow-xl">
            <h2 className="text-xl font-black text-slate-900">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-b border-yellow-100 pb-3"
                >
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      {item.name}
                    </p>
                    <p className="text-xs font-bold text-slate-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-black text-green-700">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}

              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>Delivery</span>
                <span>
                  {deliveryFee > 0 ? formatPrice(deliveryFee) : "Select zone"}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>Payment</span>
                <span>
                  {formData.paymentMethod
                    ? paymentMethods.find(
                        (method) => method.id === formData.paymentMethod
                      )?.title
                    : "Select method"}
                </span>
              </div>

              <div className="border-t border-yellow-100 pt-4">
                <div className="flex justify-between text-lg font-black text-slate-900">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {formData.paymentMethod === "bank-transfer" && (
              <div className="mt-5 rounded-[24px] bg-yellow-50 p-4">
                <p className="text-sm font-black text-slate-900">
                  Bank Transfer
                </p>
                <p className="mt-2 text-sm font-bold text-slate-600">
                  {businessAccount.bankName} • {businessAccount.accountNumber}
                </p>
                <p className="text-sm font-bold text-slate-600">
                  {businessAccount.accountName}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Checkout;