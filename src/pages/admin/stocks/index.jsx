import { Link } from "react-router-dom";
import { Package, AlertTriangle, Truck, ArrowDownUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function StocksIndex() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("Inventory")}</h1>
        <p className="text-gray-600">{t("Inventory_Desc")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StockModule 
          icon={<Package className="text-blue-500" size={32} />}
          title={t("Products_Module")}
          description={t("Products_Desc_Module")}
          to="produits"
        />
        <StockModule 
          icon={<Truck className="text-green-600" size={32} />}
          title={t("Movements_Module")}
          description={t("Movements_Desc")}
          to="mouvements"
        />
        <StockModule 
          icon={<ArrowDownUp className="text-emerald-500" size={32} />}
          title={t("Stocking_Module")}
          description={t("Stocking_Desc")}
          to="action"
        />
        <StockModule 
          icon={<AlertTriangle className="text-orange-500" size={32} />}
          title={t("Alerts_Module")}
          description={t("Alerts_Desc")}
          to="alertes"
        />
      </div>
    </div>
  );
}

function StockModule({ icon, title, description, to }) {
  return (
    <Link
      to={to}
      className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
}
