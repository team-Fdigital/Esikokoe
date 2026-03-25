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
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Transactions() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
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
      alert(t("Please_Fill_All_Required_Fields"));
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
      alert(t("Error_Adding_Transaction") + (err?.response?.data?.message ? (": " + err.response.data.message) : ""));
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    const data = transactions.map((t) => ({
      Date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
      Type: t.typeTransaction === "RECETTE" ? "Recette" : "Dépense",
      Catégorie: t.categorie,
      Description: t.description,
      Référence: t.reference || "",
      Montant: t.montant,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions_comptables.xlsx");
  };

  // Export PDF
  const handleExportPDF = () => {
    if (!transactions.length) {
      alert(t("No_Data_To_Export"));
      return;
    }
    try {
      const doc = new jsPDF();
      doc.text(t("Transactions_Journal"), 14, 15);
      autoTable(doc, {
        head: [["Date", "Type", "Catégorie", "Description", "Référence", "Montant"]],
        body: transactions.map((t) => [
          t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
          t.typeTransaction === "RECETTE" ? t("Revenue") : t("Expense"),
          t.categorie || "",
          t.description || "",
          t.reference || "",
          `${t.montant} FCFA`
        ]),
        startY: 20,
      });
      doc.save("transactions_comptables.pdf");
    } catch (err) {
      alert('Erreur export PDF: ' + err.message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/comptabilite"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 px-2 md:px-3 py-1.5 md:py-2 rounded-xl transition-all"
              >
                <ArrowLeft size={16} />
                {t("Back")}
              </Link>

              <ChartColumn className="text-purple-600 dark:text-purple-400" size={22} />

              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {t("Accounting_Management")}
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <button 
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="flex items-center justify-center gap-1 md:gap-2 border dark:border-slate-700 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-bold shadow-sm"
                >
                  <Download size={16} />
                  {t("Export")}
                </button>
                {exportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-2xl z-20 p-2 animate-fade-in">
                    <button
                      className="w-full text-left px-3 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 text-gray-700 dark:text-slate-200 transition-colors"
                      onClick={() => { handleExportExcel(); setExportMenuOpen(false); }}
                    >
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                      {t("Export_Excel")}
                    </button>
                    <button
                      className="w-full text-left px-3 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 text-gray-700 dark:text-slate-200 transition-colors"
                      onClick={() => { handleExportPDF(); setExportMenuOpen(false); }}
                    >
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                      {t("Export_PDF")}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-1 md:gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-lg shadow-purple-500/20 transition-all font-bold"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">{t("New_Transaction")}</span>
                <span className="inline sm:hidden">{t("Transaction")}</span>
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
            label={t("Total_Revenues")}
            value={(() => {
              const recettes = transactions.filter(transaction => transaction.typeTransaction === "RECETTE").reduce((sum, transaction) => sum + Number(transaction.montant), 0);
              return recettes.toLocaleString() + ' FCFA';
            })()}
            color="green"
          />
          <Stat
            label={t("Total_Expenses")}
            value={(() => {
              const depenses = transactions.filter(transaction => transaction.typeTransaction === "DEPENSE").reduce((sum, transaction) => sum + Number(transaction.montant), 0);
              return depenses.toLocaleString() + ' FCFA';
            })()}
            color="red"
          />
          <Stat
            label={t("Net_Profit")}
            value={(() => {
              const recettes = transactions.filter(transaction => transaction.typeTransaction === "RECETTE").reduce((sum, transaction) => sum + Number(transaction.montant), 0);
              const depenses = transactions.filter(transaction => transaction.typeTransaction === "DEPENSE").reduce((sum, transaction) => sum + Number(transaction.montant), 0);
              const benefice = recettes - depenses;
              return benefice.toLocaleString() + ' FCFA';
            })()}
            color={(() => {
              const recettes = transactions.filter(transaction => transaction.typeTransaction === "RECETTE").reduce((sum, transaction) => sum + Number(transaction.montant), 0);
              const depenses = transactions.filter(transaction => transaction.typeTransaction === "DEPENSE").reduce((sum, transaction) => sum + Number(transaction.montant), 0);
              return recettes - depenses >= 0 ? "green" : "red";
            })()}
          />
        </div>

        {/* TABS */}
        <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-2 bg-gray-100 dark:bg-slate-900/50 p-1 md:p-1.5 rounded-xl w-fit border dark:border-slate-800">
          <Link
            to="/admin/comptabilite/transactions"
            className="px-4 md:px-6 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400 border dark:border-slate-700 transition-all"
          >
            {t("Transactions")}
          </Link>
          <Link
            to="/admin/comptabilite/rapports"
            className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t("Reports")}
          </Link>
          <Link
            to="/admin/comptabilite/bilan"
            className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t("Balance_Sheet")}
          </Link>
          <Link
            to="/admin/comptabilite/audit"
            className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t("Audit")}
          </Link>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 transition-colors overflow-hidden">
          <div className="p-6 border-b dark:border-slate-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("Transactions_Journal")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {t("Transactions_History_Desc")}
            </p>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-[700px]">
              <thead className="border-b dark:border-slate-800 text-gray-500 dark:text-slate-400 bg-gray-50/50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left py-4 px-4">{t("Date")}</th>
                  <th className="text-left py-4">{t("Type")}</th>
                  <th className="text-left py-4">{t("Category")}</th>
                  <th className="text-left py-4">{t("Description")}</th>
                  <th className="text-left py-4">{t("Reference")}</th>
                  <th className="text-right py-4 px-4">{t("Amount")}</th>
                </tr>
              </thead>

              <tbody className="divide-y dark:divide-slate-800">
                {transactions.map((transaction, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 text-gray-700 dark:text-slate-300">{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : ""}</td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${transaction.typeTransaction === "RECETTE"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40"
                          }`}
                      >
                        {transaction.typeTransaction === "RECETTE" ? t("Revenue") : t("Expense")}
                      </span>
                    </td>

                    <td className="py-4 font-bold text-gray-800 dark:text-slate-200">{transaction.categorie}</td>
                    <td className="py-4 text-gray-600 dark:text-slate-400 max-w-[200px] truncate" title={transaction.description}>{transaction.description}</td>
                    <td className="py-4 text-gray-500 dark:text-slate-500 font-mono text-[10px]">{transaction.reference}</td>

                    <td
                      className={`py-4 px-4 text-right font-bold ${transaction.typeTransaction === "RECETTE"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                        }`}
                    >
                      {transaction.montant.toLocaleString()} FCFA
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
            {/* HEADER */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 flex justify-between items-center p-6 border-b dark:border-slate-800 z-10 transition-colors">
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">{t("Add_Transaction")}</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {t("Record_New_Entry_Exit")}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <div className="p-6 space-y-4">
              {/* Type de transaction */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5 ml-1">
                  {t("Transaction_Type")}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({ ...formData, type: e.target.value, categorie: "" });
                  }}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none dark:text-slate-100 transition-all font-medium"
                >
                  <option value="Recette">{t("Revenue")}</option>
                  <option value="Dépense">{t("Expense")}</option>
                </select>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5 ml-1">
                  {t("Category")}
                </label>
                <select
                  value={formData.categorie}
                  onChange={(e) =>
                    setFormData({ ...formData, categorie: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none dark:text-slate-100 transition-all font-medium"
                >
                  <option value="">{t("Select_Category")}</option>
                  {categoriesByType[formData.type]?.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5 ml-1">
                  {t("Description")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("Transaction_Description")}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none dark:text-slate-100 transition-all resize-none shadow-sm"
                  rows="2"
                />
              </div>

              {/* Montant */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5 ml-1">
                  {t("Amount_FCFA")}
                </label>
                <input
                  type="number"
                  value={formData.montant}
                  onChange={(e) =>
                    setFormData({ ...formData, montant: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none dark:text-slate-100 transition-all font-bold text-purple-600 dark:text-purple-400 shadow-sm"
                />
              </div>

              {/* Sélection vente */}
              {!formData.reference && factures.length === 0 && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5 ml-1">{t("Linked_Sale_Optional")}</label>
                  <select
                    value={formData.venteId}
                    onChange={(e) => setFormData({ ...formData, venteId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none dark:text-slate-100 transition-all font-medium"
                  >
                    <option value="">{t("Select_Sale")}</option>
                    {ventes.map((v) => (
                      <option key={v.idVente || v.id} value={v.idVente || v.id}>
                        {v.numeroFacture ? `${v.numeroFacture} - ${v.nomClient}` : v.idVente || v.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sélection référence facture */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5 ml-1">{t("Invoice_Reference_Optional")}</label>
                <select
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none dark:text-slate-100 transition-all font-medium"
                >
                  <option value="">{t("None")}</option>
                  {factures.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.numeroFacture ? f.numeroFacture : f.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-6 border-t dark:border-slate-800 transition-colors">
              <button
                onClick={handleAddTransaction}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-bold shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98]"
              >
                {t("Add_Transaction_Button")}
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm transition-all hover:shadow-md">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-black ${color === "green" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
      >
        {value}
      </p>
    </div>
  );
}
