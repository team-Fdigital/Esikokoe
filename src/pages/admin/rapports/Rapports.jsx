import { ArrowLeft, TrendingUp, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Rapports() {
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
                className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <ArrowLeft size={16} />
                Retour
              </Link>

              <TrendingUp className="text-orange-600" size={22} />

              <h1 className="text-xl font-semibold">
                Rapports et Analyses
              </h1>
            </div>

            <button className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-white-50">
              <Download size={16} />
              Exporter PDF
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* TABS */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-md w-fit">
          <button className="px-3 py-1.5 bg-white rounded-md shadow text-sm">
            Ventes
          </button>
          <button className="px-3 py-1.5 text-sm">Produits</button>
          <button className="px-3 py-1.5 text-sm">Clients</button>
          <button className="px-3 py-1.5 text-sm">Financier</button>
        </div>

        {/* PERIOD FILTER */}
        <div className="flex justify-between items-center">
          <div></div>
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="border px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-600"
          >
            <option>Cette semaine</option>
            <option>Ce mois</option>
            <option>Ce trimestre</option>
            <option>Cette année</option>
          </select>
        </div>

        {/* KPI */}
        <div className="grid md:grid-cols-4 gap-6">
          <KPI
            title="CA du mois"
            value="2,847,500 FCFA"
            sub="+12.5% vs mois dernier"
          />
          <KPI title="Commandes" value="89" sub="+8.1% vs mois dernier" />
          <KPI title="Panier moyen" value="31,989 FCFA" sub="+4.2%" />
          <KPI title="Taux de croissance" value="12.5%" sub="Objectif: 10%" />
        </div>

        {/* SALES EVOLUTION */}
        <div className="bg-white border rounded-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Évolution des ventes
            </h2>
            <p className="text-sm text-gray-500">
              Comparaison sur les 3 derniers mois
            </p>
          </div>

          <div className="p-6 space-y-4">
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
    <div className="bg-white border rounded-lg p-6">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-green-600">{sub}</p>
    </div>
  );
}

function Month({ name, orders, clients, amount, current }) {
  return (
    <div className="flex justify-between items-center border rounded-lg p-4">
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-gray-600">
          {orders} commandes • {clients} clients
        </p>
      </div>

      <div className="text-right">
        <p className="font-bold">{amount} FCFA</p>
        {current && (
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
            Mois actuel
          </span>
        )}
      </div>
    </div>
  );
}