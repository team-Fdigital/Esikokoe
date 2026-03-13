import {
  ArrowLeft,
  ChartColumn,
  Download,
  Plus,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTransactions, createTransaction, getAllVentes, getAllFactures, getFactureById } from "../../../apiClient";

export default function Transactions() {
  const [showModal, setShowModal] = useState(false);
  const [ventes, setVentes] = useState([]);
  const [factures, setFactures] = useState([]);
  const [factureVenteId, setFactureVenteId] = useState("");
  const [formData, setFormData] = useState({
    type: "Recette",
    categorie: "",
    description: "",
    montant: "",
    reference: "",
    venteId: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quand la référence change, si une facture est sélectionnée, récupérer la vente liée
  useEffect(() => {
    if (formData.reference) {
      const facture = factures.find(f => f.id === formData.reference);
      if (facture && facture.venteId) {
        setFactureVenteId(facture.venteId);
        setFormData(fd => ({ ...fd, venteId: facture.venteId }));
      } else {
        setFactureVenteId("");
      }
    } else {
      setFactureVenteId("");
    }
  }, [formData.reference, factures]);

  const categoriesByType = {
    Recette: ["Ventes", "Services", "Autres revenue"],
    Dépense: ["Approvisionnement", "Transport", "Salaires", "Loyer", "Utilities", "Autre"],
  };

  useEffect(() => {
    getTransactions()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTransactions(res.data);
        } else {
          setTransactions([]);
        }
      })
      .finally(() => setLoading(false));

    getAllVentes()
      .then((res) => {
        if (Array.isArray(res.data.ventes)) {
          setVentes(res.data.ventes);
        } else {
          setVentes([]);
        }
      })
      .catch(() => setVentes([]));

    getAllFactures()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setFactures(res.data);
        } else if (Array.isArray(res.data.factures)) {
          setFactures(res.data.factures);
        } else {
          setFactures([]);
        }
      })
      .catch(() => setFactures([]));
  }, []);

  const handleAddTransaction = async () => {
    if (!formData.categorie || !formData.description || !formData.montant) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    try {
      // Conversion du type pour l'API
      const typeTransaction = formData.type === "Recette" ? "RECETTE" : "DEPENSE";
      await createTransaction({
        typeTransaction,
        categorie: formData.categorie,
        description: formData.description,
        montant: Number(formData.montant),
        reference: formData.reference,
        venteId: formData.venteId,
      });
      setShowModal(false);
      setFormData({
        type: "Recette",
        categorie: "",
        description: "",
        montant: "",
        reference: "",
        venteId: "",
      });
      setLoading(true);
      getTransactions()
        .then((res) => {
          if (Array.isArray(res.data)) {
            setTransactions(res.data);
          } else {
            setTransactions([]);
          }
        })
        .finally(() => setLoading(false));
    } catch (err) {
      alert("Erreur lors de l'ajout de la transaction" + (err?.response?.data?.message ? (": " + err.response.data.message) : ""));
    }
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
        {/* STATS dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Stat
            label="Recettes totales"
            value={(() => {
              const recettes = transactions.filter(t => t.typeTransaction === "RECETTE").reduce((sum, t) => sum + Number(t.montant), 0);
              return recettes.toLocaleString() + ' FCFA';
            })()}
            color="green"
          />
          <Stat
            label="Dépenses totales"
            value={(() => {
              const depenses = transactions.filter(t => t.typeTransaction === "DEPENSE").reduce((sum, t) => sum + Number(t.montant), 0);
              return depenses.toLocaleString() + ' FCFA';
            })()}
            color="red"
          />
          <Stat
            label="Bénéfice net"
            value={(() => {
              const recettes = transactions.filter(t => t.typeTransaction === "RECETTE").reduce((sum, t) => sum + Number(t.montant), 0);
              const depenses = transactions.filter(t => t.typeTransaction === "DEPENSE").reduce((sum, t) => sum + Number(t.montant), 0);
              const benefice = recettes - depenses;
              return benefice.toLocaleString() + ' FCFA';
            })()}
            color={(() => {
              const recettes = transactions.filter(t => t.typeTransaction === "RECETTE").reduce((sum, t) => sum + Number(t.montant), 0);
              const depenses = transactions.filter(t => t.typeTransaction === "DEPENSE").reduce((sum, t) => sum + Number(t.montant), 0);
              return recettes - depenses >= 0 ? "green" : "red";
            })()}
          />
        </div>

        {/* TABS */}
        <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-2 bg-gray-100 p-1 md:p-1.5 rounded-md w-fit">
          <Link
            to="/admin/comptabilite/transactions"
            className="px-2 md:px-3 py-1.5 bg-white rounded-md shadow text-xs md:text-sm font-semibold"
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
            className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Audit
          </Link>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Journal des transactions
            </h2>
            <p className="text-sm text-gray-500">
              Historique de toutes les entrées et sorties d'argent
            </p>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-[700px]">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Catégorie</th>
                  <th className="text-left">Description</th>
                  <th className="text-left">Référence</th>
                  <th className="text-right">Montant</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ""}</td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${t.typeTransaction === "RECETTE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {t.typeTransaction === "RECETTE" ? "Recette" : "Dépense"}
                      </span>
                    </td>

                    <td>{t.categorie}</td>
                    <td>{t.description}</td>
                    <td>{t.reference}</td>

                    <td
                      className={`text-right font-semibold ${t.typeTransaction === "RECETTE"
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {t.montant} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    setFormData({ ...formData, type: e.target.value, categorie: "" });
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

              {/* Sélection vente (affichée uniquement si aucune facture n'est sélectionnée et aucune facture n'existe) */}
              {!formData.reference && factures.length === 0 && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Vente liée (optionnel)</label>
                  <select
                    value={formData.venteId}
                    onChange={(e) => setFormData({ ...formData, venteId: e.target.value })}
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600"
                  >
                    <option value="">Sélectionner une vente</option>
                    {ventes.map((v) => (
                      <option key={v.idVente || v.id} value={v.idVente || v.id}>
                        {v.numeroFacture ? `${v.numeroFacture} - ${v.nomClient}` : v.idVente || v.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sélection référence facture (optionnelle, uniquement liste déroulante) */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">Référence facture (optionnel)</label>
                <select
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600"
                >
                  <option value="">Aucune</option>
                  {factures.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.numeroFacture ? f.numeroFacture : f.id}
                    </option>
                  ))}
                </select>
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

function Stat({ label, value, color }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <p className="text-sm text-gray-600">{label}</p>
      <p
        className={`text-2xl font-bold ${color === "green" ? "text-green-600" : "text-red-600"
          }`}
      >
        {value}
      </p>
    </div>
  );
}
