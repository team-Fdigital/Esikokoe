import { TrendingUp, ArrowLeft, Download, BarChart3, Target, PieChart, ArrowUpRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVentesRapport } from "../../../apiClient";
import { useTranslation } from "react-i18next";

export default function SalesReport() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [evolution, setEvolution] = useState([]);

  useEffect(() => {
    getVentesRapport().then(res => {
      const data = res.data;
      setMetrics(data.metrics || null);
      setEvolution(data.evolution || []);
    });
  }, []);

  // ...existing code...
  const handleExportPDF = () => {
    try {
      console.log('Export PDF clicked');
      if (!evolution || evolution.length === 0) {
        alert(t("No_Data_To_Export"));
        return;
      }
      const doc = new jsPDF();
      doc.text(t("Sales_Report_PDF"), 14, 16);
      const tableData = evolution.map(item => [
        item.mois,
        item.nombreCommandes,
        item.nombreClients,
        item.chiffreAffaires?.toLocaleString() + ' FCFA',
        item.isCurrent ? t("Current_Month") : ''
      ]);
      autoTable(doc, {
        head: [[t("Month"), t("Orders"), t("Clients"), t("Turnover"), t("Status")]],
        body: tableData,
        startY: 22,
      });
      doc.save('rapport_ventes.pdf');
    } catch (err) {
      console.error('Erreur export PDF:', err);
      alert(t("Error_PDF_Export"));
    }
  };

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

              <TrendingUp className="text-orange-500 dark:text-orange-400" size={24} />

              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {t("Reports_And_Analysis")}
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <select className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-orange-500/20 font-bold transition-all">
                <option value="Ce mois">{t("This_Month")}</option>
              </select>
              <button 
                className="flex items-center justify-center gap-1 md:gap-2 border dark:border-slate-700 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-bold shadow-sm" 
                onClick={handleExportPDF}
              >
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
          <Link
            to="/admin/rapports/sales"
            className="px-4 md:px-6 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-xs md:text-sm font-bold text-orange-600 dark:text-orange-400 border dark:border-slate-700 transition-all"
          >
            {t("Sales")}
          </Link>
          <Link
            to="/admin/rapports/products"
            className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t("Products")}
          </Link>
          <Link
            to="/admin/rapports/clients"
            className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t("Clients")}
          </Link>
          <Link
            to="/admin/rapports/financial"
            className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t("Financial")}
          </Link>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics && [
            {
              title: t("Monthly_Turnover"),
              value: metrics.caduMois?.toLocaleString() + " FCFA",
              trend: `${metrics.variationCA > 0 ? "+" : ""}${metrics.variationCA}% ${t("Vs_Last_Month")}`,
              icon: <BarChart3 className="text-blue-500" size={28} />
            },
            {
              title: t("Orders"),
              value: metrics.commandes,
              trend: `${metrics.variationCommandes > 0 ? "+" : ""}${metrics.variationCommandes}% ${t("Vs_Last_Month")}`,
              icon: <Target className="text-green-600" size={28} />
            },
            {
              title: t("Average_Basket"),
              value: metrics.panierMoyen?.toLocaleString() + " FCFA",
              trend: `${metrics.variationPanierMoyen > 0 ? "+" : ""}${metrics.variationPanierMoyen}% ${t("Vs_Last_Month")}`,
              icon: <PieChart className="text-purple-600" size={28} />
            },
            {
              title: t("Growth_Rate"),
              value: `${metrics.tauxCroissance}%`,
              trend: `${t("Objective")} ${metrics.objectifCroissance}%`,
              icon: <ArrowUpRight className="text-orange-500" size={28} />
            }
          ].map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* EVOLUTION SECTION */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
          <div className="p-6 md:p-8 border-b dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{t("Sales_Evolution")}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{t("Comparison_Last_3_Months")}</p>
          </div>

          <div className="p-6 md:p-8 space-y-4 md:space-y-5">
            {evolution.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 p-4 md:p-6 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm text-orange-500 dark:text-orange-400 font-black text-xs">
                    {item.mois.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors uppercase tracking-tight">{item.mois}</h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium">
                      <span className="text-gray-900 dark:text-slate-200">{item.nombreCommandes}</span> {t("Orders_Lower")} • <span className="text-gray-900 dark:text-slate-200">{item.nombreClients}</span> {t("Clients_Lower")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="block font-black text-gray-900 dark:text-white text-lg">{item.chiffreAffaires?.toLocaleString()} FCFA</span>
                    {item.isCurrent && (
                      <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-[10px] font-black bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 uppercase tracking-wider">
                        {t("Current_Month")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon }) {
  const isPositive = trend.includes("+");

  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
          {icon}
        </div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${isPositive ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}>
          {trend}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}
