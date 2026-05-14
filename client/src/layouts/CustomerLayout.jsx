import { Outlet } from "react-router-dom";
import Navbar from "../components/customer/CustomerNavbar";
import Footer from "../components/customer/CustomerFooter";

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#FFF7D6]">
      <Navbar />

      <main className="pt-20 sm:pt-24">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default CustomerLayout;