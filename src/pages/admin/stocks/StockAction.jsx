import { ArrowDown, ArrowUp, Box, X, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProduits, registerStockEntry, deductStock, transferStock, getAllMagasins } from "../../../apiClient";

export default function Stock() {
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
    try {
      const [produitsRes, magasinsRes] = await Promise.all([
        getAllProduits(),
        getAllMagasins()
      ]);

      // Mapping des produits (vérification de la structure { produits: [...] } ou [...])
      const prodData = produitsRes.data.produits || (Array.isArray(produitsRes.data) ? produitsRes.data : []);
      setProduits(prodData);

      // Mapping des magasins (vérification de la structure { magasins: [...] } ou [...])
      const magData = magasinsRes.data.magasins || (Array.isArray(magasinsRes.data) ? magasinsRes.data : []);
      setMagasins(magData);

    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
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
    setActionLoading(true);
    try {
      if (currentAction === "ENTREE") {
        await registerStockEntry({
          codeProduit: formData.codeProduit,
          quantite: Number(formData.quantite),
          motif: formData.motif || "Entrée en stock",
          magasinId: userStore // Ajout si nécessaire par le DTO
        });
      } else {
        // Pour une "SORTIE" (Distribution), on utilise l'API de transfert
        await transferStock({
          codeProduit: formData.codeProduit,
          sourceMagasinId: userStore,
          destinationMagasinId: formData.idMagasin,
          quantite: Number(formData.quantite),
          motif: formData.motif || "Distribution stock"
        });
      }

      await fetchData(); // Refresh data from server
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'opération:", err);
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement de l'opération");
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
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold border-b-2 border-emerald-500 pb-2 inline-block text-gray-800">
            Effectuer un Stockage / Distribution
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Réalisez une entrée ou une distribution de matériel vers un autre magasin.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openModal("ENTREE")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-green-500/20"
          >
            <ArrowDown size={20} />
            Entrée
          </button>
          <button
            onClick={() => openModal("SORTIE")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-red-500/20"
          >
            <ArrowUp size={20} />
            Distribution
          </button>
        </div>
      </div>

      <div className="flex gap-1">
        <Link
          to="/admin/stocks/produits"
          className="px-4 py-2 bg-white rounded-t-md text-sm font-medium text-black hover:bg-gray-50"
        >
          Inventaire
        </Link>
        <Link
          to="/admin/stocks/action"
          className="px-4 py-2 bg-white rounded-t-md text-sm font-medium border-b-2 border-emerald-500 text-black hover:bg-gray-50"
        >
          Stock
        </Link>
        <Link
          to="/admin/stocks/alertes"
          className="px-4 py-2 rounded-t-md text-sm font-medium bg-white text-black hover:bg-gray-50 relative"
        >
          Alertes
        </Link>
        <Link
          to="/admin/stocks/mouvements"
          className="px-4 py-2 rounded-t-md text-sm font-medium bg-white text-black hover:bg-gray-50 border-b-2 border-transparent"
        >
          Mouvements
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="text-center py-20">Chargement...</div>
        ) : (
          <>
            <div className="mb-6 relative max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher un produit ou matériel..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Matériaux d'Achat */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Matériaux / Achat
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {materiaux.map(p => (
                  <ProductCard
                    key={p.codeProduit}
                    produit={p}
                    onStockage={() => openModal("ENTREE", p.codeProduit)}
                    onDestockage={() => openModal("SORTIE", p.codeProduit)}
                  />
                ))}
                {materiaux.length === 0 && (
                  <p className="text-sm text-gray-500 italic col-span-full">Aucun matériel trouvé.</p>
                )}
              </div>
            </div>

            {/* Produits de Vente */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Produits Finis / Vente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {produitsVente.map(p => (
                  <ProductCard
                    key={p.codeProduit}
                    produit={p}
                    onStockage={() => openModal("ENTREE", p.codeProduit)}
                    onDestockage={() => openModal("SORTIE", p.codeProduit)}
                  />
                ))}
                {produitsVente.length === 0 && (
                  <p className="text-sm text-gray-500 italic col-span-full">Aucun produit trouvé.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className={`px-6 py-4 border-b flex justify-between items-center ${currentAction === 'ENTREE' ? 'bg-green-50/80 border-green-100' : 'bg-red-50/80 border-red-100'}`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${currentAction === 'ENTREE' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                  {currentAction === 'ENTREE' ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${currentAction === 'ENTREE' ? 'text-green-800' : 'text-red-800'}`}>
                    {currentAction === "ENTREE" ? "Entrée en stock" : "Distribution"}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit concerné</label>
                <select
                  required
                  value={formData.codeProduit}
                  onChange={(e) => setFormData({ ...formData, codeProduit: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Sélectionnez un produit...</option>
                  {produits.map(p => (
                    <option key={p.codeProduit} value={p.codeProduit}>{p.nomProduit} ({p.format})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité
                </label>
                <div className="relative">
                  <input
                    type="number" required min="1"
                    value={formData.quantite}
                    onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pl-12"
                    placeholder="0"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">QTE</span>
                </div>
              </div>

              {currentAction === 'SORTIE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Magasin de destination
                  </label>
                  <select
                    required
                    value={formData.idMagasin}
                    onChange={(e) => setFormData({ ...formData, idMagasin: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Sélectionnez un magasin...</option>
                    {magasins.map(m => (
                      <option key={m.idMagasin} value={m.idMagasin}>{m.nom}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                <input
                  type="text"
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: Réapprovisionnement"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium">Annuler</button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`px-6 py-2 text-white rounded-xl transition-colors shadow-md text-sm font-medium disabled:opacity-50
                    ${currentAction === 'ENTREE' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'}
                  `}
                >
                  {actionLoading ? "En cours..." : "Valider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ produit, onStockage, onDestockage }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 line-clamp-1 flex-1" title={produit.nomProduit}>{produit.nomProduit}</h3>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 ml-2">{produit.format}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Box size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">Stock :</span>
          <span className={`font-bold ml-auto ${produit.stock <= (produit.stockMinimum || 0) ? 'text-red-500' : 'text-green-600'}`}>
            {produit.stock || 0}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onStockage}
          className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
        >
          <ArrowDown size={14} /> Entrée
        </button>
        <button
          onClick={onDestockage}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
        >
          <ArrowUp size={14} /> Distribuer
        </button>
      </div>
    </div>
  );
}
