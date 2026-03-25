import { ArrowDown, ArrowUp, Box, X, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProduits, registerStockEntry, deductStock, transferStock, getAllMagasins } from "../../../apiClient";
import { useTranslation } from "react-i18next";

export default function StockAction() {
  const { t } = useTranslation();
  const [produits, setProduits] = useState([]);
  const [magasins, setMagasins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState(""); // "ENTREE" or "SORTIE"

  const [formData, setFormData] = useState({
    codeProduit: "",
    quantite: "",
    idMagasin: "",
    motif: ""
  });

  const userRole = localStorage.getItem('mockRole') || (localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role : 'SUPERADMIN');
  const userStore = localStorage.getItem('mockStore') || (localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).magasinId : null);

  const fetchData = async () => {
    setLoading(true);

    // Charger les produits séparément
    try {
      const prodRes = await getAllProduits();
      const prodData = prodRes.data.produits || (Array.isArray(prodRes.data) ? prodRes.data : []);
      setProduits(prodData);
    } catch (error) {
      console.error("Erreur produits:", error);
    }

    // Charger les magasins séparément
    try {
      const magRes = await getAllMagasins();
      const magData = magRes.data.magasins || (Array.isArray(magRes.data) ? magRes.data : []);
      setMagasins(magData);
    } catch (error) {
      console.error("Erreur magasins:", error);
      // Optionnel: afficher une alerte si c'est une erreur critique (403, etc)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (action, codeProduit = "") => {
    setCurrentAction(action);
    setFormData({ codeProduit, quantite: "", idMagasin: "", motif: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentAction === "SORTIE") {
      const selectedProduct = produits.find(p => p.codeProduit === formData.codeProduit);
      if (!selectedProduct || Number(formData.quantite) > (selectedProduct.stock || 0)) {
        alert(`${t("Insufficient_Stock")} ${selectedProduct ? selectedProduct.stock : 0}.`);
        return;
      }
    }

    setActionLoading(true);
    try {
      if (currentAction === "ENTREE") {
        await registerStockEntry({
          codeProduit: formData.codeProduit,
          quantite: Number(formData.quantite),
          motif: formData.motif || t("Stock_Inbound"),
          magasinId: userStore
        });
      } else {
        // Pour une "SORTIE" (Distribution), on utilise l'API de transfert
        await transferStock({
          codeProduit: formData.codeProduit,
          sourceMagasinId: userStore,
          destinationMagasinId: formData.idMagasin,
          quantite: Number(formData.quantite),
          motif: formData.motif || t("Stock_Distribution")
        });
      }

      await fetchData();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'opération:", err);
      alert(err.response?.data?.message || t("Operation_Error"));
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProduits = produits.filter((p) => {
    return p.nomProduit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codeProduit?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const materiaux = filteredProduits.filter(p => p.type === 'ACHAT');
  const produitsVente = filteredProduits.filter(p => p.type !== 'ACHAT');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl font-bold border-b-2 border-emerald-500 pb-2 inline-block text-gray-800 dark:text-white">
            {t("Perform_Stocking_Distribution")}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-2">
            {t("Perform_Stocking_Distribution_Desc")}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openModal("ENTREE")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-green-500/20"
          >
            <ArrowDown size={20} />
            {t("Inbound")}
          </button>
          <button
            onClick={() => openModal("SORTIE")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-red-500/20"
          >
            <ArrowUp size={20} />
            {t("Distribution")}
          </button>
        </div>
      </div>

      <div className="flex gap-1">
        <Link
          to="/admin/stocks/produits"
          className="px-4 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          {t("Inventory_Tab")}
        </Link>
        <Link
          to="/admin/stocks/action"
          className="px-4 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-sm font-bold border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
        >
          {t("Stock_Tab")}
        </Link>
        <Link
          to="/admin/stocks/alertes"
          className="px-4 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          {t("Alerts_Tab")}
        </Link>
        <Link
          to="/admin/stocks/mouvements"
          className="px-4 py-2 bg-white dark:bg-slate-900 rounded-t-xl text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          {t("Movements_Tab")}
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-slate-800 p-6 transition-colors">
        {loading ? (
          <div className="text-center py-20 dark:text-slate-400">{t("Loading")}</div>
        ) : (
          <>
            <div className="mb-6 relative max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400 dark:text-slate-500" size={18} />
              <input
                type="text"
                placeholder={t("Search_Product_Material")}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Matériaux d'Achat */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                {t("Purchase")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {materiaux.map(p => (
                  <ProductCard
                    t={t}
                    key={p.codeProduit}
                    produit={p}
                    onStockage={() => openModal("ENTREE", p.codeProduit)}
                    onDestockage={() => openModal("SORTIE", p.codeProduit)}
                  />
                ))}
                {materiaux.length === 0 && (
                  <p className="text-sm text-gray-500 italic col-span-full">{t("No_Material_Found")}</p>
                )}
              </div>
            </div>

            {/* Produits de Vente */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {t("Sale")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {produitsVente.map(p => (
                  <ProductCard
                    t={t}
                    key={p.codeProduit}
                    produit={p}
                    onStockage={() => openModal("ENTREE", p.codeProduit)}
                    onDestockage={() => openModal("SORTIE", p.codeProduit)}
                  />
                ))}
                {produitsVente.length === 0 && (
                  <p className="text-sm text-gray-500 italic col-span-full">{t("No_Product_Found")}</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up border dark:border-slate-800">
            <div className={`px-6 py-4 border-b flex justify-between items-center ${currentAction === 'ENTREE' 
              ? 'bg-green-50/80 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' 
              : 'bg-red-50/80 dark:bg-red-900/20 border-red-100 dark:border-red-900/30'}`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${currentAction === 'ENTREE' ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200'}`}>
                  {currentAction === 'ENTREE' ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${currentAction === 'ENTREE' ? 'text-green-800 dark:text-green-100' : 'text-red-800 dark:text-red-100'}`}>
                    {currentAction === "ENTREE" ? t("Stock_Inbound") : t("Distribution")}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t("Concerned_Product")}</label>
                <select
                  required
                  value={formData.codeProduit}
                  onChange={(e) => setFormData({ ...formData, codeProduit: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">{t("Select_Product")}</option>
                  {produits.map(p => {
                    // Si on est en "SORTIE" (distribution), on ne montre que les produits avec stock > 0
                    if (currentAction === 'SORTIE' && (p.stock || 0) <= 0) {
                      return null;
                    }
                    return (
                      <option key={p.codeProduit} value={p.codeProduit}>
                        {p.nomProduit} ({p.format}) - {t("In_Stock_Colon")} {p.stock || 0}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  {t("Quantity")}
                </label>
                <div className="relative">
                    <input
                      type="number" required min="1"
                      max={currentAction === 'SORTIE' ? (produits.find(p => p.codeProduit === formData.codeProduit)?.stock || 0) : undefined}
                      value={formData.quantite}
                      onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pl-12"
                      placeholder="0"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-sm font-medium">QTE</span>
                </div>
              </div>

              {currentAction === 'SORTIE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {t("Destination_Store")}
                  </label>
                  <select
                    required
                    value={formData.idMagasin}
                    onChange={(e) => setFormData({ ...formData, idMagasin: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">{t("Select_Store")}</option>
                    {magasins.map(m => (
                      <option key={m.idMagasin} value={m.idMagasin}>{m.nom}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t("Reason")}</label>
                <input
                  type="text"
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder={t("Ex_Restock")}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-sm font-medium">{t("Cancel")}</button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`px-6 py-2 text-white rounded-xl transition-colors shadow-md text-sm font-medium disabled:opacity-50
                    ${currentAction === 'ENTREE' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'}
                  `}
                >
                  {actionLoading ? t("In_Progress") : t("Validate")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ produit, onStockage, onDestockage, t }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 dark:text-white line-clamp-1 flex-1" title={produit.nomProduit}>{produit.nomProduit}</h3>
          <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-slate-700 ml-2">{produit.format}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Box size={14} className="text-gray-400 dark:text-slate-500" />
          <span className="text-sm text-gray-600 dark:text-slate-400">{t("Stock_Colon")}</span>
          <span className={`font-bold ml-auto ${produit.stock <= (produit.stockMinimum || 0) ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {produit.stock || 0}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onStockage}
          className="flex-1 bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
        >
          <ArrowDown size={14} /> {t("Inbound")}
        </button>
        <button
          onClick={onDestockage}
          disabled={(produit.stock || 0) <= 0}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border
            ${(produit.stock || 0) <= 0
              ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 border-gray-200 dark:border-slate-700 cursor-not-allowed'
              : 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30'
            }
          `}
          title={(produit.stock || 0) <= 0 ? t("Stock_Empty") : t("Distribute")}
        >
          <ArrowUp size={14} /> {t("Distribute")}
        </button>
      </div>
    </div>
  );
}
