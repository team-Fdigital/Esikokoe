import { TrendingUp, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFinancialStats } from "../../../apiClient";
import { useTranslation } from "react-i18next";

export default function FinancialReport() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ rentabilite: [], tresorerie: [], previsions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinancialStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  const rentabiliteData = stats.rentabilite || [];
  const tresorerieData = stats.tresorerie || [];
  const previsions = stats.previsions || [];

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

              <TrendingUp className="text-orange-500 dark:text-orange-400" size={22} />

              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {t("Reports_And_Analysis")}
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <select className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-orange-500/20 font-bold transition-all">
                <option value="Ce mois">{t("This_Month")}</option>
                <option value="Mois dernier">{t("Last_Month")}</option>
                <option value="Trimestre">{t("Quarter")}</option>
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
          <Link
            to="/admin/rapports/sales"
            className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
            className="px-4 md:px-6 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-xs md:text-sm font-bold text-orange-600 dark:text-orange-400 border dark:border-slate-700 transition-all"
          >
            {t("Financial")}
          </Link>
        </div>

        {/* RENTABILITÉ & TRÉSORERIE */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Rentabilité */}
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-10 transition-colors">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white mb-6 md:mb-10 uppercase tracking-tight">{t("Profitability")}</h2>
            <div className="space-y-4 md:space-y-6">
              {rentabiliteData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs md:text-sm p-4 md:p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700/50 group transition-all hover:bg-gray-100 dark:hover:bg-slate-800">
                  <span className="text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">{item.label}</span>
                  <span className="text-xl md:text-3xl font-black text-green-600 dark:text-green-400 tracking-tight">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Flux de trésorerie */}
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-10 transition-colors">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white mb-6 md:mb-10 uppercase tracking-tight">{t("Cash_Flow_Report")}</h2>
            <div className="space-y-4 md:space-y-6">
              {tresorerieData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs md:text-sm p-4 md:p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700/50 group transition-all hover:bg-gray-100 dark:hover:bg-slate-800">
                  <span className="text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">{item.label}</span>
                  <span className={`text-xl md:text-3xl font-black tracking-tight ${
                    item.color.includes("red") ? "text-red-600 dark:text-red-400" :
                    item.color.includes("green") ? "text-green-600 dark:text-green-400" :
                    "text-blue-600 dark:text-blue-400"
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRÉVISIONS */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-10 transition-colors">
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t("Forecasts")}</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-2 font-medium">
              {t("Projections_Based_On_Current_Trends")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
            {previsions.map((item, idx) => (
              <div key={idx} className="p-6 md:p-8 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700/50 transition-all hover:bg-gray-100 dark:hover:bg-slate-800 text-center sm:text-left">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">{item.title}</p>
                <p className={`text-2xl md:text-4xl font-black tracking-tight ${
                  item.color.includes("red") ? "text-red-600 dark:text-red-400" :
                  item.color.includes("green") ? "text-green-600 dark:text-green-400" :
                  "text-blue-600 dark:text-blue-400"
                }`}>
                  {item.value}
                </p>
                <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-6 h-px bg-gray-200 dark:bg-slate-700"></span>
                  <p className="text-xs font-bold text-gray-500 dark:text-slate-400 italic lowercase">{item.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
