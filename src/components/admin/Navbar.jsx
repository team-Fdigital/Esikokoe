import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="h-10 w-10 object-contain" />
        <span className="font-semibold text-gray-800 text-base">
          Intercontinental Eau
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 
                   border border-red-500 text-red-600 
                   bg-white rounded-md 
                   hover:bg-red-50 
                   transition"
      >
        <LogOut size={18} />
        <span className="text-base font-medium">Déconnexion</span>
      </button>
    </header>
  );
}