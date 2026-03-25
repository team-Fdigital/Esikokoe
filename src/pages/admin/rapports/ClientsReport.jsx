import { useEffect, useState } from 'react';
import { getAllClients, getClientStats } from '../../../apiClient';
import { Users, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from '../../../components/ui/Loader';
import { useTranslation } from "react-i18next";

export default function ClientsReport() {
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllClients(), getClientStats()])
      .then(([clientsRes, statsRes]) => {
        setClients(clientsRes.data.clients || []);
        setStats(statsRes.data);
      })
      .catch(err => console.error("Erreur chargement rapports clients:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  // Fusionner les clients ayant le même nom pour le classement
  const groupedClients = Object.values(
    clients.reduce((acc, curr) => {
      const name = (curr.nomClient || '').trim().toUpperCase();
      if (!acc[name]) {
        acc[name] = { ...curr, nomClient: curr.nomClient || 'Inconnu', nombreCommandes: 0, totalDepense: 0 };
      }
      acc[name].nombreCommandes += (curr.nombreCommandes || 0);
      acc[name].totalDepense += (curr.totalDepense || 0);
      return acc;
    }, {})
  );

  const topClients = groupedClients
    .sort((a, b) => (b.nombreCommandes || 0) - (a.nombreCommandes || 0))
    .slice(0, 4)
    .map((c, idx) => {
      const avg = c.nombreCommandes > 0 ? Math.round(c.totalDepense / c.nombreCommandes) : 0;
      return {
        rank: idx + 1,
        name: c.nomClient,
        orders: `${c.nombreCommandes || 0} ${t("Orders_Lower")}`,
        amount: c.totalDepense ? c.totalDepense.toLocaleString() + " FCFA" : t("N/A") || "N/A",
        average: avg ? avg.toLocaleString() + ` FCFA/${t("Order_Lower")}` : t("N/A") || "N/A"
      };
    });

  const kpis = [
    { label: t("Total_Clients"), value: stats?.totalClients || clients.length || "0", subtext: t("Registered"), color: "text-blue-600" },
    { label: t("Total_Spent"), value: (stats?.totalDepense?.toLocaleString() || "0") + " FCFA", subtext: t("Accumulated"), color: "text-green-600" },
    { label: t("Average_Basket_Report"), value: (stats?.montantMoyenParClient?.toLocaleString() || "0") + " FCFA", subtext: t("Per_Client"), color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 px-2 md:px-3 py-1.5 md:py-2 rounded-xl transition-all"
              >
                <ArrowLeft size={16} />
                {t("Back")}
              </Link>
              <Users className="text-orange-500 dark:text-orange-400" size={24} />
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {t("Reports_And_Analysis")}
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <select className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-orange-500/20 font-bold transition-all">
                <option value="Ce mois">{t("This_Month")}</option>
              </select>
              <button className="flex items-center justify-center gap-1 md:gap-2 border dark:border-slate-700 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-bold shadow-sm">
                <Download size={16} />
                <span className="hidden sm:inline">{t("Export_PDF")}</span>
                <span className="inline sm:hidden">{t("PDF")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
        {/* TABS */}
        <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-2 bg-gray-100 dark:bg-slate-900/50 p-1 md:p-1.5 rounded-xl w-fit border dark:border-slate-800">
          <Link to="/admin/rapports/sales" className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">{t("Sales")}</Link>
          <Link to="/admin/rapports/products" className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">{t("Products")}</Link>
          <Link to="/admin/rapports/clients" className="px-4 md:px-6 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-xs md:text-sm font-bold text-orange-600 dark:text-orange-400 border dark:border-slate-700 transition-all">{t("Clients")}</Link>
          <Link to="/admin/rapports/financial" className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">{t("Financial")}</Link>
        </div>

        {/* MEILLEURS CLIENTS */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
          <div className="p-6 md:p-8 border-b dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{t("Top_Clients")}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{t("Clients_Ranked_By_Orders")}</p>
          </div>

          <div className="p-6 md:p-8 space-y-4 md:space-y-5">
            {topClients.length > 0 ? topClients.map((client, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 p-4 md:p-6 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all group">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm font-black text-sm transition-colors ${
                    idx === 0 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" :
                    idx === 1 ? "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400" :
                    idx === 2 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" :
                    "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  }`}>
                    {client.rank}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors uppercase tracking-tight">{client.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium">
                      <span className="text-gray-900 dark:text-slate-200 font-bold">{client.orders}</span>
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right self-end sm:self-auto">
                  <p className="font-black text-gray-900 dark:text-white text-lg tracking-tight">{client.amount}</p>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium lowercase tracking-wide italic">
                    {client.average}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-400 dark:text-slate-600 py-8 italic">{t("No_Client_Found")}</p>
            )}
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-10 text-center transition-colors hover:shadow-md">
              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">{kpi.label}</p>
              <p className={`text-2xl md:text-4xl font-black tracking-tight ${
                kpi.color.includes("blue") ? "text-blue-600 dark:text-blue-400" :
                kpi.color.includes("green") ? "text-green-600 dark:text-green-400" :
                "text-orange-600 dark:text-orange-400"
              }`}>{kpi.value}</p>
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mt-3 flex items-center justify-center gap-2">
                <span className="w-4 h-px bg-gray-200 dark:bg-slate-800"></span>
                {kpi.subtext}
                <span className="w-4 h-px bg-gray-200 dark:bg-slate-800"></span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
