import { NavLink } from "react-router-dom";
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
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out flex flex-col
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <span className="font-bold text-gray-800">Menu Admin</span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 space-y-1 flex-1 py-4">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-xs transition ${isActive
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
    </>
  );
}