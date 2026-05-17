import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("sunshine-user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("sunshine-token");

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const { data } = await api.get("/auth/me");

        setUser(data);
        localStorage.setItem("sunshine-user", JSON.stringify(data));
      } catch (error) {
        localStorage.removeItem("sunshine-token");
        localStorage.removeItem("sunshine-user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (formData) => {
    try {
      const { data } = await api.post("/auth/register", formData);

      localStorage.setItem("sunshine-token", data.token);
      localStorage.setItem("sunshine-user", JSON.stringify(data.user));

      setUser(data.user);

      toast.success("Registration successful");

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");

      return {
        success: false,
        user: null,
      };
    }
  };

  const login = async (formData) => {
    try {
      const { data } = await api.post("/auth/login", formData);

      localStorage.setItem("sunshine-token", data.token);
      localStorage.setItem("sunshine-user", JSON.stringify(data.user));

      setUser(data.user);

      toast.success("Login successful");

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");

      return {
        success: false,
        user: null,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("sunshine-token");
    localStorage.removeItem("sunshine-user");

    setUser(null);

    toast.success("Logged out");
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}