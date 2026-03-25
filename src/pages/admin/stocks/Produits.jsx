import { Package, Plus, Search, Download, Pencil, Trash2, ArrowLeft, X } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllProduits, createProduit } from "../../../apiClient";
import { updateProduit, deleteProduit } from "../../../apiClient";
import { useTranslation } from "react-i18next";

export default function Produits() {
  const { t } = useTranslation();
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t("All_Categories"));
  const [editingProductId, setEditingProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nomProduit: "",
    format: "",
    categorie: "",
    type: "Vente", // 'Achat' ou 'Vente'
    stockInitial: "",
    stockMinimum: "",
    prixUnitaire: "",
    fournisseur: "",
  });
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const categories = ["Sachets", "Bouteilles", "Bidons", "Bonbonnes"];

  useEffect(() => {
    getAllProduits()
      .then((res) => {
        if (res.data && Array.isArray(res.data.produits)) {
          setProduits(res.data.produits);
        } else {
          setProduits([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddProduct = async () => {
    setActionLoading(true);
    // Conversion des champs numériques
    const stockInitial = Number(formData.stockInitial);
    const stockMinimum = Number(formData.stockMinimum);
    const prixUnitaire = Number(formData.prixUnitaire);

    // Validation détaillée
    let errorMsg = "";
    if (!formData.nomProduit.trim()) errorMsg += t("Product_Name_Field");
    if (!formData.format.trim()) errorMsg += t("Format_Field");
    if (!formData.categorie.trim()) errorMsg += t("Category_Field");
    if (formData.stockInitial === "" || isNaN(stockInitial)) errorMsg += t("Initial_Stock_Field");
    if (formData.prixUnitaire === "" || isNaN(prixUnitaire)) errorMsg += t("Unit_Price_Field");

    if (errorMsg) {
      alert(t("Fill_Fields_Correctly") + errorMsg);
      return;
    }

    // Préparer les données à envoyer (Alignement DTO Backend)
    const dataToSend = {
      nomProduit: formData.nomProduit,
      format: formData.format,
      categorie: formData.categorie,
      type: formData.type.toUpperCase(), // Convertir en VENTE ou ACHAT
      stockInitial,
      stockMinimum,
      prixUnitaire,
      fournisseur: formData.fournisseur || null,
    };

    // Validation spécifique pour le fournisseur (Règles métier)
    if (dataToSend.type === 'ACHAT' && !formData.fournisseur.trim()) {
      alert("Le fournisseur est obligatoire pour les produits de type 'Achat'.");
      setActionLoading(false);
      return;
    }

    try {
      await createProduit(dataToSend);
      setShowModal(false);
      setFormData({
        nomProduit: "",
        format: "",
        categorie: "",
        type: "Vente",
        stockInitial: "",
        stockMinimum: "",
        prixUnitaire: "",
        fournisseur: "",
      });
      setLoading(true);
      getAllProduits()
        .then((res) => {
          if (res.data && Array.isArray(res.data.produits)) {
            setProduits(res.data.produits);
          } else {
            setProduits([]);
          }
        })
        .finally(() => setLoading(false));
    } catch (err) {
      let msg = t("Create_Product_Error");
      if (err?.response?.data?.message) {
        msg += " : " + err.response.data.message;
      } else if (err?.message) {
        msg += " : " + err.message;
      }
      alert(msg);
    }
    setActionLoading(false);
  };

  const handleEditProduct = async () => {
    setActionLoading(true);
    const stockInitial = Number(formData.stockInitial);
    const stockMinimum = Number(formData.stockMinimum);
    const prixUnitaire = Number(formData.prixUnitaire);

    let errorMsg = "";
    if (!formData.nomProduit.trim()) errorMsg += t("Product_Name_Field");
    if (!formData.format.trim()) errorMsg += t("Format_Field");
    if (!formData.categorie.trim()) errorMsg += t("Category_Field");
    if (formData.stockInitial === "" || isNaN(stockInitial)) errorMsg += t("Initial_Stock_Field");
    if (formData.prixUnitaire === "" || isNaN(prixUnitaire)) errorMsg += t("Unit_Price_Field");

    if (errorMsg) {
      alert(t("Fill_Fields_Correctly") + errorMsg);
      return;
    }

    // Préparer les données à envoyer (Alignement DTO Backend)
    const dataToSend = {
      nomProduit: formData.nomProduit,
      format: formData.format,
      categorie: formData.categorie,
      type: formData.type.toUpperCase(), // Convertir en VENTE ou ACHAT
      stockInitial,
      stockMinimum,
      prixUnitaire,
      fournisseur: formData.fournisseur || null,
    };

    // Validation spécifique pour le fournisseur (Règles métier)
    if (dataToSend.type === 'ACHAT' && !formData.fournisseur.trim()) {
      alert("Le fournisseur est obligatoire pour les produits de type 'Achat'.");
      setActionLoading(false);
      return;
    }

    try {
      await updateProduit(editingProductId, dataToSend);
      setEditingProductId(null);
      setShowModal(false);
      setFormData({
        nomProduit: "",
        format: "",
        categorie: "",
        type: "Vente",
        stockInitial: "",
        stockMinimum: "",
        prixUnitaire: "",
        fournisseur: "",
      });
      setLoading(true);
      getAllProduits()
        .then((res) => {
          if (res.data && Array.isArray(res.data.produits)) {
            setProduits(res.data.produits);
          } else {
            setProduits([]);
          }
        })
        .finally(() => setLoading(false));
    } catch (err) {
      let msg = t("Edit_Product_Error");
      if (err?.response?.data?.message) {
        msg += " : " + err.response.data.message;
      } else if (err?.message) {
        msg += " : " + err.message;
      }
      alert(msg);
    }
    setActionLoading(false);
  };

  // Catégories dynamiques extraites des produits pour le formulaire
  const formCategories = [
    ...new Set([
      ...produits.map(p => p.categorie && p.categorie.trim()).filter(Boolean),
      ...categories
    ])
  ];

  // Filtrage dynamique
  const filteredProduits = produits.filter((p) => {
    const matchSearch = p.nomProduit?.toLowerCase().includes(searchTerm.toLowerCase()) || p.codeProduit?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === t("All_Categories") || !selectedCategory || (p.categorie && p.categorie.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
    return matchSearch && matchCategory;
  });

  // Export Excel
  const handleExportExcel = () => {
    const data = filteredProduits.map((p) => ({
      Code: p.codeProduit,
      Produit: p.nomProduit,
      Format: p.format,
      Stock: p.stock,
      Statut: p.statut,
      Type: p.type || 'Vente',
      Prix: p.prixUnitaire,
      Fournisseur: p.fournisseur,
      Catégorie: p.categorie,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produits");
    XLSX.writeFile(wb, "produits.xlsx");
  };

  // Export PDF
  const handleExportPDF = () => {
    console.log('Export PDF called');
    if (!filteredProduits.length) {
      alert(t("No_Product_Export"));
      return;
    }
    try {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [["Code", "Produit", "Format", "Stock", "Statut", "Prix", "Fournisseur", "Catégorie"]],
        body: filteredProduits.map((p) => [
          p.codeProduit || "",
          p.nomProduit || "",
          p.format || "",
          p.type || "Vente",
          p.stock !== undefined ? p.stock : "",
          p.statut || "",
          p.prixUnitaire !== undefined ? p.prixUnitaire : "",
          p.fournisseur || "",
          p.categorie || ""
        ]),
        startY: 20,
      });
      doc.save("produits.pdf");
    } catch (err) {
      alert('Erreur export PDF: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800 px-3 py-2 rounded-md text-gray-700 dark:text-slate-300 transition-colors"
              >
                <ArrowLeft size={16} />
                {t("Back")}
              </Link>

              <Package className="text-blue-600 dark:text-blue-500" size={22} />

              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("Inventory")}
              </h1>
            </div>

            <button
              onClick={() => {
                setFormData({
                  nomProduit: "",
                  format: "",
                  categorie: "",
                  type: "Vente",
                  stockInitial: "",
                  stockMinimum: "",
                  prixUnitaire: "",
                  fournisseur: "",
                });
                setEditingProductId(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              <Plus size={16} />
              {t("Add_Product")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENU */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* TABS */}
        <div className="flex gap-2 border-b dark:border-slate-800">
          <Link
            to="/admin/stocks/produits"
            className="px-6 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-sm font-bold border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 transition-colors"
          >
            {t("Inventory_Tab")}
          </Link>
          <Link
            to="/admin/stocks/action"
            className="px-6 py-2 rounded-t-xl text-sm font-medium bg-transparent text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            {t("Stock_Tab")}
          </Link>
          <Link
            to="/admin/stocks/alertes"
            className="px-6 py-2 rounded-t-xl text-sm font-medium bg-transparent text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 relative transition-colors"
          >
            {t("Alerts_Tab")}
            <span className="absolute top-1 right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-red-500/20">
              1
            </span>
          </Link>
          <Link
            to="/admin/stocks/mouvements"
            className="px-6 py-2 rounded-t-xl text-sm font-medium bg-transparent text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            {t("Movements_Tab")}
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 overflow-hidden transition-colors">
          {/* CARD HEADER */}
          <div className="p-6 border-b dark:border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
                  {t("Products_Inventory")}
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {t("Products_Inventory_Desc")}
                </p>
              </div>

              <div className="relative w-full md:w-auto">
                <button
                  className="flex items-center justify-center gap-2 border dark:border-slate-700 px-4 py-2 rounded-xl text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-semibold shadow-sm w-full md:w-auto"
                  onClick={() => setExportMenuOpen((v) => !v)}
                >
                  <Download size={16} />
                  {t("Export")}
                </button>
                {exportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-2xl z-20 p-2 animate-fade-in">
                    <button
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 text-gray-700 dark:text-slate-200 transition-colors"
                      onClick={() => { handleExportExcel(); setExportMenuOpen(false); }}
                    >
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                      {t("Export_Excel")}
                    </button>
                    <button
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 text-gray-700 dark:text-slate-200 transition-colors"
                      onClick={() => { handleExportPDF(); setExportMenuOpen(false); }}
                    >
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                      {t("Export_PDF")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SEARCH */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={t("Search_Product")}
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-100 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-sm w-full sm:w-56 focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-100 transition-all font-medium"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value={t("All_Categories")}>{t("All_Categories")}</option>
                {formCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase tracking-tighter text-[10px] font-bold">
                <tr>
                  <th className="text-left py-4 px-6">{t("Code")}</th>
                  <th className="text-left py-4 px-4">{t("Product")}</th>
                  <th className="text-left py-4 px-4">{t("Format")}</th>
                  <th className="text-left py-4 px-4">{t("Type")}</th>
                  <th className="text-left py-4 px-4">{t("Stock_Tab")}</th>
                  <th className="text-left py-4 px-4">{t("Status")}</th>
                  <th className="text-left py-4 px-4">{t("Price")}</th>
                  <th className="text-left py-4 px-4">{t("Supplier")}</th>
                  <th className="text-left py-4 px-6">{t("Actions")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredProduits.map((p) => (
                  <tr key={p.codeProduit} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-800 dark:text-slate-200">{p.codeProduit}</td>
                    <td className="px-4 text-gray-700 dark:text-slate-300 font-medium">{p.nomProduit}</td>
                    <td className="px-4 text-gray-600 dark:text-slate-400 italic">{p.format}</td>
                    <td className="px-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.type === 'Achat' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50'}`}>
                        {p.type === 'Achat' ? t("Purchase") : p.type === 'Vente' ? t("Sale") : p.type || t("Sale")}
                      </span>
                    </td>
                    <td className="px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">{p.stock}</span>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-bold tracking-tighter">
                          {t("Per_Min")} {p.stockMinimum || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.statut === "En stock" || p.stock > (p.stockMinimum || 0)
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50"
                          }`}
                      >
                        {p.statut === "En stock" || p.stock > (p.stockMinimum || 0)
                          ? t("Good_Stock")
                          : t("Low_Stock_Status")}
                      </span>
                    </td>
                    <td className="px-4 font-bold text-blue-600 dark:text-blue-400">{p.prixUnitaire} F</td>
                    <td className="px-4 text-gray-600 dark:text-slate-400 text-xs">{p.fournisseur || '-'}</td>
                    <td className="px-6">
                      <div className="flex gap-2">
                        <button
                          className="border dark:border-slate-700 p-2 rounded-lg text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                          onClick={() => {
                            setFormData({
                              nomProduit: p.nomProduit,
                              format: p.format,
                              categorie: p.categorie,
                              type: p.type || "Vente",
                              stockInitial: p.stock,
                              stockMinimum: p.stockMinimum || "",
                              prixUnitaire: p.prixUnitaire,
                              fournisseur: p.fournisseur || "",
                            });
                            setShowModal(true);
                            setEditingProductId(p.codeProduit);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="border dark:border-slate-700 p-2 rounded-lg text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                          onClick={async () => {
                            if (window.confirm(t("Confirm_Delete_Product"))) {
                              setDeleteLoadingId(p.codeProduit);
                              try {
                                await deleteProduit(p.codeProduit);
                                setProduits(produits.filter(prod => prod.codeProduit !== p.codeProduit));
                              } catch (err) {
                                alert(t("Delete_Product_Error"));
                              }
                              setDeleteLoadingId(null);
                            }
                          }}
                          disabled={deleteLoadingId === p.codeProduit}
                        >
                          {deleteLoadingId === p.codeProduit ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : <Trash2 size={16} />}
                        </button>
                      </div>
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* HEADER */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 flex justify-between items-center p-6 border-b dark:border-slate-800 z-10 transition-colors">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
                  {editingProductId ? t("Edit_Product_Title") : t("Add_New_Product_Title")}
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {editingProductId
                    ? t("Edit_Product_Desc")
                    : t("Add_Product_Desc")}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProductId(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {/* FORM */}
            <div className="p-6 space-y-6">
              {/* Nom du produit & Format */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 ml-1">
                    {t("Product_Name")}
                  </label>
                  <input
                    type="text"
                    value={formData.nomProduit}
                    onChange={(e) =>
                      setFormData({ ...formData, nomProduit: e.target.value })
                    }
                    placeholder={t("Ex_Pure_Water")}
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-100 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 ml-1">
                    {t("Format")}
                  </label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) =>
                      setFormData({ ...formData, format: e.target.value })
                    }
                    placeholder={t("Ex_Bottle_1_5L")}
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-100 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Catégorie & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 ml-1">
                    {t("Category")}
                  </label>
                  <select
                    value={formData.categorie}
                    onChange={(e) =>
                      setFormData({ ...formData, categorie: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-100 transition-all shadow-sm font-medium"
                  >
                    <option value="">{t("Select_Category")}</option>
                    {formCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 ml-1">
                    {t("Product_Type")}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-100 transition-all shadow-sm font-medium"
                  >
                    <option value="Vente"> {t("Sale")}</option>
                    <option value="Achat"> {t("Purchase")}</option>
                  </select>
                </div>
              </div>

              {/* Stock initial & Stock minimum */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 ml-1">
                    {t("Initial_Stock")}
                  </label>
                  <input
                    type="number"
                    value={formData.stockInitial}
                    onChange={(e) =>
                      setFormData({ ...formData, stockInitial: e.target.value })
                    }
                    placeholder="0"
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-100 transition-all shadow-sm font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 ml-1">
                    {t("Min_Stock")}
                  </label>
                  <input
                    type="number"
                    value={formData.stockMinimum}
                    onChange={(e) =>
                      setFormData({ ...formData, stockMinimum: e.target.value })
                    }
                    placeholder="0"
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-100 transition-all shadow-sm font-mono"
                  />
                </div>
              </div>

              {/* Prix unitaire & Fournisseur */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 ml-1">
                    {t("Unit_Price_FCFA")}
                  </label>
                  <input
                    type="number"
                    value={formData.prixUnitaire}
                    onChange={(e) =>
                      setFormData({ ...formData, prixUnitaire: e.target.value })
                    }
                    placeholder="0"
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-100 transition-all shadow-sm font-bold text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 ml-1">
                    {t("Supplier")} {formData.type === 'Achat' ? <span className="text-red-500">{t("Required_Star")}</span> : <span className="text-gray-400 font-normal">{t("Optional")}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.fournisseur}
                    onChange={(e) =>
                      setFormData({ ...formData, fournisseur: e.target.value })
                    }
                    placeholder={t("Supplier_Name")}
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-100 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-6 border-t dark:border-slate-800 flex gap-4 transition-colors">
              <button
                onClick={() => { setShowModal(false); setEditingProductId(null); }}
                className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl py-3 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={editingProductId ? handleEditProduct : handleAddProduct}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editingProductId ? t("Saving") : t("Adding")}
                  </div>
                ) : (
                  editingProductId ? t("Save_Changes") : t("Add_Product_Button")
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
