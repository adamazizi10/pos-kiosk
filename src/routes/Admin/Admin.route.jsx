import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";

const AdminRoute = () => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminRoute;
