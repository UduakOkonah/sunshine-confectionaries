import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

import logo from "../../assets/logo.png";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import NotificationBell from "../notifications/NotificationBell";
import ThemeToggle from "../ui/ThemeToggle";
import SearchOverlay from "../search/SearchOverlay";

function CustomerNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Promotions", path: "/promotions" },
  ];

  const mobileLinks = [
    ...navLinks,
    { name: "My Orders", path: "/my-orders" },
    { name: "Profile", path: "/profile" },
    { name: "Custom Cake", path: "/custom-cake" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-yellow-200/70 bg-white/90 shadow-lg backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 xl:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1 shadow-lg ring-4 ring-yellow-100 sm:h-14 sm:w-14">
            <img
              src={logo}
              alt="Sunshine Confectionaries"
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-black leading-none text-green-700 lg:text-xl">
              Sunshine
            </h1>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500 lg:text-xs">
              Confectionaries
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full bg-yellow-50 p-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `rounded-full px-5 py-2.5 text-sm font-black transition ${
                  isActive
                    ? "bg-green-500 text-white shadow-md"
                    : "text-slate-700 hover:bg-white hover:text-green-700"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            aria-label="Open search"
          >
            <Search size={18} />
          </button>

          <ThemeToggle />

          <NotificationBell />

          <Link
            to="/favorites"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-pink-50 text-pink-600 transition hover:bg-pink-100 xl:h-12 xl:w-12"
            aria-label="Favorites"
          >
            <Heart size={18} />

            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-black text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-200 transition hover:bg-green-600 xl:h-12 xl:w-12"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-300 text-[10px] font-black text-slate-900">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-3 text-sm font-black text-yellow-700 transition hover:bg-yellow-200 xl:px-5"
            >
              <User size={17} />
              <span className="hidden xl:inline">Profile</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-green-500 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-green-600"
            >
              Login
            </Link>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100"
            >
              Logout
            </button>
          )}
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full bg-green-500 p-3 text-white shadow-lg lg:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {isOpen && (
        <div className="max-h-[calc(100vh-76px)] overflow-y-auto border-t border-yellow-200 bg-white/95 p-4 shadow-xl backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-2xl flex-col gap-2">
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setIsOpen(false);
              }}
              className="mb-2 flex items-center justify-between rounded-[24px] bg-slate-100 px-4 py-3 text-sm font-black text-slate-700"
            >
              <span>Search Products</span>
              <Search size={18} />
            </button>

            <div className="mb-2 flex items-center justify-between rounded-[24px] bg-yellow-50 px-4 py-3">
              <span className="text-sm font-black text-slate-700">Theme</span>
              <ThemeToggle />
            </div>

            <div className="mb-2 flex items-center justify-between rounded-[24px] bg-green-50 px-4 py-3">
              <span className="text-sm font-black text-slate-700">
                Notifications
              </span>
              <NotificationBell />
            </div>

            {mobileLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-[24px] px-4 py-3 text-sm font-black ${
                    isActive
                      ? "bg-green-500 text-white"
                      : "bg-yellow-50 text-slate-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/favorites"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-[24px] bg-pink-50 px-4 py-3 text-sm font-black text-pink-600"
              >
                <Heart size={18} />
                Favorites ({wishlistCount})
              </Link>

              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-[24px] bg-green-500 px-4 py-3 text-sm font-black text-white"
              >
                <ShoppingCart size={18} />
                Cart ({cartCount})
              </Link>
            </div>

            {isAuthenticated ? (
              <>
                <div className="rounded-[24px] bg-yellow-100 px-4 py-3 text-center text-sm font-black text-yellow-700">
                  {user?.name}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-[24px] bg-red-50 px-4 py-3 text-sm font-black text-red-600"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-[24px] bg-green-500 px-4 py-3 text-center text-sm font-black text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-[24px] bg-yellow-100 px-4 py-3 text-center text-sm font-black text-yellow-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}

export default CustomerNavbar;