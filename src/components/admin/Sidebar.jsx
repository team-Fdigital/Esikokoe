import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  BarChart2,
  TrendingUp,
  X,
  Store,
  Users
} from "lucide-react";

const getMenu = (t) => [
  { to: "/admin", label: t('Dashboard') || "Tableau de bord", icon: LayoutDashboard, end: true, roles: ['SUPERADMIN', 'GERANT', 'VENDEUR', 'MAGASINIER', 'RESPONSABLE_ACHAT'] },
  { to: "/admin/magasins", label: t('Stores') || "Magasins", icon: Store, roles: ['SUPERADMIN'] },
  { to: "/admin/utilisateurs", label: t('Users') || "Utilisateurs", icon: Users, roles: ['SUPERADMIN', 'GERANT'] },
  { to: "/admin/stocks/produits", label: t('Inventory') || "Gestion des Stocks", icon: Box, roles: ['SUPERADMIN', 'GERANT', 'MAGASINIER'] },
  { to: "/admin/ventes/ventes", label: t('Sales') || "Module de Vente", icon: ShoppingCart, roles: ['SUPERADMIN', 'GERANT', 'VENDEUR'] },
  { to: "/admin/comptabilite/transactions", label: t('Accounting') || "Comptabilité", icon: BarChart2, roles: ['SUPERADMIN', 'GERANT'] },
  { to: "/admin/rapports/financial", label: t('Reports') || "Rapports", icon: TrendingUp, roles: ['SUPERADMIN', 'GERANT'] },
];

export default function Sidebar({ isOpen, setIsOpen, userEmail, userRole }) {
  const { t } = useTranslation();
  const menu = getMenu(t);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("mockRole");
    localStorage.removeItem("mockStore");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative z-50 w-full max-w-xs md:w-64 border p-4 rounded-md text-gray-800 bg-white h-full min-h-screen flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        ${isOpen ? "block" : "hidden"} md:flex
        top-0 left-0 md:static
        `}
        style={{ maxWidth: '90vw' }}
      >
        {/* Mobile menu header */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-slate-800">
          <span className="font-bold text-white">Menu</span>
          <button
            onClick={() => setIsOpen?.(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 space-y-1 flex-1 overflow-y-auto py-4">
          {menu
            .filter((item) => !item.roles || item.roles.includes(userRole?.toUpperCase() || 'SUPERADMIN'))
            .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsOpen?.(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-xs transition ${isActive
                    ? "bg-gray-100 text-blue-600 font-medium"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User email and dropdown */}
        <div className="mt-auto px-4 pb-8" style={{overflow:'visible'}}>
          <div className="relative" style={{overflow:'visible'}}>
            <button
              className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 border cursor-pointer"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span className="truncate max-w-[120px]">{userEmail || "Utilisateur"}</span>
              <svg className={`ml-2 w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <>
                {/* Overlay for outside click */}
                <div onClick={()=>setDropdownOpen(false)} className="fixed inset-0 z-[9998]" style={{background:'transparent'}} />
                <div className="border p-2 rounded-md text-gray-800 bg-white animate-fade-in" style={{bottom:'100%', left:0, right:0, position:'absolute', zIndex:9999, minWidth:'180px', boxShadow:'0 4px 16px rgba(0,0,0,0.08)'}}>
                  <button onClick={() => navigate('/admin/profile')} className="block w-full text-left px-4 py-2 bg-white hover:bg-gray-100">{t('Profile') || 'Profil'}</button>
                  <button onClick={() => navigate('/admin/settings')} className="block w-full text-left px-4 py-2 bg-white hover:bg-gray-100">{t('Settings') || 'Paramètres'}</button>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 bg-white text-red-600 hover:bg-gray-100">{t('Logout') || 'Déconnexion'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
