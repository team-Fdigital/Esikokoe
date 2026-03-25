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
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Bilan() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
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
      alert(t("Please_Fill_All_Required_Fields"));
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

  // Export Excel
  const handleExportExcel = () => {
    const data = [
      { Section: t("Assets"), Poste: t("Cash_Flow"), Valeur: bilan?.actifs?.tresorerie },
      { Section: t("Assets"), Poste: t("Stock"), Valeur: bilan?.actifs?.stock },
      { Section: t("Assets"), Poste: t("Customer_Receivables"), Valeur: bilan?.actifs?.creancesClients },
      { Section: t("Assets"), Poste: t("Total_Assets"), Valeur: bilan?.actifs?.totalActifs },
      { Section: "", Poste: "", Valeur: "" },
      { Section: t("Liabilities"), Poste: t("Supplier_Debts"), Valeur: bilan?.passifs?.dettesFournisseurs },
      { Section: t("Liabilities"), Poste: t("Expenses_To_Pay"), Valeur: bilan?.passifs?.chargesAPayer },
      { Section: t("Liabilities"), Poste: t("Capital"), Valeur: bilan?.passifs?.capital },
      { Section: t("Liabilities"), Poste: t("Total_Liabilities"), Valeur: bilan?.passifs?.totalPassifs },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bilan");
    XLSX.writeFile(wb, "bilan_financier.xlsx");
  };

  // Export PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text(t("Financial_Balance"), 14, 15);
      
      const body = [
        [t("Assets"), "", ""],
        ["", t("Cash_Flow"), `${bilan?.actifs?.tresorerie} FCFA`],
        ["", t("Stock"), `${bilan?.actifs?.stock} FCFA`],
        ["", t("Customer_Receivables"), `${bilan?.actifs?.creancesClients} FCFA`],
        ["", t("Total_Assets"), `${bilan?.actifs?.totalActifs} FCFA`],
        ["", "", ""],
        [t("Liabilities"), "", ""],
        ["", t("Supplier_Debts"), `${bilan?.passifs?.dettesFournisseurs} FCFA`],
        ["", t("Expenses_To_Pay"), `${bilan?.passifs?.chargesAPayer} FCFA`],
        ["", t("Capital"), `${bilan?.passifs?.capital} FCFA`],
        ["", t("Total_Liabilities"), `${bilan?.passifs?.totalPassifs} FCFA`],
      ];

      autoTable(doc, {
        head: [[t("Section"), t("Item"), t("Amount")]],
        body: body,
        startY: 20,
      });
      doc.save("bilan_financier.pdf");
    } catch (err) {
      alert('Erreur export PDF: ' + err.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 shadow-sm">
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
        {/* TABS */}
        <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-2 bg-gray-100 dark:bg-slate-900/50 p-1 md:p-1.5 rounded-xl w-fit border dark:border-slate-800">
          <Link
            to="/admin/comptabilite/transactions"
            className="px-4 md:px-6 py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
            className="px-4 md:px-6 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400 border dark:border-slate-700 transition-all"
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

        {/* CARD */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 md:p-10 shadow-sm transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={24} className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white">{t("Financial_Balance")}</h2>
          </div>

          <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 md:mb-12">
            {t("Financial_Situation_Overview")}
          </p>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            {/* ACTIFS */}
            <div className="space-y-6">
              <h3 className="text-green-600 dark:text-green-400 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="w-6 h-px bg-green-200 dark:bg-green-900"></span>
                {t("Assets")}
              </h3>
              <div className="space-y-4">
                <Row label={t("Cash_Flow")} value={(bilan?.actifs?.tresorerie ?? 0).toLocaleString() + ' FCFA'} />
                <Row label={t("Stock")} value={(bilan?.actifs?.stock ?? 0).toLocaleString() + ' FCFA'} />
                <Row label={t("Customer_Receivables")} value={(bilan?.actifs?.creancesClients ?? 0).toLocaleString() + ' FCFA'} />
                <hr className="dark:border-slate-800 border-dashed" />
                <Row label={t("Total_Assets")} value={(bilan?.actifs?.totalActifs ?? 0).toLocaleString() + ' FCFA'} bold colorClass="text-green-600 dark:text-green-400" />
              </div>
            </div>
            {/* PASSIFS */}
            <div className="space-y-6">
              <h3 className="text-red-600 dark:text-red-400 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="w-6 h-px bg-red-200 dark:bg-red-900"></span>
                {t("Liabilities")}
              </h3>
              <div className="space-y-4">
                <Row label={t("Supplier_Debts")} value={(bilan?.passifs?.dettesFournisseurs ?? 0).toLocaleString() + ' FCFA'} />
                <Row label={t("Expenses_To_Pay")} value={(bilan?.passifs?.chargesAPayer ?? 0).toLocaleString() + ' FCFA'} />
                <Row label={t("Capital")} value={(bilan?.passifs?.capital ?? 0).toLocaleString() + ' FCFA'} />
                <hr className="dark:border-slate-800 border-dashed" />
                <Row label={t("Total_Liabilities")} value={(bilan?.passifs?.totalPassifs ?? 0).toLocaleString() + ' FCFA'} bold colorClass="text-red-600 dark:text-red-400" />
              </div>
            </div>
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

              {/* Référence */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5 ml-1">
                  {t("Reference_Optional")}
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  placeholder={t("Reference_Example")}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none dark:text-slate-100 transition-all font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-6 border-t dark:border-slate-800 transition-colors">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl py-3 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleAddTransaction}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-bold shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98]"
                >
                  {t("Add_Transaction_Button")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- ROW COMPONENT ---------- */

function Row({ label, value, bold, colorClass }) {
  return (
    <div className={`flex justify-between items-center py-2 text-sm ${bold ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-slate-400"}`}>
      <span className={bold ? "font-black uppercase tracking-wider text-[10px]" : "font-medium"}>{label}</span>
      <span className={bold ? `font-black text-lg ${colorClass}` : "font-bold text-gray-800 dark:text-slate-200"}>{value}</span>
    </div>
  );
}
