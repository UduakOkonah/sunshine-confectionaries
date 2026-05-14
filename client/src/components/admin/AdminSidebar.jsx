import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MapPinned,
  ShieldCheck,
  Menu,
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
    name: "Delivery Zones",
    path: "/admin/delivery-zones",
    icon: MapPinned,
  },
];

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const navItemClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-black transition ${
      isActive
        ? "bg-green-600 text-white shadow-lg shadow-green-200"
        : "text-slate-600 hover:bg-white hover:text-green-700 hover:shadow-md"
    }`;

  return (
    <>
      {/* Mobile Top Bar */}
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
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          onClick={closeMenu}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          aria-label="Close menu overlay"
        />
      )}

      {/* Desktop + Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex min-h-screen w-72 flex-col border-r border-green-100 bg-gradient-to-b from-white via-green-50 to-yellow-50 p-6 text-slate-900 shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Green Full Header */}
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
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={closeMenu}
              className={navItemClass}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <link.icon size={20} />
              </span>

              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Card */}
        <div className="mt-auto rounded-[26px] border border-green-100 bg-white p-5 shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <ShieldCheck size={22} />
          </div>

          <h2 className="mt-4 text-sm font-black text-slate-900">
            Admin Control
          </h2>

          <p className="mt-2 text-xs leading-6 text-slate-500">
            Manage products, orders, and delivery zones with confidence.
          </p>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;