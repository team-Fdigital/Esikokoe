// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import AlertCard from '../../components/admin/AlertCard';
import RecentSalesTable from '../../components/admin/RecentSalesTable';
import Loader from '../../components/ui/Loader';
import { Box, ShoppingCart, BarChart2, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const modules = [
    { id: 1, icon: <Box className="text-blue-500" size={28} />, title: "Gestion des Stocks", subtitle: "Inventaire et approvisionnement", path: "/admin/stocks/produits" },
    { id: 2, icon: <ShoppingCart className="text-green-600" size={28} />, title: "Module de Vente", subtitle: "Factures et commandes", path: "/admin/ventes/ventes" },
    { id: 3, icon: <BarChart2 className="text-purple-600" size={28} />, title: "Comptabilité", subtitle: "Finances et rapports", path: "/admin/comptabilite/transactions" },
    { id: 4, icon: <TrendingUp className="text-orange-500" size={28} />, title: "Rapports", subtitle: "Analyses et statistiques", path: "/admin/rapports/financial" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Cards d'accès rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => (
          <QuickAccessCard 
            key={module.id} 
            icon={module.icon} 
            title={module.title} 
            subtitle={module.subtitle}
            onClick={() => navigate(module.path)}
          />
        ))}
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventes du jour"
          value="2,847,500 FCFA"
          trend="+12.5% vs hier"
          trendUp={true}
          icon={<span className="text-green-600 text-2xl ml-2">$</span>}
        />
        <StatCard 
          title="Stock total"
          value="15,420 unités"
          trend="-2.3% vs hier"
          trendUp={false}
          icon={<Box className="text-blue-500 text-2xl ml-2" />}
        />
        <StatCard 
          title="Commandes"
          value="89"
          trend="+8.1% vs hier"
          trendUp={true}
          icon={<ShoppingCart className="text-purple-600 text-2xl ml-2" />}
        />
        <StatCard 
          title="Clients actifs"
          value="234"
          trend="+5.2% vs hier"
          trendUp={true}
          icon={<Users className="text-orange-500 text-2xl ml-2" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alertes et Notifications */}
        <AlertCard 
          title="Alertes et Notifications"
          alerts={[
            'Stock faible : Bouteilles 1.5L (45 unités restantes)',
            'Livraison prévue demain : 500 sachets 500ml',
          ]}
        />
        {/* Ventes récentes */}
        <RecentSalesTable 
          title="Ventes Récentes"
          subtitle="Dernières transactions effectuées"
          sales={[
            { client: 'F-2024-089', product: 'Restaurant Le Palmier', date: 'Il y a 15 min', amount: '125,000' },
          ]}
        />
      </div>
    </div>
  );
}

function QuickAccessCard({ icon, title, subtitle, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-start bg-white rounded-xl border shadow-sm p-6 gap-3 min-h-[120px] cursor-pointer hover:shadow-md hover:border-blue-300 transition"
    >
      <div className="flex items-center gap-3">
        <div>{icon}</div>
        <div className="font-semibold text-sm leading-tight">{title}</div>
      </div>
      <div className="text-gray-500 text-xs">{subtitle}</div>
    </div>
  );
}