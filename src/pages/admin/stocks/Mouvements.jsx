import { Package, ArrowLeft, ArrowDown, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStockHistory } from "../../../apiClient";
import { useTranslation } from "react-i18next";

export default function Mouvements() {
  const { t } = useTranslation();
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStockHistory(100)
      .then((res) => {
        if (res.data && Array.isArray(res.data.mouvements)) {
          setMouvements(res.data.mouvements);
        } else {
          setMouvements([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/stocks"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 px-2 md:px-3 py-1.5 md:py-2 rounded-xl transition-all"
              >
                <ArrowLeft size={16} />
                {t("Back")}
              </Link>
              <Package className="text-blue-600 dark:text-blue-400" size={22} />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("Stock_Movements")}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-6">
        {/* TABS */}
        <div className="flex gap-1">
          <Link
            to="/admin/stocks/produits"
            className="px-3 md:px-4 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t("Inventory_Tab")}
          </Link>
          <Link
            to="/admin/stocks/action"
            className="px-3 md:px-4 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t("Stock_Tab")}
          </Link>
          <Link
            to="/admin/stocks/alertes"
            className="px-3 md:px-4 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors relative"
          >
            {t("Alerts_Tab")}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs font-bold">
              1
            </span>
          </Link>
          <Link
            to="/admin/stocks/mouvements"
            className="px-3 md:px-4 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-xs md:text-sm font-bold border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
          >
            {t("Movements_Tab")}
          </Link>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl rounded-tl-none shadow-sm border dark:border-slate-800 transition-colors overflow-hidden">
          <div className="p-6 border-b dark:border-slate-800 flex flex-col items-center text-center bg-gray-50/30 dark:bg-slate-800/20">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("Movement_History")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                {t("Movement_History_Desc")}
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-[700px]">
              <thead className="border-b dark:border-slate-800 text-gray-500 dark:text-slate-400 bg-gray-50/50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left py-4 px-4">{t("Product")}</th>
                  <th className="text-left py-4">{t("Format")}</th>
                  <th className="text-left py-4">{t("Category")}</th>
                  <th className="text-left py-4">{t("Action")}</th>
                  <th className="text-left py-4">{t("Quantity")}</th>
                  <th className="text-left py-4">{t("Reason")}</th>
                  <th className="text-left py-4">{t("Date")}</th>
                  <th className="text-left py-4">{t("User")}</th>
                </tr>
              </thead>

              <tbody className="divide-y dark:divide-slate-800">
                {mouvements.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{m.produit}</td>
                    <td className="py-4 dark:text-slate-300">{m.format}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${m.produitType === 'Achat' || m.produitType === 'ACHAT' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40'}`}>
                        {m.produitType === 'ACHAT' ? t("Purchase") : m.produitType === 'VENTE' ? t("Sale") : m.produitType || t("Sale")}
                      </span>
                    </td>
                    <td className="py-4">
                      {m.type === "+" ? (
                        <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold w-fit border border-green-200 dark:border-green-900/40">
                          <ArrowDown size={14} />
                          {t("Inbound")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold w-fit border border-red-200 dark:border-red-900/40">
                          <ArrowUp size={14} />
                          {t("Outbound")}
                        </span>
                      )}
                    </td>
                    <td className="py-4 font-bold dark:text-white">{m.quantite}</td>
                    <td className="py-4 text-gray-500 dark:text-slate-400 max-w-[150px] truncate" title={m.motif}>{m.motif || '-'}</td>
                    <td className="py-4 dark:text-slate-400">{m.date ? new Date(m.date).toLocaleDateString() : ''}</td>
                    <td className="py-4 text-gray-600 dark:text-slate-300 font-medium">{m.utilisateur || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {mouvements.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                {t("No_Movements_Recorded")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
