import {
  ShoppingCart,
  ArrowLeft,
  Eye,
  Printer,
  Plus,
  X,
  Search,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllVentes, createVente, getAllProduits } from "../../../apiClient";
import { getVenteDetail } from "../../../apiClient";

export default function Ventes() {
    const [loadingDetail, setLoadingDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const [clientInfo, setClientInfo] = useState({
    nom: "",
    telephone: "",
    adresse: "",
  });

  const [produits, setProduits] = useState([
    { id: 1, produit: "", quantite: 0, prixUnitaire: 0 },
  ]);

  const [modePaiement, setModePaiement] = useState("");

  const [listeProduits, setListeProduits] = useState([]);

  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllVentes()
      .then((res) => {
        // Le backend retourne { ventes: [...] }
        if (res.data && Array.isArray(res.data.ventes)) {
          setVentes(res.data.ventes);
        } else {
          setVentes([]);
        }
      })
      .finally(() => setLoading(false));

    // Récupérer les produits depuis l'API
    getAllProduits()
      .then((res) => {
        if (res.data && Array.isArray(res.data.produits)) {
          setListeProduits(res.data.produits);
        } else if (Array.isArray(res.data)) {
          setListeProduits(res.data);
        } else {
          setListeProduits([]);
        }
      })
      .catch(() => setListeProduits([]));
  }, []);

  const sousTotal = produits.reduce(
    (sum, p) => sum + p.quantite * p.prixUnitaire,
    0
  );

  const tva = sousTotal * 0.18;
  const total = sousTotal + tva;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVentes, setFilteredVentes] = useState([]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredVentes(ventes);
    } else {
      setFilteredVentes(
        ventes.filter(v =>
          (v.numeroFacture || v.id || "").toString().includes(searchTerm) ||
          (v.client || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (v.modePaiement || v.paiement || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, ventes]);

  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    if (!dateFilter) return;
    setFilteredVentes(
      ventes.filter(v => {
        if (!v.date) return false;
        const d = new Date(v.date);
        const filterDate = new Date(dateFilter);
        return d.toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10);
      })
    );
  }, [dateFilter, ventes]);

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
                Retour
              </Link>

              <ShoppingCart className="text-green-600" size={22} />
              <h1 className="text-xl font-semibold text-gray-900">
                Module de Vente
              </h1>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              <Plus size={16} />
              Nouvelle vente
            </button>
          </div>
        </div>
      </header>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {loading && (
          <div className="flex justify-center py-10">
            <span>Chargement des ventes...</span>
          </div>
        )}
        {/* TABS */}
        <div className="flex gap-1 border-b">
          <Link
            to="/admin/ventes/ventes"
            className="px-4 py-2 text-sm font-medium border-b-2 border-white hover:bg-gray-50"
          >
            Ventes
          </Link>

          <Link
            to="/admin/ventes/factures"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Factures
          </Link>

          <Link
            to="/admin/ventes/clients"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Clients
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Historique des ventes</h2>
                <p className="text-sm text-gray-500">
                  Toutes les transactions effectuées
                </p>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-3 text-gray-400"
                    size={16}
                  />
                  <input
                    placeholder="Rechercher..."
                    className="border rounded-md pl-9 pr-3 py-2 text-sm w-64"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  className="border p-2 rounded-md text-gray-800 bg-white"
                  onClick={() => {
                    const date = prompt("Entrez la date au format YYYY-MM-DD pour filtrer :");
                    if (date) setDateFilter(date);
                  }}
                >
                  <Calendar size={16} />
                  Filtrer par date
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="text-left py-3">N° Facture</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Client</th>
                  <th className="text-left">Montant</th>
                  <th className="text-left">Paiement</th>
                  <th className="text-left">Statut</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredVentes.map((v) => {
                  const dateObj = v.date ? new Date(v.date) : null;
                  const dateStr = dateObj ? dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-';
                  const montantStr = v.montant ? v.montant.toLocaleString('fr-FR') + ' FCFA' : '-';
                  return (
                    <tr key={v.idVente || v.id || v.numeroFacture} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{v.numeroFacture || v.id}</td>
                      <td>{dateStr}</td>
                      <td>{v.client}</td>
                      <td className="font-semibold">{montantStr}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-gray-400" />
                          {v.modePaiement || v.paiement || '-'}
                        </div>
                      </td>
                      <td>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          {v.statut || 'Payée'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="border p-2 rounded-md text-gray-800 bg-white"
                            onClick={async () => {
                              setSelectedSale(null);
                              setShowDetailModal(true);
                              setLoadingDetail(true);
                              try {
                                const res = await getVenteDetail(v.idVente || v.id);
                                setSelectedSale(res.data || res);
                              } catch (err) {
                                console.log("Impossible de charger le détail de la vente", err);
                                alert("Impossible de charger le détail de la vente");
                              }
                              setLoadingDetail(false);
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="border p-2 rounded-md text-gray-800 bg-white"
                            onClick={async () => {
                              try {
                                const venteId = v.idVente ? v.idVente : v.id;
                                if (!venteId) {
                                  alert("Identifiant de vente manquant.");
                                  return;
                                }
                                // Utilise la même logique que le bouton Eye
                                const res = await getVenteDetail(venteId);
                                let venteDetail = null;
                                if (res.data?.vente) {
                                  venteDetail = res.data.vente;
                                } else if (res.data) {
                                  venteDetail = res.data;
                                } else if (res.vente) {
                                  venteDetail = res.vente;
                                } else {
                                  venteDetail = res;
                                }
                                // Correction : accepte idVente ou id ou numeroFacture
                                if (!venteDetail || !(venteDetail.idVente || venteDetail.id || venteDetail.numeroFacture)) {
                                  console.log('Réponse API:', res);
                                  alert("Impossible de charger le détail de la vente pour impression. Vérifiez la structure de la réponse API.");
                                  return;
                                }
                                // Mapping robuste pour les produits
                                const produitsList = Array.isArray(venteDetail.produits) ? venteDetail.produits : (Array.isArray(venteDetail.items) ? venteDetail.items : (Array.isArray(venteDetail.lignes) ? venteDetail.lignes : (Array.isArray(venteDetail.details) ? venteDetail.details : [])));
                                const printWindow = window.open('', '', 'width=800,height=600');
                                if (!printWindow) {
                                  alert("Impossible d'ouvrir la fenêtre d'impression. Vérifiez que les popups ne sont pas bloquées.");
                                  return;
                                }
                                printWindow.document.write('<html><head><title>Impression Vente</title>');
                                printWindow.document.write('<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:8px;} th{background:#f3f3f3;}</style>');
                                printWindow.document.write('</head><body>');
                                printWindow.document.write(`
                                  <h2 style='font-size:1.2em;font-weight:bold;margin-bottom:1em;'>Détail de la vente ${venteDetail.numeroFacture || venteDetail.idVente || venteDetail.id || ''}</h2>
                                  <div style='display:flex;justify-content:space-between;margin-bottom:1em;'>
                                    <div>
                                      <h3 style='font-weight:bold;'>Informations client</h3>
                                      <div>Nom: <b>${venteDetail.client || '-'}</b></div>
                                      <div>Téléphone: <b>${venteDetail.telephone || '-'}</b></div>
                                      <div>Adresse: <b>${venteDetail.adresse || '-'}</b></div>
                                    </div>
                                    <div style='text-align:right;'>
                                      <h3 style='font-weight:bold;'>Informations vente</h3>
                                      <div>Date: <b>${venteDetail.date ? new Date(venteDetail.date).toLocaleString('fr-FR') : '-'}</b></div>
                                      <div>Paiement: <b>${venteDetail.modePaiement || venteDetail.paiement || '-'}</b></div>
                                      <div>Statut: <b>${venteDetail.statut || 'Payée'}</b></div>
                                    </div>
                                  </div>
                                  <h3 style='font-weight:bold;margin-bottom:0.5em;'>Produits vendus</h3>
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Produit</th>
                                        <th>Quantité</th>
                                        <th>Prix unitaire</th>
                                        <th>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      ${produitsList.length === 0 ? `<tr><td colspan='4' style='text-align:center;color:#888;padding:1em;'>Aucun produit</td></tr>` : produitsList.map((p, idx) => `
                                      <tr key="prod-${p.id || p.codeProduit || idx}">
                                        <td>${p.nomProduit || p.productName || p.produit || p.name || '-'}</td>
                                        <td>${p.quantite ?? p.qty ?? p.qte ?? '-'}</td>
                                        <td>${(p.prixUnitaire ?? p.unitPrice ?? p.price ?? 0).toLocaleString()} FCFA</td>
                                        <td>${((p.quantite ?? p.qty ?? p.qte ?? 0) * (p.prixUnitaire ?? p.unitPrice ?? p.price ?? 0)).toLocaleString()} FCFA</td>
                                      </tr>
                                    `).join('')}
                                    </tbody>
                                  </table>
                                  <div style='margin-top:1em;display:flex;justify-content:space-between;'>
                                    <div>
                                      <div><b>Sous-total:</b></div>
                                      <div><b>TVA:</b></div>
                                      <div style='font-size:1.1em;font-weight:bold;'>Total:</div>
                                    </div>
                                    <div style='text-align:right;'>
                                      <div>${venteDetail.sousTotal?.toLocaleString() || venteDetail.montant || '-'} FCFA</div>
                                      <div>${venteDetail.tva?.toLocaleString() || ((venteDetail.montant || 0) * 0.18)?.toLocaleString()} FCFA</div>
                                      <div style='font-size:1.1em;font-weight:bold;'>${venteDetail.total?.toLocaleString() || venteDetail.montant?.toLocaleString() || '-'} FCFA</div>
                                    </div>
                                  </div>
                                `);
                                printWindow.document.write('</body></html>');
                                printWindow.document.close();
                                printWindow.focus();
                                setTimeout(() => printWindow.print(), 500);
                              } catch (err) {
                                alert("Erreur impression : " + (err.message || err));
                              }
                            }}
                            title="Imprimer la vente"
                          >
                            <Printer size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {ventes.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                Aucune vente enregistrée
              </div>
            )}
          </div>
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

              <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <div className="p-4 space-y-6">
              {/* CLIENT */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Informations client
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Nom"
                    value={clientInfo.nom}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, nom: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 text-sm"
                  />

                  <input
                    placeholder="Téléphone"
                    value={clientInfo.telephone}
                    onChange={(e) =>
                      setClientInfo({
                        ...clientInfo,
                        telephone: e.target.value,
                      })
                    }
                    className="border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <textarea
                  placeholder="Adresse"
                  value={clientInfo.adresse}
                  onChange={(e) =>
                    setClientInfo({
                      ...clientInfo,
                      adresse: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 py-2 text-sm w-full mt-2"
                />
              </div>

              {/* PRODUITS */}
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-semibold">Produits</h3>

                  <button
                    onClick={() =>
                      setProduits([
                        ...produits,
                        {
                          id: Date.now(),
                          produit: "",
                          quantite: 0,
                          prixUnitaire: 0,
                        },
                      ])
                    }
                    className="text-white text-sm flex gap-1 items-center"
                  >
                    <Plus size={14} /> Ajouter
                  </button>
                </div>

                <div className="space-y-2">
                  {produits.map((p, i) => {
                    // Trouver le produit sélectionné pour afficher le prix par défaut si besoin
                    const produitObj = listeProduits.find(lp => lp.codeProduit === p.produit);
                    return (
                      <div key={p.id} className="grid grid-cols-4 gap-2">
                        <select
                          value={p.produit}
                          onChange={(e) => {
                            const codeProduit = e.target.value;
                            const produitTrouve = listeProduits.find(lp => lp.codeProduit === codeProduit);
                            const copy = [...produits];
                            copy[i].produit = codeProduit;
                            // Toujours mettre à jour le prix unitaire selon le produit sélectionné
                            if (produitTrouve) {
                              copy[i].prixUnitaire = produitTrouve.prixUnitaire;
                            } else {
                              copy[i].prixUnitaire = 0;
                            }
                            setProduits(copy);
                          }}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="">Produit</option>
                          {listeProduits.map((lp) => (
                            <option key={lp.codeProduit} value={lp.codeProduit}>{lp.nomProduit}</option>
                          ))}
                        </select>

                        <input
                          type="number"
                          placeholder="Qté"
                          value={p.quantite}
                          onChange={(e) => {
                            const copy = [...produits];
                            copy[i].quantite = +e.target.value;
                            setProduits(copy);
                          }}
                          className="border rounded px-2 py-1 text-sm"
                        />

                        <input
                          type="number"
                          placeholder="Prix"
                          value={p.prixUnitaire}
                          onChange={(e) => {
                            const copy = [...produits];
                            copy[i].prixUnitaire = +e.target.value;
                            setProduits(copy);
                          }}
                          className="border rounded px-2 py-1 text-sm"
                        />

                        <div className="text-sm font-semibold flex items-center">
                          {(p.quantite * p.prixUnitaire).toLocaleString()} FCFA
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PAIEMENT */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Paiement</h3>

                <select
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                >
                  <option value="">Mode de paiement</option>
                  <option>Espèces</option>
                  <option>Carte bancaire</option>
                  <option>Mobile Money</option>
                  <option>Virement</option>
                </select>
              </div>

              {/* TOTAL */}
              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (18%):</span> <span>{(produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0) * 0.18).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{(produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0) * 1.18).toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex gap-3 p-4 border-t">

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
                    // Reset form
                    setClientInfo({ nom: "", telephone: "", adresse: "" });
                    setProduits([{ id: 1, produit: "", quantite: 0, prixUnitaire: 0 }]);
                    setModePaiement("");
                    setLoading(true);
                    getAllVentes()
                      .then((res) => {
                        if (res.data && Array.isArray(res.data.ventes)) {
                          setVentes(res.data.ventes);
                        } else {
                          setVentes([]);
                        }
                      })
                      .finally(() => setLoading(false));
                  } catch (err) {
                    console.log("Erreur lors de la création de la vente : " + (err?.response?.data?.message || err.message || err));
                  }
                }}
                className="flex-1 bg-black text-white rounded-lg py-2"
              >
                Créer la vente
              </button>
            </div>
          </div>
        </div>
      )}
      

      {/* MODAL DÉTAIL VENTE */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Détail de la vente {selectedSale?.numeroFacture || selectedSale?.id || ''}</h2>
              <button onClick={() => { setShowDetailModal(false); setSelectedSale(null); }} className="border p-2 rounded-md text-gray-800 bg-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {loadingDetail && (
                <div className="text-center text-blue-600 font-semibold py-8">
                  Chargement des détails de la vente...
                </div>
              )}
              {!loadingDetail && selectedSale && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col justify-center items-start">
                      <h3 className="font-semibold mb-2">Informations client</h3>
                      <div className="text-sm space-y-1">
                        <div><span className="font-bold">Nom:</span> {selectedSale.client || '-'}</div>
                        <div><span className="font-bold">Téléphone:</span> {selectedSale.telephone || '-'}</div>
                        <div><span className="font-bold">Adresse:</span> {selectedSale.adresse || '-'}</div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-end">
                      <h3 className="font-semibold mb-2">Informations vente</h3>
                      <div className="text-sm space-y-1 text-right">
                        <div><span className="font-bold">Date:</span> {selectedSale.date ? new Date(selectedSale.date).toLocaleString('fr-FR') : '-'}</div>
                        <div><span className="font-bold">Paiement:</span> {selectedSale.modePaiement || selectedSale.paiement || '-'}</div>
                        <div><span className="font-bold">Statut:</span> <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{selectedSale.statut || 'Payée'}</span></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Produits vendus</h3>
                    {(() => {
                      // Cherche le bon tableau de produits
                      const produitsList = selectedSale.produits || selectedSale.items || selectedSale.lignes || selectedSale.details || [];
                      return (
                        <table className="w-full text-sm border rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="text-left px-2 py-1">Produit</th>
                              <th className="text-right px-2 py-1">Quantité</th>
                              <th className="text-right px-2 py-1">Prix unitaire</th>
                              <th className="text-right px-2 py-1">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {produitsList.length === 0 ? (
                              <tr><td colSpan={4} className="text-center py-4 text-gray-400">Aucun produit</td></tr>
                            ) : produitsList.map((p, i) => (
                              <tr key={i}>
                                <td className="px-2 py-1">{p.nomProduit || p.productName || p.produit || p.name || '-'}</td>
                                <td className="px-2 py-1 text-right">{p.quantite ?? p.qty ?? p.qte ?? '-'}</td>
                                <td className="px-2 py-1 text-right">{(p.prixUnitaire ?? p.unitPrice ?? p.price ?? 0)?.toLocaleString()} FCFA</td>
                                <td className="px-2 py-1 text-right">{((p.quantite ?? p.qty ?? p.qte ?? 0) * (p.prixUnitaire ?? p.unitPrice ?? p.price ?? 0))?.toLocaleString()} FCFA</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })()}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col items-start space-y-2">
                        <div className="font-medium">Sous-total:</div>
                        <div className="font-medium">TVA:</div>
                        <div className="font-bold text-lg">Total:</div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div>{selectedSale.sousTotal?.toLocaleString() || selectedSale.montant || '-'} FCFA</div>
                        <div>{selectedSale.tva?.toLocaleString() || ((selectedSale.montant || 0) * 0.18)?.toLocaleString()} FCFA</div>
                        <div className="font-bold text-lg">{selectedSale.total?.toLocaleString() || selectedSale.montant?.toLocaleString() || '-'} FCFA</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}