import {
  Building2,
  CreditCard,
  Globe,
  Mail,
  Phone,
  Save,
} from "lucide-react";

import { useSettings } from "../../context/SettingsContext";

function AdminSettings() {
  const { settings, updateSettings } = useSettings();

  const [formData, setFormData] = useState(settings);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    updateSettings(formData);
  };

  return (
    <section className="bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          Settings
        </p>

        <h1 className="text-4xl font-black text-slate-900">
          Bakery Settings
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[32px] bg-white p-6 shadow-xl"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                <Building2 size={17} className="text-green-600" />
                Bakery Name
              </span>

              <input
                type="text"
                name="bakeryName"
                value={formData.bakeryName}
                onChange={handleChange}
                className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
              />
            </label>

            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                <Phone size={17} className="text-green-600" />
                Phone
              </span>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
              />
            </label>

            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                <Mail size={17} className="text-green-600" />
                Email
              </span>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
              />
            </label>

        <label>
        <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
            <Globe size={17} className="text-green-600" />
            Social Handle
        </span>

        <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
        />
        </label>

            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                <CreditCard size={17} className="text-green-600" />
                Bank Name
              </span>

              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-black text-slate-700">
                Account Number
              </span>

              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex items-center gap-2 rounded-[60px] bg-green-500 px-6 py-4 text-sm font-black text-white shadow-lg"
          >
            <Save size={18} />
            Save Settings
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminSettings;