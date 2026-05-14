import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      <AdminSidebar />

      <main className="min-h-screen overflow-x-hidden lg:ml-72">
        <div className="mx-auto w-full max-w-[1600px] overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;