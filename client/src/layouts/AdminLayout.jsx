import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;