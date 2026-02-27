import { Package, Plus, Search, Download, Pencil, Trash2, ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Produits() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    format: "",
    categorie: "",
    stockInitial: "",
    stockMinimum: "",
    prixUnitaire: "",
    fournisseur: "",
  });

  const categories = ["Eau Pure", "Eau Minérale", "Eau Gazeuse", "Autre"];

  const handleAddProduct = () => {
    if (!formData.nom || !formData.format || !formData.categorie || !formData.stockInitial || !formData.prixUnitaire) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    console.log("Nouveau produit:", formData);
    setShowModal(false);
    setFormData({
      nom: "",
      format: "",
      categorie: "",
      stockInitial: "",
      stockMinimum: "",
      prixUnitaire: "",
      fournisseur: "",
    });
  };
  const produits = [
    {
      code: "P001",
      nom: "Eau Pure",
      format: "Sachet 500ml",
      stock: 1250,
      min: 200,
      statut: "bon",
      prix: 25,
      fournisseur: "Aqua Source",
    },
    {
      code: "P002",
      nom: "Eau Pure",
      format: "Bouteille 1.5L",
      stock: 45,
      min: 50,
      statut: "faible",
      prix: 150,
      fournisseur: "Aqua Source",
    },
    {
      code: "P003",
      nom: "Eau Minérale",
      format: "Bouteille 500ml",
      stock: 320,
      min: 100,
      statut: "bon",
      prix: 100,
      fournisseur: "Crystal Water",
    },
    {
      code: "P004",
      nom: "Eau Gazeuse",
      format: "Bouteille 330ml",
      stock: 180,
      min: 80,
      statut: "bon",
      prix: 200,
      fournisseur: "Sparkling Co",
    },
  ];

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

              <Package className="text-blue-600" size={22} />

              <h1 className="text-xl font-semibold text-gray-900">
                Gestion des Stocks
              </h1>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              <Plus size={16} />
              Ajouter un produit
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
            Inventaire
          </Link>
          <Link
            to="/admin/stocks/alertes"
            className="px-4 py-2 rounded-t-md text-sm font-medium bg-white text-black hover:bg-gray-50 relative"
          >
            Alertes
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              1
            </span>
          </Link>
          <Link
            to="/admin/stocks/mouvements"
            className="px-4 py-2 rounded-t-md text-sm font-medium bg-white text-black hover:bg-gray-50"
          >
            Mouvements
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* CARD HEADER */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  Inventaire des produits
                </h2>
                <p className="text-sm text-gray-500">
                  Gérez votre stock de produits en temps réel
                </p>
              </div>

              <button className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm bg-white text-black hover:bg-gray-50">
                <Download size={16} />
                Exporter
              </button>
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
                  placeholder="Rechercher un produit..."
                  className="w-full border rounded-md pl-9 pr-3 py-2 text-sm"
                />
              </div>

              <select className="border rounded-md px-3 py-2 text-sm w-48">
                <option>Toutes les catégories</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="text-left py-3">Code</th>
                  <th className="text-left">Produit</th>
                  <th className="text-left">Format</th>
                  <th className="text-left">Stock</th>
                  <th className="text-left">Statut</th>
                  <th className="text-left">Prix</th>
                  <th className="text-left">Fournisseur</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {produits.map((p) => (
                  <tr key={p.code} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{p.code}</td>
                    <td>{p.nom}</td>
                    <td>{p.format}</td>
                    <td>
                      <span className="font-semibold">{p.stock}</span>
                      <span className="text-gray-500 text-xs">
                        {" "}
                        / {p.min} min
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.statut === "bon"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.statut === "bon"
                          ? "Stock bon"
                          : "Stock faible"}
                      </span>
                    </td>
                    <td>{p.prix} FCFA</td>
                    <td>{p.fournisseur}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="border p-2 rounded-md hover:bg-gray-50">
                          <Pencil size={16} />
                        </button>
                        <button className="border p-2 rounded-md hover:bg-gray-50">
                          <Trash2 size={16} />
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-lg font-bold">Ajouter un nouveau produit</h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Remplissez les informations du produit à ajouter au stock.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}
            <div className="p-4 space-y-3">
              {/* Nom du produit & Format */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    placeholder="Ex: Eau Pure"
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Format
                  </label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) =>
                      setFormData({ ...formData, format: e.target.value })
                    }
                    placeholder="Ex: Bouteille 1.5L"
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Catégorie
                </label>
                <select
                  value={formData.categorie}
                  onChange={(e) =>
                    setFormData({ ...formData, categorie: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock initial & Stock minimum */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Stock initial
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
                    Stock minimum
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Prix unitaire (FCFA)
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
                    Fournisseur
                  </label>
                  <input
                    type="text"
                    value={formData.fournisseur}
                    onChange={(e) =>
                      setFormData({ ...formData, fournisseur: e.target.value })
                    }
                    placeholder="Nom du fournisseur"
                    className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 bg-white flex gap-3 p-4 border-t">
            
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium text-sm"
              >
                Ajouter le produit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}