import { Route, Routes, Navigate } from "react-router-dom";

import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import OrderSuccess from "./pages/customer/OrderSuccess";
import MyOrders from "./pages/customer/MyOrders";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import Profile from "./pages/customer/Profile";
import Favorites from "./pages/customer/Favorites";
import Promotions from "./pages/customer/Promotions";
import FAQ from "./pages/customer/FAQ";
import Contact from "./pages/customer/Contact";
import CustomCake from "./pages/customer/CustomCake";
import ProductDetails from "./pages/customer/ProductDetails";
import PaymentCallback from "./pages/customer/PaymentCallback";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDeliveryZones from "./pages/admin/AdminDeliveryZones";
import AdminCustomOrders from "./pages/admin/AdminCustomOrders";
import AdminCustomPricing from "./pages/admin/AdminCustomPricing";


function App() {
  return (
    <Routes>
      {/* CUSTOMER ROUTES */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
  path="/payment/callback"
  element={
    <ProtectedRoute>
      <PaymentCallback />
    </ProtectedRoute>
  }
/>
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/custom-cake"
            element={
              <ProtectedRoute>
                <CustomCake />
              </ProtectedRoute>
            }
          />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/order-success/:trackingCode" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ADMIN LOGIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="delivery" element={<AdminDeliveryZones />} />
        <Route path="/admin/custom-orders" element={<AdminCustomOrders />} />
<Route path="/admin/custom-pricing" element={<AdminCustomPricing />} />
      </Route>
    </Routes>
  );
}

export default App;