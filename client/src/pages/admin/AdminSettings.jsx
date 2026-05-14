import { useState } from "react";
import {
  BadgePercent,
  Building2,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  Save,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useSettings } from "../../context/SettingsContext";

function AdminSettings() {
  const { settings, updateSettings } = useSettings();

  const [formData, setFormData] = useState({
    bakeryName: settings.bakeryName || "",
    phone: settings.phone || "",
    email: settings.email || "",
    address: settings.address || "",
    instagram: settings.instagram || "",
    bankName: settings.bankName || "",
    accountNumber: settings.accountNumber || "",
    accountName: settings.accountName || "",
    deliveryFee: settings.deliveryFee || "",
    currency: settings.currency || "NGN",
    taxRate: settings.taxRate || "",
    receiptPrefix: settings.receiptPrefix || "SUN",
    businessHours: settings.businessHours || "",
    orderNote: settings.orderNote || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    updateSettings({
      ...formData,
      deliveryFee: Number(formData.deliveryFee || 0),
      taxRate: Number(formData.taxRate || 0),
    });
  };

  const inputClass =
    "w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-800 outline-none transition focus:border-green-400 focus:bg-white";

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-black text-slate-700";

  return (
    <section className="min-h-screen bg-[#FFF7D6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[36px] border border-green-100 bg-gradient-to-br from-white via-green-50 to-yellow-50 p-6 shadow-xl sm:p-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-200/40 blur-3xl" />

          <div className="relative z-10">
            <p className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-700">
              Admin Settings
            </p>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Bakery Settings
            </h1>

            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
              Manage business details, payment information, delivery fees,
              receipt settings, and customer-facing bakery information.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-[32px] bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Business Information
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  These details show on the customer website and receipts.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label>
                <span className={labelClass}>
                  <Building2 size={17} className="text-green-600" />
                  Bakery Name
                </span>
                <input
                  type="text"
                  name="bakeryName"
                  value={formData.bakeryName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>
                  <Phone size={17} className="text-green-600" />
                  Phone
                </span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>
                  <Mail size={17} className="text-green-600" />
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>
                  <Globe size={17} className="text-green-600" />
                  Social Handle
                </span>
                <input
                  type="text"
                  name="instagram"
                  placeholder="@sunshineconfectionaries"
                  value={formData.instagram}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label className="md:col-span-2">
                <span className={labelClass}>
                  <MapPin size={17} className="text-green-600" />
                  Business Address
                </span>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label className="md:col-span-2">
                <span className={labelClass}>
                  <ShieldCheck size={17} className="text-green-600" />
                  Business Hours
                </span>
                <input
                  type="text"
                  name="businessHours"
                  placeholder="Mon - Sat, 8:00 AM - 7:00 PM"
                  value={formData.businessHours}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                <CreditCard size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Payment Details
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  Used for bank transfer and order payment instructions.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <label>
                <span className={labelClass}>
                  <CreditCard size={17} className="text-green-600" />
                  Bank Name
                </span>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>Account Number</span>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>Account Name</span>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <ReceiptText size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Order & Receipt Settings
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  Control receipt labels, delivery fee, tax, and order notes.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-4">
              <label>
                <span className={labelClass}>
                  <Globe size={17} className="text-green-600" />
                  Currency
                </span>
                <input
                  type="text"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>
                  <Truck size={17} className="text-green-600" />
                  Delivery Fee
                </span>
                <input
                  type="number"
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>
                  <BadgePercent size={17} className="text-green-600" />
                  Tax Rate %
                </span>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>
                  <ReceiptText size={17} className="text-green-600" />
                  Receipt Prefix
                </span>
                <input
                  type="text"
                  name="receiptPrefix"
                  value={formData.receiptPrefix}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label className="md:col-span-4">
                <span className={labelClass}>Customer Order Note</span>
                <textarea
                  name="orderNote"
                  rows="4"
                  placeholder="Example: Please confirm payment after placing your order."
                  value={formData.orderNote}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </label>
            </div>
          </div>

          <div className="sticky bottom-4 z-20 rounded-[28px] border border-green-100 bg-white/90 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Ready to save changes?
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  Changes will update your bakery information across the app.
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-4 text-sm font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-1 hover:bg-green-600"
              >
                <Save size={18} />
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AdminSettings;