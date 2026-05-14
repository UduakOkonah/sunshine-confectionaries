import { Outlet } from "react-router-dom";
import CustomerNavbar from "../components/customer/CustomerNavbar";
import CustomerFooter from "../components/customer/CustomerFooter";

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#FFF7D6] text-slate-800">
      <CustomerNavbar />

      <main className="pt-24">
        <Outlet />
      </main>

      <CustomerFooter />
    </div>
  );
}

export default CustomerLayout;