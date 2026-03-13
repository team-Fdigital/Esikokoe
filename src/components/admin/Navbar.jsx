import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8 object-contain" />
        <span className="font-semibold text-gray-900 text-sm md:text-base">
          Intercontinental Eau
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1.5 
                   border border-red-500 text-red-600 
                   bg-white rounded-md 
                   hover:bg-red-50 
                   transition"
      >
        <LogOut size={16} />
        <span className="text-sm font-medium">Déconnexion</span>
      </button>
    </header>
  );
}
