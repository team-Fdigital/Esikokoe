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
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/stocks"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium hover:bg-gray-100 px-2 md:px-3 py-1.5 md:py-2 rounded-md"
              >
                <ArrowLeft size={16} />
                {t("Back")}
              </Link>
              <Package className="text-blue-600" size={22} />
              <h1 className="text-xl font-semibold text-gray-900">
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
            className="px-3 md:px-4 py-2 bg-white rounded-t-md text-xs md:text-sm font-medium text-black hover:bg-gray-50"
          >
            {t("Inventory_Tab")}
          </Link>
          <Link
            to="/admin/stocks/action"
            className="px-3 md:px-4 py-2 rounded-t-md text-xs md:text-sm font-medium bg-white text-black hover:bg-gray-50"
          >
            {t("Stock_Tab")}
          </Link>
          <Link
            to="/admin/stocks/alertes"
            className="px-3 md:px-4 py-2 rounded-t-md text-xs md:text-sm font-medium bg-white text-black hover:bg-gray-50 relative"
          >
            {t("Alerts_Tab")}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs font-bold">
              1
            </span>
          </Link>
          <Link
            to="/admin/stocks/mouvements"
            className="px-3 md:px-4 py-2 rounded-t-md text-xs md:text-sm font-medium bg-white text-black hover:bg-gray-50 border-b-2 border-white"
          >
            {t("Movements_Tab")}
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b flex flex-col items-center text-center">
            <div>
              <h2 className="text-xl font-semibold">
                {t("Movement_History")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("Movement_History_Desc")}
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-[700px]">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="text-left py-3">{t("Product")}</th>
                  <th className="text-left">{t("Format")}</th>
                  <th className="text-left">{t("Category")}</th>
                  <th className="text-left">{t("Action")}</th>
                  <th className="text-left">{t("Quantity")}</th>
                  <th className="text-left">{t("Reason")}</th>
                  <th className="text-left">{t("Date")}</th>
                  <th className="text-left">{t("User")}</th>
                </tr>
              </thead>

              <tbody>
                {mouvements.map((m) => (
                  <tr key={m.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{m.produit}</td>
                    <td>{m.format}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${m.produitType === 'Achat' || m.produitType === 'ACHAT' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                        {m.produitType === 'ACHAT' ? t("Purchase") : m.produitType === 'VENTE' ? t("Sale") : m.produitType || t("Sale")}
                      </span>
                    </td>
                    <td>
                      {m.type === "+" ? (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium w-fit">
                          <ArrowDown size={14} />
                          {t("Inbound")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium w-fit">
                          <ArrowUp size={14} />
                          {t("Outbound")}
                        </span>
                      )}
                    </td>
                    <td className="font-semibold">{m.quantite}</td>
                    <td className="text-gray-500 max-w-[150px] truncate" title={m.motif}>{m.motif || '-'}</td>
                    <td>{m.date ? new Date(m.date).toLocaleDateString() : ''}</td>
                    <td>{m.utilisateur || ''}</td>
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
