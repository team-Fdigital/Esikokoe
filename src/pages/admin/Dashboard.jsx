// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getVentesStats, getProduitsDashboardMetrics, getAllClients, getCriticalStocks, getAllVentes } from '../../apiClient';
import StatCard from '../../components/admin/StatCard';
import AlertCard from '../../components/admin/AlertCard';
import RecentSalesTable from '../../components/admin/RecentSalesTable';
import Loader from '../../components/ui/Loader';
import { Box, ShoppingCart, BarChart2, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ventes: null, stock: null, clients: null });
  const [alertes, setAlertes] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getVentesStats(),
      getProduitsDashboardMetrics(),
      getAllClients(),
      getCriticalStocks(),
      getAllVentes()
    ]).then(([ventesRes, stockRes, clientsRes, alertesRes, ventesListRes]) => {
      setStats({
        ventes: ventesRes.data,
        stock: stockRes.data,
        clients: clientsRes.data,
      });
      setAlertes((alertesRes.data.produitsEnAlerte || []).map(
        p => `Stock faible : ${p.nomProduit} (${p.stockActuel} unités restantes)`
      ));
      setRecentSales(
        (ventesListRes.data.ventes || []).slice(0, 5).map(v => ({
          client: v.numeroFacture,
          product: v.client,
          date: new Date(v.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
          amount: v.montant?.toLocaleString() + ' FCFA',
        }))
      );
    }).finally(() => setLoading(false));
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
          value={stats.ventes?.montantTotal?.toLocaleString() + ' FCFA' || '-'}
          trend={stats.ventes ? `${stats.ventes.nombreVentes} ventes` : ''}
          trendUp={true}
          icon={<span className="text-green-600 text-2xl ml-2">$</span>}
        />
        <StatCard
          title="Stock total"
          value={stats.stock?.valeurTotalStock?.toLocaleString() + ' FCFA' || '-'}
          trend={stats.stock ? `${stats.stock.totalProduits} produits` : ''}
          trendUp={true}
          icon={<Box className="text-blue-500 text-2xl ml-2" />}
        />
        <StatCard
          title="Commandes"
          value={stats.ventes?.nombreVentes || '-'}
          trend={stats.ventes ? `Moyenne: ${stats.ventes.montantMoyen?.toLocaleString()} FCFA` : ''}
          trendUp={true}
          icon={<ShoppingCart className="text-purple-600 text-2xl ml-2" />}
        />
        <StatCard
          title="Clients actifs"
          value={stats.clients?.total || '-'}
          trend={stats.clients ? `${stats.clients.total} clients` : ''}
          trendUp={true}
          icon={<Users className="text-orange-500 text-2xl ml-2" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alertes et Notifications */}
        <AlertCard
          title="Alertes et Notifications"
          alerts={alertes.length > 0 ? alertes : ["Aucune alerte"]}
        />
        {/* Ventes récentes */}
        <RecentSalesTable
          title="Ventes Récentes"
          subtitle="Dernières transactions effectuées"
          sales={recentSales}
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