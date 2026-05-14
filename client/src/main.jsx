import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

import { ProductProvider } from "./context/ProductContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <ProductProvider>
            <AuthProvider>
              <OrderProvider>
                <CartProvider>
                  <WishlistProvider>
                    <NotificationProvider>
                      <App />
                      <Toaster position="top-right" />
                    </NotificationProvider>
                  </WishlistProvider>
                </CartProvider>
              </OrderProvider>
            </AuthProvider>
          </ProductProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);