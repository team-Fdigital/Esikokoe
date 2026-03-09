import {
  ArrowLeft,
  ChartColumn,
  Download,
  Plus,
  FileText,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBilanSummary } from "../../../apiClient";

export default function Bilan() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: "Recette",
    categorie: "",
    description: "",
    montant: "",
    reference: "",
  });
  const [bilan, setBilan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBilanSummary()
      .then((res) => setBilan(res.data))
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
            className="px-2 md:px-3 py-1.5 bg-white rounded-md shadow text-xs md:text-sm font-semibold"
          >
            Bilan
          </Link>
          <Link
            to="/admin/comptabilite/audit"
            className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Audit
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white border rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} />
            <h2 className="text-lg md:text-xl font-semibold">Bilan financier</h2>
          </div>

          <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
            Vue d'ensemble de la situation financière
          </p>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            {/* ACTIFS */}
            <div>
              <h3 className="text-green-600 font-semibold mb-4">ACTIFS</h3>
              <Row label="Trésorerie" value={(bilan?.actifs?.tresorerie ?? 0) + ' FCFA'} />
              <Row label="Stock" value={(bilan?.actifs?.stock ?? 0) + ' FCFA'} />
              <Row label="Créances clients" value={(bilan?.actifs?.creancesClients ?? 0) + ' FCFA'} />
              <hr className="my-4" />
              <Row label="Total Actifs" value={(bilan?.actifs?.totalActifs ?? 0) + ' FCFA'} bold />
            </div>
            {/* PASSIFS */}
            <div>
              <h3 className="text-red-600 font-semibold mb-4">PASSIFS</h3>
              <Row label="Dettes fournisseurs" value={(bilan?.passifs?.dettesFournisseurs ?? 0) + ' FCFA'} />
              <Row label="Charges à payer" value={(bilan?.passifs?.chargesAPayer ?? 0) + ' FCFA'} />
              <Row label="Capital" value={(bilan?.passifs?.capital ?? 0) + ' FCFA'} />
              <hr className="my-4" />
              <Row label="Total Passifs" value={(bilan?.passifs?.totalPassifs ?? 0) + ' FCFA'} bold />
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

/* ---------- ROW COMPONENT ---------- */

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between py-1 text-xs md:text-sm">
      <span className={bold ? "font-semibold" : ""}>{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}