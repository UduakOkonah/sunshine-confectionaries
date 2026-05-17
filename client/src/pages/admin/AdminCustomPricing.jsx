import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AdminCustomPricing() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    orderType: "CUSTOM",
    itemCategory: "",
    itemName: "",
    size: "",
    packageLabel: "",
    minQuantity: 1,
    price: "",
    description: "",
  });

  const getAdminToken = () => {
    return (
      localStorage.getItem("sunshine-token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      ""
    );
  };

  const getAuthConfig = () => {
    const token = getAdminToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchPrices = async () => {
    try {
      setLoading(true);

      const token = getAdminToken();

      if (!token) {
        toast.error("Admin token not found. Please login again.");
        return;
      }

      const { data } = await axios.get(
        `${API_URL}/custom-pricing/admin`,
        getAuthConfig()
      );

      setPrices(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch custom pricing."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const createPrice = async (event) => {
    event.preventDefault();

    if (!formData.itemCategory.trim()) {
      toast.error("Please enter item category.");
      return;
    }

    if (!formData.itemName.trim()) {
      toast.error("Please enter item name.");
      return;
    }

    if (!formData.price) {
      toast.error("Please enter price.");
      return;
    }

    if (formData.orderType === "CUSTOM" && !formData.size.trim()) {
      toast.error("Please enter size for custom order.");
      return;
    }

    if (formData.orderType === "BULK" && !formData.packageLabel.trim()) {
      toast.error("Please enter package label for bulk order.");
      return;
    }

    try {
      const payload = {
        orderType: formData.orderType,
        itemCategory: formData.itemCategory.trim(),
        itemName: formData.itemName.trim(),
        size: formData.orderType === "CUSTOM" ? formData.size.trim() : "",
        packageLabel:
          formData.orderType === "BULK" ? formData.packageLabel.trim() : "",
        minQuantity:
          formData.orderType === "BULK"
            ? Number(formData.minQuantity) || 1
            : 1,
        price: Number(formData.price),
        description: formData.description.trim(),
        isActive: true,
      };

      const { data } = await axios.post(
        `${API_URL}/custom-pricing/admin`,
        payload,
        getAuthConfig()
      );

      setPrices((current) => [data.price, ...current]);

      setFormData({
        orderType: "CUSTOM",
        itemCategory: "",
        itemName: "",
        size: "",
        packageLabel: "",
        minQuantity: 1,
        price: "",
        description: "",
      });

      toast.success("Price added successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add price.");
    }
  };

  const deletePrice = async (priceId) => {
    try {
      await axios.delete(
        `${API_URL}/custom-pricing/admin/${priceId}`,
        getAuthConfig()
      );

      setPrices((current) => current.filter((item) => item._id !== priceId));

      toast.success("Price deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete price.");
    }
  };

  if (loading) {
    return (
      <section className="p-6">
        <p className="font-bold text-slate-600">Loading custom prices...</p>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-green-600">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-900">
          Custom Pricing
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Add item prices, size prices, and fixed bulk order prices in Naira.
        </p>
      </div>

      <form
        onSubmit={createPrice}
        className="mt-8 rounded-3xl bg-white p-6 shadow-lg"
      >
        <h2 className="text-xl font-black text-slate-900">Add New Price</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <select
            name="orderType"
            value={formData.orderType}
            onChange={handleChange}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
          >
            <option value="CUSTOM">Custom Order</option>
            <option value="BULK">Bulk Order</option>
          </select>

          <input
            name="itemCategory"
            value={formData.itemCategory}
            onChange={handleChange}
            placeholder="Category e.g. Cake, Pastries, Small Chops"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
          />

          <input
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="Item name e.g. Birthday Cake"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
          />

          {formData.orderType === "CUSTOM" ? (
            <input
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="Size e.g. 8 inches, Box of 12"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
            />
          ) : (
            <input
              name="packageLabel"
              value={formData.packageLabel}
              onChange={handleChange}
              placeholder="Package e.g. 100 pieces, 20 packs"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
            />
          )}

          {formData.orderType === "BULK" && (
            <input
              type="number"
              min="1"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              placeholder="Minimum quantity"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
            />
          )}

          <input
            type="number"
            min="0"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price in Naira"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description, optional"
            rows="4"
            className="resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 md:col-span-2"
          />
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-4 text-sm font-black text-white transition hover:bg-green-600"
        >
          <Plus size={18} />
          Add Price
        </button>
      </form>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="text-xl font-black text-slate-900">Current Prices</h2>

        <div className="mt-5 grid gap-4">
          {prices.length === 0 ? (
            <p className="text-sm text-slate-500">
              No custom prices added yet.
            </p>
          ) : (
            prices.map((item) => (
              <div
                key={item._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"
              >
                <div>
                  <p className="text-xs font-black text-slate-400">
                    {item.orderType}
                  </p>

                  <h3 className="mt-1 font-black text-slate-900">
                    {item.itemCategory} — {item.itemName}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {item.size || item.packageLabel}
                  </p>

                  {item.orderType === "BULK" && (
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      Minimum quantity: {item.minQuantity}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <p className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
                    {formatNaira(item.price)}
                  </p>

                  <button
                    type="button"
                    onClick={() => deletePrice(item._id)}
                    className="rounded-full bg-red-500 p-3 text-white transition hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminCustomPricing;