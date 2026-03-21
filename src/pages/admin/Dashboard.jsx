import React, { useEffect, useState } from 'react';
import { getVentesStats, getProduitsDashboardMetrics, getAllClients, getCriticalStocks, getAllVentes, getAllMagasins } from '../../apiClient';
import StatCard from '../../components/admin/StatCard';
import AlertCard from '../../components/admin/AlertCard';
import RecentSalesTable from '../../components/admin/RecentSalesTable';
import Loader from '../../components/ui/Loader';
import { Box, ShoppingCart, BarChart2, Users, TrendingUp } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  const { userRole, userStore } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ventes: null, stock: null, clients: null });
  const [alertes, setAlertes] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [magasins, setMagasins] = useState([]);
  const [selectedMagasin, setSelectedMagasin] = useState("");
  const navigate = useNavigate();

  const isAdmin = userRole === 'SUPERADMIN' || userRole === 'GERANT';

  useEffect(() => {
    if (isAdmin && magasins.length === 0) {
      getAllMagasins().then(res => {
        const fetchMagasins = res.data.magasins || (Array.isArray(res.data) ? res.data : []);
        setMagasins(fetchMagasins);
        if (fetchMagasins.length > 0 && !selectedMagasin) {
          setSelectedMagasin(fetchMagasins[0].idMagasin);
        }
      }).catch(err => console.error("Erreur magasins:", err));
    }
  }, [isAdmin]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [ventesRes, stockRes, clientsRes, alertesRes, ventesListRes] = await Promise.all([
          getVentesStats().catch(err => ({ data: { montantTotal: 0, nombreVentes: 0 } })),
          getProduitsDashboardMetrics(selectedMagasin).catch(err => ({ data: { valeurTotalStock: 0, totalProduits: 0 } })),
          getAllClients().catch(err => ({ data: { total: 0 } })),
          getCriticalStocks().catch(err => ({ data: { produitsEnAlerte: [] } })),
          getAllVentes().catch(err => ({ data: { ventes: [] } }))
        ]);

        setStats({
          ventes: ventesRes.data,
          stock: stockRes.data,
          clients: clientsRes.data,
        });
        
        setAlertes((alertesRes.data.produitsEnAlerte || []).map(
          p => `${t("Low_Stock")} ${p.nomProduit} (${p.stockActuel} ${t("Units_Left")})`
        ));

        setRecentSales(
          (ventesListRes.data.ventes || []).slice(0, 5).map(v => ({
            client: v.numeroFacture || 'N/A',
            product: v.client || t("Passant"),
            date: v.date ? new Date(v.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '-',
            amount: v.montant !== undefined ? `${v.montant.toLocaleString()} FCFA` : '-',
          }))
        );
      } catch (err) {
        console.error("Erreur chargement dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userRole, userStore, selectedMagasin]);

  if (loading && !stats.stock) {
    return <Loader />;
  }

  const allModules = [
    { id: 1, icon: <Box className="text-blue-500" size={20} />, title: t("Inventory"), subtitle: t("Inventory_Desc"), path: "/admin/stocks/produits" },
    { id: 2, icon: <ShoppingCart className="text-green-600" size={20} />, title: t("Sales"), subtitle: t("Sales_Desc"), path: "/admin/ventes/ventes" },
    { id: 3, icon: <BarChart2 className="text-purple-600" size={20} />, title: t("Accounting"), subtitle: t("Accounting_Desc"), path: "/admin/comptabilite/transactions", adminOnly: true },
    { id: 4, icon: <TrendingUp className="text-orange-500" size={20} />, title: t("Reports"), subtitle: t("Reports_Desc"), path: "/admin/rapports/financial", adminOnly: true },
  ];

  const modules = allModules.filter(m => !m.adminOnly || isAdmin);

  return (
    <div className="w-full space-y-8">
      {/* Cards d'accès rapide */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${modules.length} gap-4`}>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isAdmin ? t("Daily_Sales") : t("My_Sales_Daily")}
          value={stats.ventes?.montantTotal !== undefined ? `${stats.ventes.montantTotal.toLocaleString()} FCFA` : '-'}
          trend={stats.ventes ? `${stats.ventes.nombreVentes} ${t("Sales_Count")}` : ''}
          trendUp={true}
          icon={<span className="text-green-600 text-lg ml-1">$</span>}
        />
        <StatCard
          title={isAdmin ? t("Total_Stock") : t("Store_Stock")}
          value={stats.stock?.valeurTotalStock !== undefined ? `${stats.stock.valeurTotalStock.toLocaleString()} FCFA` : '-'}
          trend={stats.stock ? `${stats.stock.totalProduits} ${t("Products_Count")}` : ''}
          trendUp={true}
          icon={<Box className="text-blue-500 text-lg ml-1" size={20} />}
        />
        <StatCard
          title={t("Orders")}
          value={stats.ventes?.nombreVentes || '-'}
          trend={stats.ventes ? `${t("Average")}${stats.ventes.montantMoyen?.toLocaleString()} F` : ''}
          trendUp={true}
          icon={<ShoppingCart className="text-purple-600 text-lg ml-1" size={20} />}
        />
        <StatCard
          title={t("Active_Clients")}
          value={stats.clients?.total || '-'}
          trend={stats.clients ? `${stats.clients.total} ${t("Clients_Count")}` : ''}
          trendUp={true}
          icon={<Users className="text-orange-500 text-lg ml-1" size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alertes et Notifications */}
        <AlertCard
          title={t("Alerts_Notifications")}
          alerts={alertes.length > 0 ? alertes : [t("No_Alerts")]}
        />
        {/* Ventes récentes */}
        <RecentSalesTable
          title={t("Recent_Sales")}
          subtitle={t("Recent_Transactions")}
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
      className="flex flex-col items-center text-center bg-white rounded-xl border shadow-sm p-4 gap-2 min-h-[100px] cursor-pointer hover:shadow-md hover:border-blue-300 transition"
    >
      <div className="flex flex-col items-center gap-2 w-full">
        <div>{icon}</div>
        <div className="font-semibold text-sm leading-tight truncate w-full">{title}</div>
      </div>
      <div className="text-gray-500 text-[11px] truncate w-full opacity-80">{subtitle}</div>
    </div>
  );
}
