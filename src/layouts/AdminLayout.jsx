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
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b px-4 h-14 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800">Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <Menu size={20} />
        </button>
      </div>

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