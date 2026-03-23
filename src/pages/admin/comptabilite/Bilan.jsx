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
                {t("Back")}
              </Link>

              <ChartColumn className="text-purple-600" size={22} />

              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {t("Accounting_Management")}
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <button 
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="flex items-center justify-center gap-1 md:gap-2 border px-3 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm bg-white text-black hover:bg-gray-50"
                >
                  <Download size={16} />
                  {t("Export")}
                </button>
                {exportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 p-1 space-y-1">
                    <button
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 rounded flex items-center gap-2"
                      onClick={() => { handleExportExcel(); setExportMenuOpen(false); }}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {t("Export_Excel")}
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 rounded flex items-center gap-2"
                      onClick={() => { handleExportPDF(); setExportMenuOpen(false); }}
                    >
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      {t("Export_PDF")}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-1 md:gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-md"
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
        <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-2 bg-gray-100 p-1 md:p-1.5 rounded-md w-fit">
          <Link
            to="/admin/comptabilite/transactions"
            className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {t("Transactions")}
          </Link>
          <Link
            to="/admin/comptabilite/rapports"
            className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {t("Reports")}
          </Link>
          <Link
            to="/admin/comptabilite/bilan"
            className="px-2 md:px-3 py-1.5 bg-white rounded-md shadow text-xs md:text-sm font-semibold"
          >
            {t("Balance_Sheet")}
          </Link>
          <Link
            to="/admin/comptabilite/audit"
            className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {t("Audit")}
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white border rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} />
            <h2 className="text-lg md:text-xl font-semibold">{t("Financial_Balance")}</h2>
          </div>

          <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
            {t("Financial_Situation_Overview")}
          </p>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            {/* ACTIFS */}
            <div>
              <h3 className="text-green-600 font-semibold mb-4">{t("Assets")}</h3>
              <Row label={t("Cash_Flow")} value={(bilan?.actifs?.tresorerie ?? 0) + ' FCFA'} />
              <Row label={t("Stock")} value={(bilan?.actifs?.stock ?? 0) + ' FCFA'} />
              <Row label={t("Customer_Receivables")} value={(bilan?.actifs?.creancesClients ?? 0) + ' FCFA'} />
              <hr className="my-4" />
              <Row label={t("Total_Assets")} value={(bilan?.actifs?.totalActifs ?? 0) + ' FCFA'} bold />
            </div>
            {/* PASSIFS */}
            <div>
              <h3 className="text-red-600 font-semibold mb-4">{t("Liabilities")}</h3>
              <Row label={t("Supplier_Debts")} value={(bilan?.passifs?.dettesFournisseurs ?? 0) + ' FCFA'} />
              <Row label={t("Expenses_To_Pay")} value={(bilan?.passifs?.chargesAPayer ?? 0) + ' FCFA'} />
              <Row label={t("Capital")} value={(bilan?.passifs?.capital ?? 0) + ' FCFA'} />
              <hr className="my-4" />
              <Row label={t("Total_Liabilities")} value={(bilan?.passifs?.totalPassifs ?? 0) + ' FCFA'} bold />
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
                <h2 className="text-lg font-bold">{t("Add_Transaction")}</h2>
                <p className="text-xs text-gray-600 mt-1">
                  {t("Record_New_Entry_Exit")}
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
                  {t("Transaction_Type")}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({ ...formData, type: e.target.value, categorie: "" });
                  }}
                  className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                >
                  <option value="Recette">{t("Revenue")}</option>
                  <option value="Dépense">{t("Expense")}</option>
                </select>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  {t("Category")}
                </label>
                <select
                  value={formData.categorie}
                  onChange={(e) =>
                    setFormData({ ...formData, categorie: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
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
                <label className="block text-xs font-semibold mb-1.5">
                  {t("Description")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("Transaction_Description")}
                  className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 resize-none"
                  rows="2"
                />
              </div>

              {/* Montant */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  {t("Amount_FCFA")}
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
                  {t("Reference_Optional")}
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  placeholder={t("Reference_Example")}
                  className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white flex gap-3 p-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 px-4 py-2 text-sm bg-black hover:bg-gray-800 text-white rounded-lg font-medium"
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

/* ---------- ROW COMPONENT ---------- */

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between py-1 text-xs md:text-sm">
      <span className={bold ? "font-semibold" : ""}>{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}
