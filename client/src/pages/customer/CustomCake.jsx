import { motion } from "framer-motion";
import {
  Calendar,
  Cake,
  DollarSign,
  ImagePlus,
  Send,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function CustomCake() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    flavor: "",
    size: "",
    budget: "",
    eventDate: "",
    cakeText: "",
    note: "",
    image: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleImage = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFormData((currentData) => ({
        ...currentData,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    toast.success("Custom cake request submitted");
  };

  return (
    <section className="overflow-hidden bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
            Custom Cake Request
          </p>

          <h1 className="text-5xl font-black text-slate-900">
            Design your dream cake.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Upload inspiration photos, select flavors, and tell us exactly
            what you want.
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
            <div className="grid gap-5 md:grid-cols-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
              />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
              />

              <select
                name="flavor"
                value={formData.flavor}
                onChange={handleChange}
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
              >
                <option value="">Select flavor</option>
                <option>Chocolate</option>
                <option>Vanilla</option>
                <option>Red Velvet</option>
                <option>Strawberry</option>
              </select>

              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400"
              >
                <option value="">Select size</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
                <option>Extra Large</option>
              </select>

              <div className="relative">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  size={18}
                />

                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Budget"
                  className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-green-400"
                />
              </div>

              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                  size={18}
                />

                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-green-400"
                />
              </div>

              <input
                type="text"
                name="cakeText"
                value={formData.cakeText}
                onChange={handleChange}
                placeholder="Text on cake"
                className="rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 md:col-span-2"
              />

              <textarea
                rows="5"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Describe your cake idea..."
                className="resize-none rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm font-bold outline-none focus:border-green-400 md:col-span-2"
              />
            </div>

            <div className="mt-6">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-yellow-300 bg-yellow-50 px-6 py-10 text-center transition hover:border-green-400 hover:bg-green-50">
                <ImagePlus size={38} className="text-green-600" />

                <p className="mt-4 text-lg font-black text-slate-900">
                  Upload inspiration image
                </p>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  JPG, PNG, WEBP
                </p>

                <input
                  type="file"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>

              {formData.image && (
                <img
                  src={formData.image}
                  alt="Cake inspiration"
                  className="mt-5 h-72 w-full rounded-[28px] object-cover shadow-lg"
                />
              )}
            </div>

            <button
              type="submit"
              className="mt-8 inline-flex items-center gap-2 rounded-[60px] bg-green-500 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-600"
            >
              <Send size={18} />
              Submit Request
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-[36px] bg-white p-6 shadow-2xl"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-green-100 text-green-700">
              <Cake size={34} />
            </div>

            <h2 className="mt-6 text-3xl font-black text-slate-900">
              Premium Custom Cakes
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              We create cakes for birthdays, weddings, anniversaries,
              graduations, baby showers, and more.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Luxury themed cakes",
                "Photo cakes",
                "Wedding cakes",
                "Cupcake towers",
                "Fondant cakes",
                "Buttercream designs",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[22px] bg-yellow-50 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                    <Sparkles size={18} />
                  </div>

                  <p className="text-sm font-black text-slate-800">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CustomCake;