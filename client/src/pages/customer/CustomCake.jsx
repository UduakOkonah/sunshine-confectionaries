import { motion } from "framer-motion";
import {
  Banknote,
  Calendar,
  ClipboardList,
  ImagePlus,
  PackageCheck,
  Phone,
  Send,
  Sparkles,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function CustomCake() {
  const navigate = useNavigate();

  const [pricing, setPricing] = useState([]);
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    orderType: "CUSTOM",
    pricingId: "",
    quantity: 1,
    flavor: "",
    eventDate: "",
    deliveryMethod: "PICKUP",
    deliveryAddress: "",
    customText: "",
    note: "",
    image: null,
  });

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoadingPricing(true);

        const { data } = await axios.get(`${API_URL}/custom-pricing`);

        setPricing(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("CUSTOM PRICING FETCH ERROR:", error.response?.data || error);
        toast.error("Failed to load custom order prices.");
      } finally {
        setLoadingPricing(false);
      }
    };

    fetchPricing();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const filteredPricing = useMemo(() => {
    return pricing.filter((item) => item.orderType === formData.orderType);
  }, [pricing, formData.orderType]);

  const selectedPricing = useMemo(() => {
    return pricing.find((item) => item._id === formData.pricingId);
  }, [pricing, formData.pricingId]);

  const orderQuantity = useMemo(() => {
    const value = Math.max(1, Number(formData.quantity) || 1);
    return value;
  }, [formData.quantity]);

  const estimatedTotal = useMemo(() => {
    if (!selectedPricing) return 0;

    return Number(selectedPricing.price || 0) * orderQuantity;
  }, [selectedPricing, orderQuantity]);

  const minDate = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleOrderTypeChange = (orderType) => {
    setFormData((currentData) => ({
      ...currentData,
      orderType,
      pricingId: "",
      quantity: 1,
    }));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large. Please upload below 5MB.");
      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setFormData((currentData) => ({
      ...currentData,
      image: file,
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      return "Please enter your name.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!formData.pricingId) {
      return "Please select an item and price.";
    }

    if (!formData.eventDate) {
      return "Please select the event/delivery date.";
    }

    if (Number(formData.quantity) < 1) {
      return "Quantity must be at least 1.";
    }

    if (formData.deliveryMethod === "DELIVERY" && !formData.deliveryAddress.trim()) {
      return "Please enter delivery address.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();

      payload.append("customerName", formData.customerName.trim());
      payload.append("phone", formData.phone.trim());
      payload.append("email", formData.email.trim());
      payload.append("orderType", formData.orderType);
      payload.append("pricingId", formData.pricingId);
      payload.append("quantity", String(orderQuantity));
      payload.append("flavor", formData.flavor.trim());
      payload.append("eventDate", formData.eventDate);
      payload.append("deliveryMethod", formData.deliveryMethod);
      payload.append("deliveryAddress", formData.deliveryAddress.trim());
      payload.append("customText", formData.customText.trim());
      payload.append("note", formData.note.trim());

      if (formData.image) {
        payload.append("image", formData.image);
      }

      const { data } = await axios.post(`${API_URL}/custom-orders`, payload);

      toast.success("Order submitted. Awaiting admin approval.");

      const trackingCode = data?.order?.trackingCode;

      if (trackingCode) {
        navigate(`/order-success/${trackingCode}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("CUSTOM ORDER SUBMIT ERROR:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to submit custom order."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="overflow-hidden bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
            Custom & Bulk Orders
          </p>

          <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
            Order cakes, pastries, small chops, and more.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Select your item, choose a size or bulk package, upload inspiration,
            and submit your request for admin approval.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
          <motion.form
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="rounded-[36px] bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleOrderTypeChange("CUSTOM")}
                className={`rounded-[24px] px-5 py-4 text-sm font-black transition ${
                  formData.orderType === "CUSTOM"
                    ? "bg-green-500 text-white shadow-lg shadow-green-200"
                    : "bg-yellow-50 text-slate-700 hover:bg-yellow-100"
                }`}
              >
                Custom Order
              </button>

              <button
                type="button"
                onClick={() => handleOrderTypeChange("BULK")}
                className={`rounded-[24px] px-5 py-4 text-sm font-black transition ${
                  formData.orderType === "BULK"
                    ? "bg-green-500 text-white shadow-lg shadow-green-200"
                    : "bg-yellow-50 text-slate-700 hover:bg-yellow-100"
                }`}
              >
                Bulk Order
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  size={18}
                />

                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-green-400"
                />
              </div>

              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  size={18}
                />

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-green-400"
                />
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address, optional"
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 md:col-span-2"
              />

              <select
                name="pricingId"
                value={formData.pricingId}
                onChange={handleChange}
                disabled={loadingPricing}
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 md:col-span-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="">
                  {loadingPricing
                    ? "Loading prices..."
                    : filteredPricing.length === 0
                    ? `No ${formData.orderType.toLowerCase()} prices available`
                    : "Select item and price"}
                </option>

                {filteredPricing.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.itemCategory} — {item.itemName}
                    {item.size ? ` — ${item.size}` : ""}
                    {item.packageLabel ? ` — ${item.packageLabel}` : ""} —{" "}
                    {formatNaira(item.price)}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder={
                  formData.orderType === "BULK"
                    ? "Number of packages"
                    : "Quantity"
                }
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
              />

              <input
                type="text"
                name="flavor"
                value={formData.flavor}
                onChange={handleChange}
                placeholder="Flavor, optional"
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
              />

              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  size={18}
                />

                <input
                  type="date"
                  min={minDate}
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-green-400"
                />
              </div>

              <select
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleChange}
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
              >
                <option value="PICKUP">Pickup</option>
                <option value="DELIVERY">Delivery</option>
              </select>

              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                placeholder="Delivery address, if delivery"
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 md:col-span-2"
              />

              <input
                type="text"
                name="customText"
                value={formData.customText}
                onChange={handleChange}
                placeholder="Text/name to write, optional"
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 md:col-span-2"
              />

              <textarea
                rows="5"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Describe your order idea, design, color, theme, packaging, or special request..."
                className="resize-none rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 md:col-span-2"
              />
            </div>

            <div className="mt-6 rounded-[28px] bg-green-50 p-5">
              <div className="flex items-center gap-2 text-green-700">
                <Banknote size={20} />
                <p className="text-sm font-black">Estimated Total</p>
              </div>

              <h3 className="mt-2 text-3xl font-black text-green-700">
                {formatNaira(estimatedTotal)}
              </h3>

              {selectedPricing && (
                <p className="mt-2 text-xs font-bold leading-5 text-slate-500">
                  Selected: {selectedPricing.itemCategory} —{" "}
                  {selectedPricing.itemName}{" "}
                  {selectedPricing.size || selectedPricing.packageLabel}
                </p>
              )}

              <p className="mt-2 text-xs font-bold leading-5 text-slate-500">
                Admin may adjust the final price after reviewing your request.
              </p>
            </div>

            <div className="mt-6">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-yellow-300 bg-yellow-50 px-6 py-10 text-center transition hover:border-green-400 hover:bg-green-50">
                <ImagePlus size={38} className="text-green-600" />

                <p className="mt-4 text-lg font-black text-slate-900">
                  Upload inspiration image
                </p>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  JPG, PNG, WEBP. Max 5MB.
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Order inspiration"
                  className="mt-5 h-72 w-full rounded-[28px] object-cover shadow-lg"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || loadingPricing}
              className="mt-8 inline-flex items-center gap-2 rounded-[60px] bg-green-500 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Send size={18} />
              {submitting ? "Submitting..." : "Submit for Approval"}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-[36px] bg-white p-6 shadow-2xl"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-green-100 text-green-700">
              <PackageCheck size={34} />
            </div>

            <h2 className="mt-6 text-3xl font-black text-slate-900">
              Order goes to admin first
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Your request will be reviewed before it is approved. You will get
              a tracking code after submission.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Sparkles,
                  title: "Admin-controlled prices",
                  text: "Sizes and bulk prices come directly from backend.",
                },
                {
                  icon: ClipboardList,
                  title: "Approval workflow",
                  text: "Orders enter the dashboard as awaiting approval.",
                },
                {
                  icon: Truck,
                  title: "Pickup or delivery",
                  text: "Customers can choose their preferred option.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-[22px] bg-yellow-50 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                      <Icon size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-800">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CustomCake;