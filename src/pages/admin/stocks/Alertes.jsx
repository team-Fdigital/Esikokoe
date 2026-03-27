import { Package, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCriticalStocks, getAllMagasins } from "../../../apiClient";
import { useTranslation } from "react-i18next";


export default function Alertes() {
  const { t } = useTranslation();
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [magasins, setMagasins] = useState([]);
  const [selectedMagasin, setSelectedMagasin] = useState("");

  useEffect(() => {
    getAllMagasins().then(res => {
      const fetchMagasins = res.data.magasins || (Array.isArray(res.data) ? res.data : []);
      setMagasins(fetchMagasins);
      if (fetchMagasins.length > 0 && !selectedMagasin) {
        setSelectedMagasin(fetchMagasins[0].idMagasin);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedMagasin) return;
    setLoading(true);
    getCriticalStocks(selectedMagasin)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setAlertes(res.data);
        } else if (res.data && Array.isArray(res.data.produitsEnAlerte)) {
          setAlertes(res.data.produitsEnAlerte);
        } else {
          setAlertes([]);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedMagasin]);

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
                {t("Stock_Alerts")}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-6">
        {/* Sélecteur de magasin */}
        {magasins.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="magasin-select" className="font-medium text-gray-700 dark:text-slate-200">Magasin :</label>
            <select
              id="magasin-select"
              className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-700 dark:text-slate-200"
              value={selectedMagasin}
              onChange={e => setSelectedMagasin(e.target.value)}
            >
              {magasins.map(m => (
                <option key={m.idMagasin} value={m.idMagasin}>{m.nom}</option>
              ))}
            </select>
          </div>
        )}
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
            className="px-3 md:px-4 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-xs md:text-sm font-bold border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 relative"
          >
            {t("Alerts_Tab")}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs font-bold shadow-lg shadow-red-500/20">
              {alertes.length}
            </span>
          </Link>
          <Link
            to="/admin/stocks/mouvements"
            className="px-3 md:px-4 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t("Movements_Tab")}
          </Link>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl rounded-tl-none shadow-sm border dark:border-slate-800 transition-colors overflow-hidden">
          <div className="p-6 border-b dark:border-slate-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("Products_In_Alert")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {t("Products_In_Alert_Desc")}
            </p>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-[600px]">
              <thead className="border-b dark:border-slate-800 text-gray-500 dark:text-slate-400 bg-gray-50/50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left py-4 px-4">{t("Code")}</th>
                  <th className="text-left py-4">{t("Product")}</th>
                  <th className="text-left py-4">{t("Format")}</th>
                  <th className="text-left py-4">{t("Current_Stock")}</th>
                  <th className="text-left py-4">{t("Min_Stock")}</th>
                  <th className="text-left py-4">{t("Supplier")}</th>
                  <th className="text-left py-4">{t("Status")}</th>
                </tr>
              </thead>

              <tbody className="divide-y dark:divide-slate-800">
                {alertes.map((p) => (
                  <tr key={p.codeProduit} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{p.codeProduit}</td>
                    <td className="py-4 dark:text-slate-300">{p.nomProduit}</td>
                    <td className="py-4 dark:text-slate-300">{p.format}</td>
                    <td className="py-4 font-bold text-red-600 dark:text-red-400">{p.stock}</td>
                    <td className="py-4 dark:text-slate-300">{p.stockMinimum}</td>
                    <td className="py-4 dark:text-slate-300">{p.fournisseur}</td>
                    <td className="py-4">
                      <span className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold w-fit border border-red-200 dark:border-red-900/40">
                        <AlertTriangle size={14} />
                        {t("Low_Stock_Status")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {alertes.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                {t("No_Alert_Products")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
