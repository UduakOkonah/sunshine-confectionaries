import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "admin@sunshine.com",
    password: "123456",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      if (result.user?.role !== "admin") {
        return;
      }

      navigate("/admin/dashboard");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF7D6] px-4 py-16">
      {/* BACKGROUND */}
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-green-300/40 blur-3xl" />

      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-yellow-300/50 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[42px] bg-white shadow-2xl lg:grid-cols-[1fr_420px]">
        {/* LEFT PANEL */}
        <div className="hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md">
              Admin Access
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight">
              Sunshine Control Panel
            </h1>

            <p className="mt-5 max-w-md text-base leading-8 text-green-50">
              Manage products, customer orders, payments, delivery tracking,
              analytics, and bakery operations from one secure dashboard.
            </p>
          </div>

          <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-md">
            <p className="text-sm font-black">
              Secure Admin Portal
            </p>

            <p className="mt-2 text-sm leading-6 text-green-50/90">
              Authorized bakery staff only.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-green-100 text-green-700 shadow-md">
            <ShieldCheck size={34} />
          </div>

          <h2 className="mt-5 text-center text-3xl font-black text-slate-900">
            Admin Login
          </h2>

          <p className="mt-2 text-center text-sm font-medium text-slate-600">
            Sign in to manage Sunshine Confectionaries.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* EMAIL */}
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                <Mail
                  size={17}
                  className="text-green-600"
                />
                Admin Email
              </span>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter admin email"
                className="w-full rounded-[22px] border border-green-100 bg-green-50 px-4 py-4 text-sm font-bold outline-none transition focus:border-green-400 focus:bg-white"
              />
            </label>

            {/* PASSWORD */}
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                <Lock
                  size={17}
                  className="text-green-600"
                />
                Admin Password
              </span>

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full rounded-[22px] border border-green-100 bg-green-50 px-4 py-4 text-sm font-bold outline-none transition focus:border-green-400 focus:bg-white"
              />
            </label>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-4 text-sm font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-1 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Login as Admin"}

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          <div className="mt-6 rounded-[24px] bg-yellow-50 p-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-600">
              Demo Admin
            </p>

            <p className="mt-2 text-sm font-bold text-slate-700">
              admin@sunshine.com
            </p>

            <p className="mt-1 text-sm font-bold text-slate-700">
              Password: 123456
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;