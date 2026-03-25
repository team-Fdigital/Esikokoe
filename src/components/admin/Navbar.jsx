import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8 object-contain" />
        <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm md:text-base">
          Intercontinental Eau
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1.5 
                   border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400
                   bg-white dark:bg-slate-800 rounded-lg
                   hover:bg-red-50 dark:hover:bg-red-900/20
                   transition-all duration-200 shadow-sm"
      >
        <LogOut size={16} />
        <span className="text-sm font-medium">Déconnexion</span>
      </button>
    </header>
  );
}
