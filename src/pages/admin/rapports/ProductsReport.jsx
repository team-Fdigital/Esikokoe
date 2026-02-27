import { Package, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductsReport() {
  const topProducts = [
    { rank: 1, name: "Eau Pure - Sachet 500ml", units: "5350 unités vendues", amount: "401 000 FCFA", percentage: "27.7% du CA" },
    { rank: 2, name: "Eau Pure - Bouteille 1.5L", units: "2340 unités vendues", amount: "351 000 FCFA", percentage: "25.2% du CA" },
    { rank: 3, name: "Eau Minérale - Bouteille 500ml", units: "3200 unités vendues", amount: "320 000 FCFA", percentage: "23.0% du CA" },
    { rank: 4, name: "Eau Gazeuse - Bouteille 330ml", units: "1180 unités vendues", amount: "236 000 FCFA", percentage: "16.9% du CA" },
  ];

  const categories = [
    { name: "Sachets", percentage: 65 },
    { name: "Bouteilles", percentage: 35 },
  ];

  const stockRotation = [
    { label: "Rotation moyenne", value: "8.5 fois/mois" },
    { label: "Produit le plus rapide", value: "Sachets 500ml" },
    { label: "Stock dormant", value: "2.3%", color: "text-red-600" },
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

              <Package className="text-purple-600" size={24} />

              <h1 className="text-xl font-semibold text-gray-900">
                Rapports et Analyses
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <select className="border rounded-md px-3 py-2 text-sm">
                <option>Ce mois</option>
              </select>
              <button className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-50">
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
            className="px-4 py-2 text-sm font-medium border-b-2 border-white hover:bg-gray-50"
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
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Financier
          </Link>
        </div>

        {/* PRODUITS BEST-SELLERS */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Produits les plus vendus</h2>
            <p className="text-sm text-gray-500 mt-1">Top 4 des ventes du mois</p>
          </div>

          <div className="p-6 space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-600">{product.rank}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.units}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{product.amount}</p>
                  <p className="text-xs text-gray-500">{product.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PERFORMANCE ET ROTATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance par catégorie */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-6">Performance par catégorie</h3>
            <div className="space-y-6">
              {categories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    <span className="text-sm font-bold text-gray-900">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${idx === 0 ? "bg-blue-600" : "bg-green-600"}`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rotation des stocks */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-6">Rotation des stocks</h3>
            <div className="space-y-6">
              {stockRotation.map((item, idx) => (
                <div key={idx}>
                  <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color || "text-gray-900"}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}