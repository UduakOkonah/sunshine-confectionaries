import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BadgeDollarSign,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Order Requests",
    path: "/admin/custom-orders",
    icon: ClipboardList,
  },
  {
    name: "Custom Pricing",
    path: "/admin/custom-pricing",
    icon: BadgeDollarSign,
  },
  {
    name: "Delivery",
    path: "/admin/delivery",
    icon: Truck,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("sunshine-token");
    localStorage.removeItem("sunshine-user");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");

    closeMenu();
    navigate("/admin/login");
  };

  const navItemClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-black transition ${
      isActive
        ? "bg-green-600 text-white shadow-lg shadow-green-200"
        : "text-slate-600 hover:bg-white hover:text-green-700 hover:shadow-md"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-green-100 bg-white px-4 py-3 shadow-sm lg:hidden">
        <div>
          <h1 className="text-lg font-black text-green-700">
            Sunshine Admin
          </h1>

          <p className="text-xs font-semibold text-slate-500">
            Bakery management
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-white shadow-md"
          aria-label="Open admin menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {isOpen && (
        <button
          type="button"
          onClick={closeMenu}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex h-screen w-72 flex-col overflow-y-auto border-r border-green-100 bg-gradient-to-b from-white via-green-50 to-yellow-50 p-6 text-slate-900 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="-mx-6 -mt-6 rounded-b-[32px] bg-gradient-to-br from-green-500 to-emerald-700 p-6 text-white shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="mt-4 text-2xl font-black leading-tight">
                Sunshine Admin
              </h1>

              <p className="mt-2 text-sm leading-6 text-green-50">
                Bakery management system
              </p>
            </div>

            <button
              type="button"
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white lg:hidden"
              aria-label="Close admin menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className={navItemClass}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Icon size={20} />
                </span>

                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 rounded-[26px] border border-green-100 bg-white p-5 shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <ShieldCheck size={22} />
          </div>

          <h2 className="mt-4 text-sm font-black text-slate-900">
            Admin Control
          </h2>

          <p className="mt-2 text-xs leading-6 text-slate-500">
            Manage products, customer orders, custom requests, pricing, and
            delivery zones.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-4 text-sm font-black text-red-600 transition hover:bg-red-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}

export default AdminSidebar;