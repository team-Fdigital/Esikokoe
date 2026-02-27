import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";
import { Outlet, useLocation } from "react-router-dom";


export default function AdminLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/admin" || location.pathname === "/admin/";

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      {isDashboard && <Navbar />}
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="p-8 space-y-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
// End of file