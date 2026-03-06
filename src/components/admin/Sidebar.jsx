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

export default function Sidebar() {
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
    </aside>
  );
}