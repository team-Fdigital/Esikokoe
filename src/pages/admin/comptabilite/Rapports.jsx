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
import { getRapports, getDistribution } from "../../../apiClient";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Rapports() {
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
    Recette: ["Ventes"],
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
    const dataRecettes = (distribution?.recettes || []).map(r => ({ Categorie: r.categorie, Montant: r.montant, Type: 'Recette' }));
    const dataDepenses = (distribution?.depenses || []).map(d => ({ Categorie: d.categorie, Montant: d.montant, Type: 'Dépense' }));
    const data = [...dataRecettes, ...dataDepenses];
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Répartition");
    XLSX.writeFile(wb, "rapport_distribution_comptable.xlsx");
  };

  // Export PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text(t("Revenue_Distribution") + " & " + t("Expense_Distribution"), 14, 15);
      
      const body = [
        ... (distribution?.recettes || []).map(r => [r.categorie, `${r.montant} FCFA`, t("Revenue")]),
        ... (distribution?.depenses || []).map(d => [d.categorie, `${d.montant} FCFA`, t("Expense")])
      ];

      autoTable(doc, {
        head: [[t("Category"), t("Amount"), t("Type")]],
        body: body,
        startY: 20,
      });
      doc.save("rapport_distribution_comptable.pdf");
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
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Stat
            label={t("Total_Revenues")}
            value={
              distribution && Array.isArray(distribution.recettes)
                ? distribution.recettes.reduce((sum, item) => sum + Number(item.montant), 0).toLocaleString() + ' FCFA'
                : '0 FCFA'
            }
            colorClass="text-green-600 dark:text-green-400"
            icon={<TrendingUp className="text-green-600 dark:text-green-400 w-5 h-5 md:w-6 md:h-6" />}
          />
          <Stat
            label={t("Total_Expenses")}
            value={
              distribution && Array.isArray(distribution.depenses)
                ? distribution.depenses.reduce((sum, item) => sum + Number(item.montant), 0).toLocaleString() + ' FCFA'
                : '0 FCFA'
            }
            colorClass="text-red-600 dark:text-red-400"
            icon={<TrendingDown className="text-red-600 dark:text-red-400 w-5 h-5 md:w-6 md:h-6" />}
          />
          <Stat
            label={t("Net_Profit")}
            value={(() => {
              const recettes = distribution && Array.isArray(distribution.recettes)
                ? distribution.recettes.reduce((sum, item) => sum + Number(item.montant), 0)
                : 0;
              const depenses = distribution && Array.isArray(distribution.depenses)
                ? distribution.depenses.reduce((sum, item) => sum + Number(item.montant), 0)
                : 0;
              const benefice = recettes - depenses;
              return benefice.toLocaleString() + ' FCFA';
            })()}
            colorClass={(() => {
              const recettes = distribution && Array.isArray(distribution.recettes)
                ? distribution.recettes.reduce((sum, item) => sum + Number(item.montant), 0)
                : 0;
              const depenses = distribution && Array.isArray(distribution.depenses)
                ? distribution.depenses.reduce((sum, item) => sum + Number(item.montant), 0)
                : 0;
              return recettes - depenses >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
            })()}
            icon={<DollarSign className={"w-5 h-5 md:w-6 md:h-6 " + (() => {
              const recettes = distribution && Array.isArray(distribution.recettes)
                ? distribution.recettes.reduce((sum, item) => sum + Number(item.montant), 0)
                : 0;
              const depenses = distribution && Array.isArray(distribution.depenses)
                ? distribution.depenses.reduce((sum, item) => sum + Number(item.montant), 0)
                : 0;
              return (recettes - depenses >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400");
            })()} />}
          />
        </div>

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
            className="px-4 md:px-6 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400 border dark:border-slate-700 transition-all"
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

        {/* REPORT CARDS */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* RECETTES */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-4 md:p-6 space-y-4 md:space-y-6 shadow-sm transition-colors">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-purple-600 dark:text-purple-400 w-4 h-4 md:w-5 md:h-5" />
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{t("Revenue_Distribution")}</h2>
            </div>
            <div className="space-y-3">
              {distribution?.recettes && Array.isArray(distribution.recettes)
                ? distribution.recettes.map((item) => (
                  <div key={item.categorie} className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-gray-600 dark:text-slate-400 font-medium">{item.categorie}</span>
                    <span className="text-green-600 dark:text-green-400 font-black">{item.montant.toLocaleString()} FCFA</span>
                  </div>
                ))
                : <div className="text-gray-400 dark:text-slate-600 text-xs md:text-sm italic">{t("No_Data")}</div>}
            </div>
          </div>
          {/* DEPENSES */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-4 md:p-6 space-y-4 md:space-y-6 shadow-sm transition-colors">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-purple-600 dark:text-purple-400 w-4 h-4 md:w-5 md:h-5" />
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{t("Expense_Distribution")}</h2>
            </div>
            <div className="space-y-3">
              {distribution?.depenses && Array.isArray(distribution.depenses)
                ? distribution.depenses.map((item) => (
                  <Row key={item.categorie} label={item.categorie} value={item.montant.toLocaleString() + ' FCFA'} />
                ))
                : <div className="text-gray-400 dark:text-slate-600 text-xs md:text-sm italic">{t("No_Data")}</div>}
            </div>
          </div>
        </div>

        {/* ...existing code... */}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 text-left">
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
                    setFormData({ ...formData, type: e.target.value, categorie: '' });
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

            {/* FOOTER */}
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

/* ---------- SMALL COMPONENTS ---------- */

function Stat({ label, value, colorClass, icon }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-4 md:p-6 flex justify-between items-center shadow-sm transition-all hover:shadow-md">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">{label}</p>
        <p className={`text-lg md:text-2xl font-black ${colorClass}`}>
          {value}
        </p>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
        {icon}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 text-xs md:text-sm">
      <span className="text-gray-600 dark:text-slate-400 font-medium">{label}</span>
      <span className="text-red-600 dark:text-red-400 font-black">{value}</span>
    </div>
  );
}
