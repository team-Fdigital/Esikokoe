import { TrendingUp, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function FinancialReport() {
  const rentabiliteData = [
    { label: "Marge brute", value: "42%" },
    { label: "Marge nette", value: "18%" },
    { label: "ROI", value: "24%" },
  ];

  const tresorerieData = [
    { label: "Entrées", value: "+2,847,500 FCFA", color: "text-green-600" },
    { label: "Sorties", value: "-2,234,800 FCFA", color: "text-red-600" },
    { label: "Solde net", value: "+612,700 FCFA", color: "text-green-600" },
  ];

  const previsions = [
    {
      title: "CA prévu (mois prochain)",
      value: "3,200,000 FCFA",
      trend: "+12% vs ce mois",
      color: "text-blue-600",
    },
    {
      title: "Bénéfice prévu",
      value: "576,000 FCFA",
      trend: "Margin: 18%",
      color: "text-green-600",
    },
    {
      title: "Objectif trimestriel",
      value: "9,000,000 FCFA",
      trend: "Progression: 32%",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <ArrowLeft size={16} />
                Retour
              </Link>

              <TrendingUp className="text-orange-500" size={22} />

              <h1 className="text-xl font-semibold text-gray-900">
                Rapports et Analyses
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <select className="px-3 py-2 border rounded-md text-sm font-medium">
                <option>Ce mois</option>
                <option>Mois dernier</option>
                <option>Trimestre</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-sm font-medium hover:bg-gray-50">
                <Download size={16} />
                Exporter PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* TABS */}
        <div className="flex gap-1 border-b">
          <Link
            to="/admin/rapports/sales"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Ventes
          </Link>
          <Link
            to="/admin/rapports/products"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Produits
          </Link>
          <Link
            to="/admin/rapports/clients"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Clients
          </Link>
          <Link
            to="/admin/rapports/financial"
            className="px-4 py-2 text-sm font-medium border-b-2 border-orange-500 hover:bg-gray-50"
          >
            Financier
          </Link>
        </div>

        {/* RENTABILITÉ & TRÉSORERIE */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Rentabilité */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold mb-6">Rentabilité</h2>
            <div className="space-y-4">
              {rentabiliteData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="text-2xl font-bold text-green-600">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Flux de trésorerie */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold mb-6">Flux de trésorerie</h2>
            <div className="space-y-4">
              {tresorerieData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRÉVISIONS */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-2">Prévisions</h2>
          <p className="text-gray-600 text-sm mb-6">
            Projections basées sur les tendances actuelles
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {previsions.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">{item.title}</p>
                <p className={`text-3xl font-bold ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-sm text-gray-600 mt-2">{item.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}