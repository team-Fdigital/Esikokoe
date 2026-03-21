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

              <TrendingUp className="text-orange-500" size={24} />

              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {t("Reports_And_Analysis")}
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <select className="border rounded-md px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm">
                <option value="Ce mois">{t("This_Month")}</option>
              </select>
              <button className="flex items-center justify-center gap-1 md:gap-2 border px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm text-gray-800 bg-white hover:bg-gray-50" onClick={handleExportPDF}>
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
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium border-b-2 border-orange-500 text-orange-600 hover:bg-orange-50"
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
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
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
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-lg md:text-xl font-semibold">{t("Sales_Evolution")}</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">{t("Comparison_Last_3_Months")}</p>
          </div>

          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            {evolution.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 p-3 md:p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.mois}</h3>
                  <p className="text-xs md:text-sm text-gray-500">{item.nombreCommandes} {t("Orders_Lower")} • {item.nombreClients} {t("Clients_Lower")}</p>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="font-bold text-gray-900">{item.chiffreAffaires?.toLocaleString()} FCFA</span>
                  {item.isCurrent && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      {t("Current_Month")}
                    </span>
                  )}
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
  const isGreen = trend.includes("+");

  return (
    <div className="bg-white border rounded-lg p-4 md:p-6">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div>
          <p className="text-xs md:text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">{value}</p>
        </div>
        <div className="w-5 h-5 md:w-7 md:h-7">{icon}</div>
      </div>
      <p className={`text-xs md:text-sm font-medium ${isGreen ? "text-green-600" : "text-orange-600"}`}>
        {trend}
      </p>
    </div>
  );
}
