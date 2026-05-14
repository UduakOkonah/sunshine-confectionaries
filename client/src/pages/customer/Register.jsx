import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = register(formData);

    if (user) {
      navigate("/");
    }
  };

  return (
    <section className="bg-[#FFF7D6] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[36px] bg-white p-6 shadow-xl">
        <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          Create Account
        </p>

        <h1 className="text-3xl font-black text-slate-900">
          Join Sunshine.
        </h1>

        <p className="mt-2 text-sm font-medium text-slate-600">
          Create an account to order and track deliveries.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label>
            <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
              <User size={17} className="text-green-600" />
              Full Name
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
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
              placeholder="you@example.com"
              className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
            />
          </label>

          <label>
            <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
              <Phone size={17} className="text-green-600" />
              Phone
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
              <Lock size={17} className="text-green-600" />
              Password
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-[60px] bg-green-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-green-600"
          >
            Create Account
          </button>
        </form>

        <p className="mt-5 text-center text-sm font-bold text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-black text-green-700">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;