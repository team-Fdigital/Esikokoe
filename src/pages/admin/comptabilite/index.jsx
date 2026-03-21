import { Link } from "react-router-dom";
import { FileText, BarChart3, TrendingUp, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ComptabiliteIndex() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("Accounting")}</h1>
        <p className="text-gray-600">{t("Manage_Transactions_Analysis")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComptabiliteModule 
          icon={<FileText className="text-blue-500" size={32} />}
          title={t("Transactions")}
          description={t("View_All_Transactions")}
          to="transactions"
        />
        <ComptabiliteModule 
          icon={<BarChart3 className="text-green-600" size={32} />}
          title={t("Balance_Sheet")}
          description={t("Accounting_Balance_Synthesis")}
          to="bilan"
        />
        <ComptabiliteModule 
          icon={<TrendingUp className="text-purple-600" size={32} />}
          title={t("Reports")}
          description={t("Detailed_Accounting_Reports")}
          to="rapports"
        />
        <ComptabiliteModule 
          icon={<Search className="text-orange-500" size={32} />}
          title={t("Audit")}
          description={t("Verifications_Audit")}
          to="audit"
        />
      </div>
    </div>
  );
}

function ComptabiliteModule({ icon, title, description, to }) {
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
