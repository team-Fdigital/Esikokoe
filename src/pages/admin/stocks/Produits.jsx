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
                {t("Back")}
              </Link>

              <Package className="text-blue-600" size={22} />

              <h1 className="text-xl font-semibold text-gray-900">
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
        <div className="flex gap-1">
          <Link
            to="/admin/stocks/produits"
            className="px-4 py-2 bg-white rounded-t-md text-sm font-medium border-b-2 border-white text-black hover:bg-gray-50"
          >
            {t("Inventory_Tab")}
          </Link>
          <Link
            to="/admin/stocks/action"
            className="px-4 py-2 rounded-t-md text-sm font-medium bg-white text-black hover:bg-gray-50"
          >
            {t("Stock_Tab")}
          </Link>
          <Link
            to="/admin/stocks/alertes"
            className="px-4 py-2 rounded-t-md text-sm font-medium bg-white text-black hover:bg-gray-50 relative"
          >
            {t("Alerts_Tab")}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              1
            </span>
          </Link>
          <Link
            to="/admin/stocks/mouvements"
            className="px-4 py-2 rounded-t-md text-sm font-medium bg-white text-black hover:bg-gray-50"
          >
            {t("Movements_Tab")}
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* CARD HEADER */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  {t("Products_Inventory")}
                </h2>
                <p className="text-sm text-gray-500">
                  {t("Products_Inventory_Desc")}
                </p>
              </div>

              <div className="relative">
                <button
                  className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm bg-white text-black hover:bg-gray-50"
                  onClick={() => setExportMenuOpen((v) => !v)}
                >
                  <Download size={16} />
                  {t("Export")}
                </button>
                {exportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                    <button
                      className="border p-2 rounded-md text-gray-800 bg-white"
                      onClick={() => { handleExportExcel(); setExportMenuOpen(false); }}
                    >
                      {t("Export_Excel")}
                    </button>
                    <button
                      className="border p-2 rounded-md text-gray-800 bg-white"
                      onClick={() => { handleExportPDF(); setExportMenuOpen(false); }}
                    >
                      {t("Export_PDF")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SEARCH */}
            <div className="flex gap-4 mt-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder={t("Search_Product")}
                  className="w-full border rounded-md pl-9 pr-3 py-2 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border rounded-md px-3 py-2 text-sm w-48"
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
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="text-left py-3">{t("Code")}</th>
                  <th className="text-left">{t("Product")}</th>
                  <th className="text-left">{t("Format")}</th>
                  <th className="text-left">{t("Type")}</th>
                  <th className="text-left">{t("Stock_Tab")}</th>
                  <th className="text-left">{t("Status")}</th>
                  <th className="text-left">{t("Price")}</th>
                  <th className="text-left">{t("Supplier")}</th>
                  <th className="text-left">{t("Actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredProduits.map((p) => (
                  <tr key={p.codeProduit} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{p.codeProduit}</td>
                    <td>{p.nomProduit}</td>
                    <td>{p.format}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${p.type === 'Achat' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                        {p.type === 'Achat' ? t("Purchase") : p.type === 'Vente' ? t("Sale") : p.type || t("Sale")}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold">{p.stock}</span>
                      <span className="text-gray-500 text-xs">
                        {t("Per_Min")}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${p.statut === "En stock" || p.stock > (p.stockMinimum || 0)
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {p.statut === "En stock" || p.stock > (p.stockMinimum || 0)
                          ? t("Good_Stock")
                          : t("Low_Stock_Status")}
                      </span>
                    </td>
                    <td>{p.prixUnitaire} FCFA</td>
                    <td>{p.fournisseur}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="border p-2 rounded-md text-gray-800 bg-white"
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
                          className="border p-2 rounded-md text-gray-800 bg-white"
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
                          {deleteLoadingId === p.codeProduit ? t("Deleting") : <Trash2 size={16} />}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-lg font-bold">
                  {editingProductId ? t("Edit_Product_Title") : t("Add_New_Product_Title")}
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
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
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}
            <div className="p-5 space-y-4">
              {/* Nom du produit & Format */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    {t("Product_Name")}
                  </label>
                  <input
                    type="text"
                    value={formData.nomProduit}
                    onChange={(e) =>
                      setFormData({ ...formData, nomProduit: e.target.value })
                    }
                    placeholder={t("Ex_Pure_Water")}
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    {t("Format")}
                  </label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) =>
                      setFormData({ ...formData, format: e.target.value })
                    }
                    placeholder={t("Ex_Bottle_1_5L")}
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
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
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                >
                  <option value="">{t("Select_Category")}</option>
                  {formCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Type (Achat/Vente) */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  {t("Product_Type")}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                >
                  <option value="Vente"> {t("Sale")}</option>
                  <option value="Achat"> {t("Purchase")}</option>
                </select>
              </div>

              {/* Stock initial & Stock minimum */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    {t("Initial_Stock")}
                  </label>
                  <input
                    type="number"
                    value={formData.stockInitial}
                    onChange={(e) =>
                      setFormData({ ...formData, stockInitial: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    {t("Min_Stock")}
                  </label>
                  <input
                    type="number"
                    value={formData.stockMinimum}
                    onChange={(e) =>
                      setFormData({ ...formData, stockMinimum: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Prix unitaire & Fournisseur */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    {t("Unit_Price_FCFA")}
                  </label>
                  <input
                    type="number"
                    value={formData.prixUnitaire}
                    onChange={(e) =>
                      setFormData({ ...formData, prixUnitaire: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    {t("Supplier")} {formData.type === 'Achat' ? <span className="text-red-500">{t("Required_Star")}</span> : <span className="text-gray-400 font-normal">{t("Optional")}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.fournisseur}
                    onChange={(e) =>
                      setFormData({ ...formData, fournisseur: e.target.value })
                    }
                    placeholder={t("Supplier_Name")}
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white flex gap-3 p-4 border-t">
              {editingProductId ? (
                <button
                  onClick={handleEditProduct}
                  className="flex-1 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium text-sm"
                  disabled={actionLoading}
                >
                  {actionLoading ? t("Saving") : t("Save_Changes")}
                </button>
              ) : (
                <button
                  onClick={handleAddProduct}
                  className="flex-1 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium text-sm"
                  disabled={actionLoading}
                >
                  {actionLoading ? t("Adding") : t("Add_Product_Button")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
