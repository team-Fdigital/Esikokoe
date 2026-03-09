import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";


export default function AdminLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/admin" || location.pathname === "/admin/";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      {isDashboard && <Navbar />}

      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="p-4 md:p-8 space-y-8 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}