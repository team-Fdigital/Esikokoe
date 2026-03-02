import {
  ArrowLeft,
  ChartColumn,
  Download,
  Plus,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRapports } from "../../../apiClient";
import { getDistribution } from "../../../apiClient";

export default function Rapports() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: "Recette",
    categorie: "",
    description: "",
    montant: "",
    reference: "",
  });
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distribution, setDistribution] = useState(null);

  useEffect(() => {
    getDistribution()
      .then((res) => setDistribution(res.data))
      .catch(() => setDistribution(null));
  }, []);

  useEffect(() => {
    getRapports()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setRapports(res.data);
        } else {
          setRapports([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const categoriesByType = {
    Recette: ["Ventes", "Services", "Autres revenue"],
    Dépense: ["Approvisionnement", "Transport", "Salaires", "Loyer", "Utilities", "Autre"],
  };

  const handleAddTransaction = () => {
    if (!formData.categorie || !formData.description || !formData.montant) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    console.log("Nouvelle transaction:", formData);
    setShowModal(false);
    setFormData({
      type: "Recette",
      categorie: "",
      description: "",
      montant: "",
      reference: "",
    });
  };
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

              <ChartColumn className="text-purple-600" size={22} />

              <h1 className="text-xl font-semibold text-gray-900">
                Gestion Comptable
              </h1>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm bg-white text-black hover:bg-gray-50">
                <Download size={16} />
                Exporter
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
              >
                <Plus size={16} />
                Nouvelle transaction
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Stat
            label="Recettes totales"
            value="214 500 FCFA"
            color="green"
            icon={<TrendingUp className="text-green-600" />}
          />
          <Stat
            label="Dépenses totales"
            value="655 000 FCFA"
            color="red"
            icon={<TrendingDown className="text-red-600" />}
          />
          <Stat
            label="Bénéfice net"
            value="-440 500 FCFA"
            color="red"
            icon={<DollarSign className="text-red-600" />}
          />
        </div>

        {/* TABS */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-md w-fit">
          <Link
            to="/admin/comptabilite/transactions"
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Transactions
          </Link>
          <Link
            to="/admin/comptabilite/rapports"
            className="px-3 py-1.5 bg-white rounded-md shadow text-sm font-semibold"
          >
            Rapports
          </Link>
          <Link
            to="/admin/comptabilite/bilan"
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Bilan
          </Link>
          <Link
            to="/admin/comptabilite/audit"
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Audit
          </Link>
        </div>

        {/* REPORT CARDS */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* RECETTES */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <h2 className="text-lg font-semibold">Répartition des recettes</h2>
            </div>
            {distribution?.recettes && Array.isArray(distribution.recettes)
              ? distribution.recettes.map((item) => (
                  <div key={item.categorie} className="flex justify-between text-sm">
                    <span>{item.categorie}</span>
                    <span className="text-green-600 font-medium">{item.montant} FCFA</span>
                  </div>
                ))
              : <div className="text-gray-400 text-sm">Aucune donnée</div>}
          </div>
          {/* DEPENSES */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <h2 className="text-lg font-semibold">Répartition des dépenses</h2>
            </div>
            {distribution?.depenses && Array.isArray(distribution.depenses)
              ? distribution.depenses.map((item) => (
                  <Row key={item.categorie} label={item.categorie} value={item.montant + ' FCFA'} />
                ))
              : <div className="text-gray-400 text-sm">Aucune donnée</div>}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-lg font-bold">Ajouter une transaction</h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Enregistrez une nouvelle entrée ou sortie d'argent.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}
            <div className="p-4 space-y-3">
              {/* Type de transaction */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Type de transaction
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({ ...formData, type: e.target.value, categorie: '' });
                  }}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600"
                >
                  <option>Recette</option>
                  <option>Dépense</option>
                </select>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Catégorie
                </label>
                <select
                  value={formData.categorie}
                  onChange={(e) =>
                    setFormData({ ...formData, categorie: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoriesByType[formData.type]?.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description de la transaction"
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 resize-none"
                  rows="2"
                />
              </div>

              {/* Montant */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Montant (FCFA)
                </label>
                <input
                  type="number"
                  value={formData.montant}
                  onChange={(e) =>
                    setFormData({ ...formData, montant: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Référence */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Référence (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  placeholder="Ex: F-2024-001, BON-2024-012"
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 bg-white flex gap-3 p-4 border-t">
             
              <button
                onClick={handleAddTransaction}
                className="flex-1 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium text-sm"
              >
                Ajouter la transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Stat({ label, value, color, icon }) {
  return (
    <div className="bg-white rounded-lg border p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p
          className={`text-2xl font-bold ${
            color === "green" ? "text-green-600" : "text-red-600"
          }`}
        >
          {value}
        </p>
      </div>
      {icon}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span className="text-red-600 font-medium">{value}</span>
    </div>
  );
}