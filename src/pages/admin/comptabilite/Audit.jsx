import {
  ArrowLeft,
  ChartColumn,
  Download,
  Plus,
  FileText,
  Calculator,
  BarChart3,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuditStatus, getAuditLogs, getAuditEquilibration, getAuditTrend } from "../../../apiClient";

export default function Audit() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: "Recette",
    categorie: "",
    description: "",
    montant: "",
    reference: "",
  });
  const [auditStatus, setAuditStatus] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditEquil, setAuditEquil] = useState(null);
  const [auditTrend, setAuditTrend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAuditStatus(),
      getAuditLogs(),
      getAuditEquilibration(),
      getAuditTrend(),
    ]).then(([statusRes, logsRes, equilRes, trendRes]) => {
      setAuditStatus(statusRes.data);
      setAuditLogs(logsRes.data);
      setAuditEquil(equilRes.data);
      setAuditTrend(trendRes.data);
    }).finally(() => setLoading(false));
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
      <header className="bg-white border-b shadow-sm">
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

              <ChartColumn className="text-purple-600" size={22} />

              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                Gestion Comptable
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button className="flex items-center justify-center gap-1 md:gap-2 border px-3 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm bg-white text-black hover:bg-gray-50">
                <Download size={16} />
                Exporter
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-1 md:gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-md"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Nouvelle transaction</span>
                <span className="inline sm:hidden">Transaction</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
        {/* TABS */}
        <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-2 bg-gray-100 p-1 md:p-1.5 rounded-md w-fit">
          <Link
            to="/admin/comptabilite/transactions"
            className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Transactions
          </Link>
          <Link
            to="/admin/comptabilite/rapports"
            className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Rapports
          </Link>
          <Link
            to="/admin/comptabilite/bilan"
            className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Bilan
          </Link>
          <Link
            to="/admin/comptabilite/audit"
            className="px-2 md:px-3 py-1.5 bg-white rounded-md shadow text-xs md:text-sm font-semibold"
          >
            Audit
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white border rounded-lg p-4 md:p-6 space-y-4 md:space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText size={20} />
              <h2 className="text-lg md:text-xl font-semibold">Audit et contrôle</h2>
            </div>

            <p className="text-xs md:text-sm text-gray-500">
              Vérification et équilibrage des comptes
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <Stat title="Transactions vérifiées" value={auditStatus?.transactionsVerifiees ?? 0} color="text-green-600" />
            <Stat title="Écarts détectés" value={auditStatus?.ecartsDetectes ?? 0} color="text-yellow-600" />
            <div className="border rounded-lg p-3 md:p-4 text-center">
              <p className="text-xs md:text-sm text-gray-600 mb-2">Statut audit</p>
              <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${auditStatus?.statut === 'Conforme' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {auditStatus?.statut || 'Inconnu'}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-3">
              Actions d'audit disponibles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <Action icon={<FileText size={16} className="w-4 h-4 md:w-5 md:h-5" />} label="Générer rapport d'audit" />
              <Action icon={<Calculator size={16} className="w-4 h-4 md:w-5 md:h-5" />} label="Vérifier équilibrage" />
              <Action icon={<Download size={16} className="w-4 h-4 md:w-5 md:h-5" />} label="Exporter pour expert-comptable" />
              <Action icon={<BarChart3 size={16} className="w-4 h-4 md:w-5 md:h-5" />} label="Analyser tendances" />
            </div>
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
                <p className="text-xs text-gray-600 mt-1">
                  Enregistrez une nouvelle entrée ou sortie d'argent.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
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
                    setFormData({ ...formData, type: e.target.value, categorie: "" });
                  }}
                  className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
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
                  className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
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
                  className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 resize-none"
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
                  className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
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
                  className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 bg-white flex gap-3 p-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 px-4 py-2 text-sm bg-black hover:bg-gray-800 text-white rounded-lg font-medium"
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

/* ---------- COMPONENTS ---------- */

function Stat({ title, value, color }) {
  return (
    <div className="border rounded-lg p-3 md:p-4 text-center">
      <p className="text-xs md:text-sm text-gray-600">{title}</p>
      <p className={`text-lg md:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Action({ icon, label }) {
  return (
    <button className="flex items-center gap-2 border p-2 rounded-md text-xs md:text-sm text-gray-800 bg-white hover:bg-gray-50 text-left">
      {icon}
      {label}
    </button>
  );
}