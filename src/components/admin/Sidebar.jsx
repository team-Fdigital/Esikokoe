import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  BarChart2,
  TrendingUp,
  X
} from "lucide-react";

const menu = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/stocks/produits", label: "Gestion des Stocks", icon: Box },
  { to: "/admin/ventes/ventes", label: "Module de Vente", icon: ShoppingCart },
  { to: "/admin/comptabilite/transactions", label: "Comptabilité", icon: BarChart2 },
  { to: "/admin/rapports/financial", label: "Rapports", icon: TrendingUp },
];

export default function Sidebar({ isOpen, setIsOpen }) {
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
        className={`hidden md:flex md:relative z-50 w-56 bg-slate-900 border-r border-slate-800 h-full min-h-screen flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
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
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsOpen?.(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-xs transition ${isActive
                    ? "bg-slate-800 text-blue-400 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}