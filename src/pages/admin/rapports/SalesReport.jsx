import { TrendingUp, ArrowLeft, Download, BarChart3, Target, PieChart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SalesReport() {
  const stats = [
    { 
      title: "CA du mois", 
      value: "2,847,500 FCFA", 
      trend: "+12.5% vs mois dernier",
      icon: <BarChart3 className="text-blue-500" size={28} />
    },
    { 
      title: "Commandes", 
      value: "89", 
      trend: "+8.1% vs mois dernier",
      icon: <Target className="text-green-600" size={28} />
    },
    { 
      title: "Panier moyen", 
      value: "31,989 FCFA", 
      trend: "+4.2% vs mois dernier",
      icon: <PieChart className="text-purple-600" size={28} />
    },
    { 
      title: "Taux de croissance", 
      value: "12.5%", 
      trend: "Objectif: 10%",
      icon: <ArrowUpRight className="text-orange-500" size={28} />
    },
  ];

  const evolutionData = [
    { month: "Janvier 2024", amount: "2 847 500 FCFA", status: "Mois actuel", current: true },
    { month: "Décembre 2023", amount: "2 654 300 FCFA", status: "" },
    { month: "Novembre 2023", amount: "2 543 100 FCFA", status: "" },
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

              <TrendingUp className="text-orange-500" size={24} />

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
            className="px-4 py-2 text-sm font-medium border-b-2 border-white hover:bg-gray-50"
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
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Financier
          </Link>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* EVOLUTION SECTION */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Évolution des ventes</h2>
            <p className="text-sm text-gray-500 mt-1">Comparaison sur les 3 derniers mois</p>
          </div>

          <div className="p-6 space-y-4">
            {evolutionData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.month}</h3>
                  <p className="text-xs text-gray-500">{item.amount.split(" ")[0]} commandes • {item.amount.split(" ")[1]} clients</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">{item.amount}</span>
                  {item.current && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon }) {
  const isGreen = trend.includes("+");
  
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {icon}
      </div>
      <p className={`text-sm font-medium ${isGreen ? "text-green-600" : "text-orange-600"}`}>
        {trend}
      </p>
    </div>
  );
}