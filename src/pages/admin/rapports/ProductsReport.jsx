import { Package, ArrowLeft, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProduitsRapport } from "../../../apiClient";
import { useTranslation } from "react-i18next";

export default function ProductsReport() {
  const { t } = useTranslation();
  const handleExportPDF = () => {
    try {
      if (!classement || classement.length === 0) {
        alert(t("No_Data_To_Export"));
        return;
      }
      const doc = new jsPDF();
      doc.text(t("Best_Selling_Products_Report"), 14, 16);
      const tableData = classement.map(product => [
        product.nom,
        product.quantite,
        product.ca?.toLocaleString() + ' FCFA',
        product.pourcentageCA + '%'
      ]);
      autoTable(doc, {
        head: [[t("Product"), t("Sold_Quantity"), t("Turnover"), t("Percentage_Turnover")]],
        body: tableData,
        startY: 22,
      });
      doc.save('rapport_produits.pdf');
    } catch (err) {
      console.error('Erreur export PDF:', err);
      alert(t("Error_PDF_Export"));
    }
  };
  const [classement, setClassement] = useState([]);
  const [performanceCategorie, setPerformanceCategorie] = useState({});
  const [rotationStock, setRotationStock] = useState({});

  useEffect(() => {
    getProduitsRapport().then(res => {
      const data = res.data;
      setClassement(data.classement || []);
      setPerformanceCategorie(data.performanceCategorie || {});
      setRotationStock(data.rotationStock || {});
    });
  }, []);

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

              <Package className="text-purple-600 dark:text-purple-400" size={24} />

              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {t("Reports_And_Analysis")}
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <select className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-purple-500/20 font-bold transition-all">
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
            className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t("Sales")}
          </Link>
          <Link
            to="/admin/rapports/products"
            className="px-4 md:px-6 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-xs md:text-sm font-bold text-orange-600 dark:text-orange-400 border dark:border-slate-700 transition-all"
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

        {/* PRODUITS BEST-SELLERS */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
          <div className="p-6 md:p-8 border-b dark:border-slate-800">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{t("Best_Selling_Products")}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{t("Top_4_Sales_Month")}</p>
          </div>

          <div className="p-6 md:p-8 space-y-4 md:space-y-5">
            {classement.slice(0, 4).map((product, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 p-4 md:p-6 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all group">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm font-black text-sm transition-colors ${
                    idx === 0 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" :
                    idx === 1 ? "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400" :
                    idx === 2 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" :
                    "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors uppercase tracking-tight">{product.nom}</h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium">
                      <span className="text-gray-900 dark:text-slate-200">{product.quantite}</span> {t("Units_Sold")}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right self-end sm:self-auto">
                  <p className="font-black text-gray-900 dark:text-white text-lg">{product.ca?.toLocaleString()} FCFA</p>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium lowercase tracking-wide">
                    {product.pourcentageCA}% <span className="uppercase text-[10px] opacity-70">{t("Of_Turnover")}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PERFORMANCE ET ROTATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Performance par catégorie */}
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 transition-colors">
            <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-8 md:mb-10 uppercase tracking-tight">{t("Category_Performance")}</h3>
            <div className="space-y-6 md:space-y-8">
              {Object.entries(performanceCategorie).map(([cat, percent], idx) => (
                <div key={cat} className="group">
                  <div className="flex justify-between items-end mb-2.5">
                    <span className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{cat}</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                        idx === 0 ? "bg-gradient-to-r from-blue-600 to-blue-400" : "bg-gradient-to-r from-emerald-600 to-emerald-400"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rotation des stocks */}
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 transition-colors">
            <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-8 md:mb-10 uppercase tracking-tight">{t("Inventory_Turnover")}</h3>
            <div className="space-y-6 md:space-y-8">
              <div className="p-4 md:p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-transparent dark:border-slate-700/50">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t("Average_Turnover")}</p>
                <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{rotationStock.moyenne ?? '-'} <span className="text-sm text-gray-500 font-medium lowercase italic">{t("Times_Month")}</span></p>
              </div>
              <div className="p-4 md:p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-transparent dark:border-slate-700/50">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t("Fastest_Product")}</p>
                <p className="text-lg md:text-xl font-black text-purple-600 dark:text-purple-400 uppercase tracking-tight">{rotationStock.produitRapide ?? '-'}</p>
              </div>
              <div className="p-4 md:p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-transparent dark:border-slate-700/50">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t("Dormant_Stock")}</p>
                <div className="flex items-center gap-3">
                  <p className={`text-xl md:text-2xl font-black ${rotationStock.stockDormant ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                    {rotationStock.stockDormant ? t("Yes") : t("No")}
                  </p>
                  {rotationStock.stockDormant && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
