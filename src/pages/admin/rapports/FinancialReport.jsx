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
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium hover:bg-gray-100 px-2 md:px-3 py-1.5 md:py-2 rounded-md"
              >
                <ArrowLeft size={16} />
                {t("Back")}
              </Link>

              <TrendingUp className="text-orange-500" size={22} />

              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {t("Reports_And_Analysis")}
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <select className="px-2 md:px-3 py-1.5 md:py-2 border rounded-md text-xs md:text-sm font-medium">
                <option value="Ce mois">{t("This_Month")}</option>
                <option value="Mois dernier">{t("Last_Month")}</option>
                <option value="Trimestre">{t("Quarter")}</option>
              </select>
              <button className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-white border rounded-md text-xs md:text-sm font-medium hover:bg-gray-50">
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
        <div className="flex flex-wrap md:flex-nowrap gap-1 border-b">
          <Link
            to="/admin/rapports/sales"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            {t("Sales")}
          </Link>
          <Link
            to="/admin/rapports/products"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            {t("Products")}
          </Link>
          <Link
            to="/admin/rapports/clients"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            {t("Clients")}
          </Link>
          <Link
            to="/admin/rapports/financial"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium border-b-2 border-orange-500 hover:bg-gray-50"
          >
            {t("Financial")}
          </Link>
        </div>

        {/* RENTABILITÉ & TRÉSORERIE */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Rentabilité */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
            <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">{t("Profitability")}</h2>
            <div className="space-y-3 md:space-y-4">
              {rentabiliteData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="text-lg md:text-2xl font-bold text-green-600">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Flux de trésorerie */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
            <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">{t("Cash_Flow_Report")}</h2>
            <div className="space-y-3 md:space-y-4">
              {tresorerieData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className={`text-lg md:text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRÉVISIONS */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <h2 className="text-lg md:text-2xl font-bold mb-2">{t("Forecasts")}</h2>
          <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6">
            {t("Projections_Based_On_Current_Trends")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {previsions.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-4 md:p-6 text-center sm:text-left">
                <p className="text-xs md:text-sm text-gray-600 mb-2">{item.title}</p>
                <p className={`text-2xl md:text-3xl font-bold ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-2">{item.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
