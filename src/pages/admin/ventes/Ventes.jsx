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
import { useState } from "react";

export default function Ventes() {
  const [showModal, setShowModal] = useState(false);

  const [clientInfo, setClientInfo] = useState({
    nom: "",
    telephone: "",
    adresse: "",
  });

  const [produits, setProduits] = useState([
    { id: 1, produit: "", quantite: 0, prixUnitaire: 0 },
  ]);

  const [modePaiement, setModePaiement] = useState("");

  const listeProduits = [
    { id: 1, nom: "Eau minérale 1L" },
    { id: 2, nom: "Eau minérale 5L" },
    { id: 3, nom: "Eau en vrac" },
    { id: 4, nom: "Services de livraison" },
  ];

  const ventes = [
    {
      id: "F-2024-089",
      date: "15/01/2024 14:30",
      client: "Restaurant Le Palmier",
      montant: "11 800",
      paiement: "Espèces",
      statut: "Payée",
    },
    {
      id: "F-2024-088",
      date: "15/01/2024 10:15",
      client: "Hôtel Ivoire",
      montant: "23 600",
      paiement: "Mobile Money",
      statut: "Payée",
    },
  ];

  const sousTotal = produits.reduce(
    (sum, p) => sum + p.quantite * p.prixUnitaire,
    0
  );

  const tva = sousTotal * 0.18;
  const total = sousTotal + tva;

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
                  />
                </div>

                <button className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-50">
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
                {ventes.map((v) => (
                  <tr key={v.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{v.id}</td>
                    <td>{v.date}</td>
                    <td>{v.client}</td>
                    <td className="font-semibold">{v.montant} FCFA</td>

                    <td>
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-gray-400" />
                        {v.paiement}
                      </div>
                    </td>

                    <td>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        {v.statut}
                      </span>
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button className="border p-2 rounded-md hover:bg-gray-50">
                          <Eye size={16} />
                        </button>
                        <button className="border p-2 rounded-md hover:bg-gray-50">
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                  {produits.map((p, i) => (
                    <div key={p.id} className="grid grid-cols-4 gap-2">
                      <select
                        value={p.produit}
                        onChange={(e) => {
                          const copy = [...produits];
                          copy[i].produit = e.target.value;
                          setProduits(copy);
                        }}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="">Produit</option>
                        {listeProduits.map((lp) => (
                          <option key={lp.id}>{lp.nom}</option>
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
                  ))}
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
                onClick={() => {
                  console.log({ clientInfo, produits, modePaiement });
                  setShowModal(false);
                }}
                className="flex-1 bg-black text-white rounded-lg py-2"
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