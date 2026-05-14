import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
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

    const user = login(formData.email, formData.password);

    if (user) {
      navigate("/");
    }
  };

  return (
    <section className="bg-[#FFF7D6] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[36px] bg-white p-6 shadow-xl">
        <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          Customer Login
        </p>

        <h1 className="text-3xl font-black text-slate-900">
          Welcome back.
        </h1>

        <p className="mt-2 text-sm font-medium text-slate-600">
          Login to track your orders and checkout faster.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              <Lock size={17} className="text-green-600" />
              Password
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full rounded-[20px] border border-yellow-200 bg-yellow-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-green-400 focus:bg-white"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-[60px] bg-green-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-green-600"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm font-bold text-slate-600">
          No account?{" "}
          <Link to="/register" className="font-black text-green-700">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;