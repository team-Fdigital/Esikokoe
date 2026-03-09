import { ShoppingCart, ArrowLeft, User, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createVente, getAllClients, createClient } from "../../../apiClient";

export default function Clients() {
  const [showModal, setShowModal] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({ nomClient: "", telephone: "", adresse: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClients()
      .then((res) => {
        // Le backend retourne { clients: [...] }
        if (res.data && Array.isArray(res.data.clients)) {
          setClients(res.data.clients);
        } else {
          setClients([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);
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

              <ShoppingCart className="text-green-600" size={22} />

              <h1 className="text-xl font-semibold text-gray-900">
                Module de Vente
              </h1>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 md:gap-2 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-md">
              <Plus size={16} />
              <span className="hidden sm:inline">Nouvelle vente</span>
              <span className="inline sm:hidden">Vente</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
        {/* TABS */}
        <div className="flex gap-1 border-b">
          <Link
            to="/admin/ventes/ventes"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Ventes
          </Link>

          <Link
            to="/admin/ventes/factures"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Factures
          </Link>

          <Link
            to="/admin/ventes/clients"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium border-b-2 border-white hover:bg-gray-50"
          >
            Clients
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold">
              Base de données clients
            </h2>
            <p className="text-sm text-gray-500">
              Gérez vos clients et leur historique
            </p>
          </div>

          <div className="flex justify-end p-4">
            <button
              onClick={() => setShowAddClient(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Ajouter un client
            </button>
          </div>
          {loading ? (
            <div className="py-20 flex flex-col items-center text-center text-gray-500">
              <User size={48} className="mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-700">Chargement des clients...</h3>
            </div>
          ) : clients.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center text-gray-500">
              <User size={48} className="mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-700">Aucun client enregistré</h3>
            </div>
          ) : (
            <div className="overflow-x-auto p-4 md:p-6">
              <table className="w-full text-xs md:text-sm min-w-[500px]">
                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="text-left py-3">Nom</th>
                    <th className="text-left">Téléphone</th>
                    <th className="text-left">Adresse</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.idClient} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{c.nomClient}</td>
                      <td>{c.telephone}</td>
                      <td>{c.adresse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MODAL AJOUT CLIENT */}
          {showAddClient && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                <h2 className="text-lg font-bold mb-4">Ajouter un client</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setAddLoading(true);
                    try {
                      await createClient(newClient);
                      setShowAddClient(false);
                      setNewClient({ nomClient: "", telephone: "", adresse: "" });
                      setLoading(true);
                      getAllClients()
                        .then((res) => {
                          if (res.data && Array.isArray(res.data.clients)) {
                            setClients(res.data.clients);
                          } else {
                            setClients([]);
                          }
                        })
                        .finally(() => setLoading(false));
                    } catch (err) {
                      alert("Erreur lors de la création du client");
                    }
                    setAddLoading(false);
                  }}
                >
                  <div className="mb-3">
                    <label className="block text-xs font-semibold mb-1">Nom</label>
                    <input
                      type="text"
                      required
                      value={newClient.nomClient}
                      onChange={(e) => setNewClient({ ...newClient, nomClient: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold mb-1">Téléphone</label>
                    <input
                      type="text"
                      required
                      value={newClient.telephone}
                      onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold mb-1">Adresse</label>
                    <input
                      type="text"
                      required
                      value={newClient.adresse}
                      onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddClient(false)}
                      className="flex-1 bg-gray-200 text-gray-700 rounded-lg py-2"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={addLoading}
                      className="flex-1 bg-green-600 text-white rounded-lg py-2"
                    >
                      {addLoading ? "Ajout..." : "Ajouter"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL COMPLET */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-lg font-bold">Créer une nouvelle vente</h2>
                <p className="text-xs text-gray-600 mt-1">
                  Informations de la vente
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}
            <div className="p-4 space-y-6">
              {/* INFORMATIONS CLIENT */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Informations client</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Nom du client</label>
                      <input
                        type="text"
                        placeholder="Nom complet ou entreprise"
                        value={clientInfo.nom}
                        onChange={(e) => setClientInfo({ ...clientInfo, nom: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Téléphone</label>
                      <input
                        type="tel"
                        placeholder="+225 XX XX XX XX XX"
                        value={clientInfo.telephone}
                        onChange={(e) => setClientInfo({ ...clientInfo, telephone: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Adresse</label>
                    <textarea
                      placeholder="Adresse complète"
                      value={clientInfo.adresse}
                      onChange={(e) => setClientInfo({ ...clientInfo, adresse: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 resize-none"
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* PRODUITS */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold">Produits</h3>
                  <button
                    onClick={() => setProduits([...produits, { id: Date.now(), produit: "", quantite: 0, prixUnitaire: 0 }])}
                    className="text-white text-sm font-medium flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Ajouter un produit
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {produits.map((p, idx) => (
                    <div key={p.id} className="grid grid-cols-5 gap-2 items-end">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Produit</label>
                        <select
                          value={p.produit}
                          onChange={(e) => {
                            const newProduits = [...produits];
                            newProduits[idx].produit = e.target.value;
                            setProduits(newProduits);
                          }}
                          className="w-full px-2 py-1.5 text-xs border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                        >
                          <option value="">Sélectionner</option>
                          {listeProduits.map((prod) => (
                            <option key={prod.id} value={prod.nom}>
                              {prod.nom}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Quantité</label>
                        <input
                          type="number"
                          min="0"
                          value={p.quantite}
                          onChange={(e) => {
                            const newProduits = [...produits];
                            newProduits[idx].quantite = parseFloat(e.target.value) || 0;
                            setProduits(newProduits);
                          }}
                          className="w-full px-2 py-1.5 text-xs border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Prix unitaire</label>
                        <input
                          type="number"
                          min="0"
                          value={p.prixUnitaire}
                          onChange={(e) => {
                            const newProduits = [...produits];
                            newProduits[idx].prixUnitaire = parseFloat(e.target.value) || 0;
                            setProduits(newProduits);
                          }}
                          className="w-full px-2 py-1.5 text-xs border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Total</label>
                        <div className="text-xs font-semibold py-1.5">
                          {(p.quantite * p.prixUnitaire).toLocaleString()} FCFA
                        </div>
                      </div>
                      <button
                        onClick={() => setProduits(produits.filter((_, i) => i !== idx))}
                        className="text-red-600 hover:text-red-700 text-sm px-2 py-1.5"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PAIEMENT */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Paiement</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Mode de paiement</label>
                  <select
                    value={modePaiement}
                    onChange={(e) => setModePaiement(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Espèces">Espèces</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Chèque">Chèque</option>
                    <option value="Virement">Virement</option>
                  </select>
                </div>

                {/* TOTALS */}
                <div className="mt-4 space-y-2 border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total:</span>
                    <span>{produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVA (18%):</span>
                    <span>{(produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0) * 0.18).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{(produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0) * 1.18).toLocaleString()} FCFA</span>
                  </div>
                </div>
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
                onClick={async () => {
                  const venteData = {
                    nomClient: clientInfo.nom,
                    telephone: clientInfo.telephone,
                    adresse: clientInfo.adresse,
                    modePaiement,
                    produits: produits.map((p) => ({
                      codeProduit: p.produit,
                      quantite: p.quantite,
                      prixUnitaire: p.prixUnitaire,
                    })),
                    montantTotal: produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0) * 1.18,
                    dateVente: new Date().toISOString(),
                  };
                  try {
                    await createVente(venteData);
                    setShowModal(false);
                    setClientInfo({ nom: "", telephone: "", adresse: "" });
                    setProduits([{ id: 1, produit: "", quantite: 0, prixUnitaire: 0 }]);
                    setModePaiement("");
                  } catch (err) {
                    alert("Erreur lors de la création de la vente");
                  }
                }}
                className="flex-1 px-4 py-2 text-sm bg-black hover:bg-gray-800 text-white rounded-lg font-medium"
              >
                Créer la vente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}