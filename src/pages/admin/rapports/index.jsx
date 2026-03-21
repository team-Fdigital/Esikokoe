import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Package, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RapportsIndex() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{t("Reports")}</h1>
        <p className="text-sm md:text-base text-gray-600">{t("Consult_Analysis_Statistics")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <RapportModule
          icon={<TrendingUp className="text-blue-500 w-8 h-8 md:w-10 md:h-10" />}
          title={t("Financial_Report")}
          description={t("Financial_Revenue_Analysis")}
          to="financial"
        />
        <RapportModule
          icon={<ShoppingCart className="text-green-600 w-8 h-8 md:w-10 md:h-10" />}
          title={t("Sales_Report")}
          description={t("Sales_Statistics")}
          to="sales"
        />
        <RapportModule
          icon={<Package className="text-purple-600 w-8 h-8 md:w-10 md:h-10" />}
          title={t("Products_Report")}
          description={t("Products_Analysis")}
          to="products"
        />
        <RapportModule
          icon={<BarChart3 className="text-orange-500 w-8 h-8 md:w-10 md:h-10" />}
          title={t("Clients_Report")}
          description={t("Clients_Statistics")}
          to="clients"
        />
      </div>
    </div>
  );
}

function RapportModule({ icon, title, description, to }) {
  return (
    <Link
      to={to}
      className="bg-white p-4 md:p-6 rounded-lg border shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer"
    >
      <div className="mb-3 md:mb-4">{icon}</div>
      <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{title}</h3>
      <p className="text-xs md:text-sm text-gray-600">{description}</p>
    </Link>
  );
}
