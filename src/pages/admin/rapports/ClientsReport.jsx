import { useEffect, useState } from 'react';
import { getAllClients, getClientStats } from '../../../apiClient';
import { Users, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from '../../../components/ui/Loader';

export default function ClientsReport() {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllClients(), getClientStats()])
      .then(([clientsRes, statsRes]) => {
        setClients(clientsRes.data.clients || []);
        setStats(statsRes.data);
      })
      .catch(err => console.error("Erreur chargement rapports clients:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const topClients = [...clients]
    .sort((a, b) => (b.nombreCommandes || 0) - (a.nombreCommandes || 0))
    .slice(0, 4)
    .map((c, idx) => ({
      rank: idx + 1,
      name: c.nomClient,
      orders: `${c.nombreCommandes || 0} commandes`,
      amount: c.totalDepense ? c.totalDepense.toLocaleString() + " FCFA" : "N/A",
      average: c.montantMoyen ? c.montantMoyen.toLocaleString() + " FCFA/commande" : "N/A"
    }));

  const kpis = [
    { label: "Total Clients", value: stats?.totalClients || clients.length || "0", subtext: "Inscrits", color: "text-blue-600" },
    { label: "Dépense Totale", value: (stats?.totalDepense?.toLocaleString() || "0") + " FCFA", subtext: "Cumulé", color: "text-green-600" },
    { label: "Panier Moyen", value: (stats?.montantMoyenParClient?.toLocaleString() || "0") + " FCFA", subtext: "Par client", color: "text-orange-500" },
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
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium hover:bg-gray-100 px-2 md:px-3 py-1.5 md:py-2 rounded-md"
              >
                <ArrowLeft size={16} />
                Retour
              </Link>
              <Users className="text-orange-500" size={24} />
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                Rapports et Analyses
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <select className="border rounded-md px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm">
                <option>Ce mois</option>
              </select>
              <button className="flex items-center gap-1 md:gap-2 border px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm hover:bg-gray-50">
                <Download size={16} />
                <span className="hidden sm:inline">Exporter PDF</span>
                <span className="inline sm:hidden">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
        {/* TABS */}
        <div className="flex flex-wrap md:flex-nowrap gap-1 border-b">
          <Link to="/admin/rapports/sales" className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50">Ventes</Link>
          <Link to="/admin/rapports/products" className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50">Produits</Link>
          <Link to="/admin/rapports/clients" className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium border-b-2 border-orange-500 hover:bg-gray-50">Clients</Link>
          <Link to="/admin/rapports/financial" className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50">Financier</Link>
        </div>

        {/* MEILLEURS CLIENTS */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-lg md:text-xl font-semibold">Meilleurs clients</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Clients classés par nombre de commandes</p>
          </div>

          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            {topClients.length > 0 ? topClients.map((client, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 p-3 md:p-4 border rounded-lg hover:bg-gray-50 text-xs md:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">{client.rank}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500">{client.orders}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right mt-1 sm:mt-0 sm:ml-auto">
                  <p className="font-bold text-gray-900">{client.amount}</p>
                  <p className="text-xs md:text-sm text-gray-500">{client.average}</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-400 py-4">Aucun client trouvé</p>
            )}
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 md:p-8 text-center">
              <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{kpi.label}</p>
              <p className={`text-2xl md:text-4xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3">{kpi.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
