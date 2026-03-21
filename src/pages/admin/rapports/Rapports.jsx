import { ArrowLeft, TrendingUp, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Rapports() {
  const { t } = useTranslation();
  const [periode, setPeriode] = useState("Cette semaine");
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
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

              <TrendingUp className="text-orange-600" size={22} />

              <h1 className="text-lg md:text-xl font-semibold">
                {t("Reports_And_Analysis")}
              </h1>
            </div>

            <button className="flex items-center gap-1 md:gap-2 border px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm hover:bg-white-50">
              <Download size={16} />
              <span className="hidden sm:inline">{t("Export_PDF")}</span>
              <span className="inline sm:hidden">{t("PDF")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
        {/* TABS */}
        <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-2 bg-gray-100 p-1 md:p-1.5 rounded-md w-fit">
          <button className="px-2 md:px-3 py-1.5 bg-white rounded-md shadow text-xs md:text-sm">
            {t("Sales")}
          </button>
          <button className="px-2 md:px-3 py-1.5 text-xs md:text-sm">{t("Products")}</button>
          <button className="px-2 md:px-3 py-1.5 text-xs md:text-sm">{t("Clients")}</button>
          <button className="px-2 md:px-3 py-1.5 text-xs md:text-sm">{t("Financial")}</button>
        </div>

        {/* PERIOD FILTER */}
        <div className="flex justify-between items-center">
          <div></div>
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="border px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm focus:outline-none focus:border-orange-600"
          >
            <option value="Cette semaine">{t("This_Week")}</option>
            <option value="Ce mois">{t("This_Month")}</option>
            <option value="Ce trimestre">{t("This_Quarter")}</option>
            <option value="Cette année">{t("This_Year")}</option>
          </select>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <KPI
            title={t("Monthly_Turnover")}
            value="2,847,500 FCFA"
            sub={`+12.5% ${t("Vs_Last_Month")}`}
          />
          <KPI title={t("Orders")} value="89" sub={`+8.1% ${t("Vs_Last_Month")}`} />
          <KPI title={t("Average_Basket")} value="31,989 FCFA" sub="+4.2%" />
          <KPI title={t("Growth_Rate")} value="12.5%" sub={`${t("Objective")} 10%`} />
        </div>

        {/* SALES EVOLUTION */}
        <div className="bg-white border rounded-lg">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-lg md:text-xl font-semibold">
              {t("Sales_Evolution")}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
              {t("Comparison_Last_3_Months")}
            </p>
          </div>

          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            <Month
              name="Janvier 2024"
              orders="89"
              clients="234"
              amount="2,847,500"
              current
            />
            <Month
              name="Décembre 2023"
              orders="82"
              clients="221"
              amount="2,654,300"
            />
            <Month
              name="Novembre 2023"
              orders="76"
              clients="198"
              amount="2,456,800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function KPI({ title, value, sub }) {
  return (
    <div className="bg-white border rounded-lg p-4 md:p-6">
      <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{title}</p>
      <p className="text-xl md:text-2xl font-bold">{value}</p>
      <p className="text-xs md:text-sm text-green-600 mt-1">{sub}</p>
    </div>
  );
}

function Month({ name, orders, clients, amount, current }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-3 md:p-4 gap-2 md:gap-4 hover:bg-gray-50">
      <div>
        <h4 className="font-semibold text-sm md:text-base">{name}</h4>
        <p className="text-xs md:text-sm text-gray-600">
          {orders} {t("Orders_Lower")} • {clients} {t("Clients_Lower")}
        </p>
      </div>

      <div className="text-left sm:text-right mt-1 sm:mt-0 flex gap-2 items-center sm:block">
        <p className="font-bold text-sm md:text-base">{amount} FCFA</p>
        {current && (
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
            {t("Current_Month")}
          </span>
        )}
      </div>
    </div>
  );
}
