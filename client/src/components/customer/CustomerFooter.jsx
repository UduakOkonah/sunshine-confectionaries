import { Link } from "react-router-dom";
import {
  Globe,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

function CustomerFooter() {
  const { settings } = useSettings();

  const socialIcons = [Globe, Sparkles, Star];


  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 px-4 py-10 text-white">
      {/* Soft Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffffff22,transparent_30%),radial-gradient(circle_at_bottom_right,#facc1522,transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-100 backdrop-blur-md">
              Freshly Baked
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              {settings.bakeryName}
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-green-50/90">
              Premium cakes, pastries, cupcakes, and desserts delivered fresh
              with love and happiness.
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-3">
              {socialIcons.map((Icon, index) => (
                <button
                  key={index}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white hover:text-green-700"
                >
                  <Icon
                    size={18}
                    className="transition group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-black">Quick Links</h3>

            <div className="mt-4 flex flex-col gap-2 text-sm text-green-50/90">
              <Link to="/" className="transition hover:translate-x-1">
                Home
              </Link>

              <Link
                to="/products"
                className="transition hover:translate-x-1"
              >
                Products
              </Link>

              <Link
                to="/favorites"
                className="transition hover:translate-x-1"
              >
                Favorites
              </Link>

              <Link
                to="/custom-cake"
                className="transition hover:translate-x-1"
              >
                Custom Cakes
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-black">Support</h3>

            <div className="mt-4 flex flex-col gap-2 text-sm text-green-50/90">
              <Link to="/faq" className="transition hover:translate-x-1">
                FAQ
              </Link>

              <Link to="/contact" className="transition hover:translate-x-1">
                Contact
              </Link>

              <Link
                to="/my-orders"
                className="transition hover:translate-x-1"
              >
                Track Orders
              </Link>

              <Link
                to="/promotions"
                className="transition hover:translate-x-1"
              >
                Promotions
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-black">Contact</h3>

            <div className="mt-4 space-y-3 text-sm text-green-50/90">
              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md">
                <Phone size={16} className="shrink-0 text-yellow-200" />
                <span>{settings.phone}</span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md">
                <Mail size={16} className="shrink-0 text-emerald-200" />
                <span>{settings.email}</span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md">
                <MapPin size={16} className="shrink-0 text-pink-200" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-white/15 pt-5">
          <div className="flex flex-col gap-2 text-center text-xs text-green-100 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              © {new Date().getFullYear()} {settings.bakeryName}.
            </p>

            <p>Freshly baked happiness delivered daily.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default CustomerFooter;