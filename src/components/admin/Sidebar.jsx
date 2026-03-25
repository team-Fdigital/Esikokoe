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
        className={`fixed md:relative z-50 w-full max-w-xs md:w-64 border-r dark:border-slate-800 p-4 text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-900 h-full min-h-screen flex-col transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        ${isOpen ? "block" : "hidden"} md:flex
        top-0 left-0 md:static
        `}
        style={{ maxWidth: '90vw' }}
      >
        {/* Mobile menu header */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-100 dark:border-slate-800">
          <span className="font-bold text-gray-800 dark:text-slate-100">Menu</span>
          <button
            onClick={() => setIsOpen?.(false)}
            className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
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
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm"
                      : "text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
        </nav>

        {/* User email and dropdown */}
        <div className="mt-auto px-4 pb-8" style={{ overflow: 'visible' }}>
          <div className="relative" style={{ overflow: 'visible' }}>
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 border dark:border-slate-700 cursor-pointer transition-all"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span className="truncate max-w-[120px] font-medium text-xs">{userEmail || "Utilisateur"}</span>
              <svg className={`ml-2 w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <>
                {/* Overlay for outside click */}
                <div onClick={() => setDropdownOpen(false)} className="fixed inset-0 z-[9998]" style={{ background: 'transparent' }} />
                <div className="border dark:border-slate-700 p-2 rounded-xl text-gray-800 dark:text-slate-200 bg-white dark:bg-slate-800 shadow-2xl animate-fade-in" style={{ bottom: '110%', left: 0, right: 0, position: 'absolute', zIndex: 9999, minWidth: '180px' }}>
                  <button onClick={() => navigate('/admin/profile')} className="block w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm">{t('Profile') || 'Profil'}</button>
                  <button onClick={() => navigate('/admin/settings')} className="block w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm">{t('Settings') || 'Paramètres'}</button>
                  <div className="h-px bg-gray-100 dark:bg-slate-700 my-1"></div>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-medium">{t('Logout') || 'Déconnexion'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
