import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  BarChart2,
  TrendingUp,
} from "lucide-react";

const menu = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/stocks/produits", label: "Gestion des Stocks", icon: Box },
  { to: "/admin/ventes/ventes", label: "Module de Vente", icon: ShoppingCart },
  { to: "/admin/comptabilite/transactions", label: "Comptabilité", icon: BarChart2 },
  { to: "/admin/rapports/financial", label: "Rapports", icon: TrendingUp },
];

export default function Sidebar() {
  // Récupérer l'email de l'admin connecté (stocké dans le token JWT)
  const [showDropdown, setShowDropdown] = useState(false);
  let email = '';
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      email = payload.email || '';
    }
  } catch (e) {}

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/admin/login";
  };

  const handleAddAdmin = () => {
    window.location.href = "/admin/ajouter-admin";
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <nav className="px-3 space-y-1 flex-1 py-4">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-xs transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t mt-auto text-xs text-gray-400 text-center relative">
        <button
          onClick={() => setShowDropdown((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 rounded hover:bg-gray-100 text-gray-700 font-medium"
        >
          {email ? <span>{email}</span> : <span className="italic">Admin connecté</span>}
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {showDropdown && (
          <div className="absolute left-4 bottom-12 bg-white border rounded shadow-lg z-10 min-w-[180px] text-left">
            <button
              onClick={handleLogout}
              className="border p-2 rounded-md text-gray-800 bg-white"
            >Déconnexion</button>
            <button
              onClick={handleAddAdmin}
              className="border p-2 rounded-md text-gray-800 bg-white"
            >Ajouter un autre admin</button>
          </div>
        )}
      </div>
    </aside>
  );
}