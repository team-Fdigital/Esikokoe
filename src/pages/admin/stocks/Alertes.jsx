import { Package, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCriticalStocks } from "../../../apiClient";
import { useTranslation } from "react-i18next";

export default function Alertes() {
  const { t } = useTranslation();
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCriticalStocks()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setAlertes(res.data);
        } else {
          setAlertes([]);
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
                {t("Stock_Alerts")}
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
            className="px-3 md:px-4 py-2 bg-white rounded-t-md text-xs md:text-sm font-medium text-black hover:bg-gray-50"
          >
            {t("Stock_Tab")}
          </Link>
          <Link
            to="/admin/stocks/alertes"
            className="px-3 md:px-4 py-2 rounded-t-md text-xs md:text-sm font-medium bg-white text-black hover:bg-gray-50 relative border-b-2 border-white"
          >
            {t("Alerts_Tab")}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs font-bold">
              1
            </span>
          </Link>
          <Link
            to="/admin/stocks/mouvements"
            className="px-3 md:px-4 py-2 rounded-t-md text-xs md:text-sm font-medium bg-white text-black hover:bg-gray-50"
          >
            {t("Movements_Tab")}
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              {t("Products_In_Alert")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("Products_In_Alert_Desc")}
            </p>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-[600px]">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="text-left py-3">{t("Code")}</th>
                  <th className="text-left">{t("Product")}</th>
                  <th className="text-left">{t("Format")}</th>
                  <th className="text-left">{t("Current_Stock")}</th>
                  <th className="text-left">{t("Min_Stock")}</th>
                  <th className="text-left">{t("Supplier")}</th>
                  <th className="text-left">{t("Status")}</th>
                </tr>
              </thead>

              <tbody>
                {alertes.map((p) => (
                  <tr key={p.codeProduit} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{p.codeProduit}</td>
                    <td>{p.nomProduit}</td>
                    <td>{p.format}</td>
                    <td className="font-semibold text-red-600">{p.stock}</td>
                    <td>{p.stockMinimum}</td>
                    <td>{p.fournisseur}</td>
                    <td>
                      <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium w-fit">
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
