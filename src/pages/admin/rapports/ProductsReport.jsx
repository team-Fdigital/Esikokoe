import { Package, ArrowLeft, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProduitsRapport } from "../../../apiClient";

export default function ProductsReport() {
    const handleExportPDF = () => {
      try {
        if (!classement || classement.length === 0) {
          alert('Aucune donnée à exporter');
          return;
        }
        const doc = new jsPDF();
        doc.text('Rapport des produits les plus vendus', 14, 16);
        const tableData = classement.map(product => [
          product.nom,
          product.quantite,
          product.ca?.toLocaleString() + ' FCFA',
          product.pourcentageCA + '%'
        ]);
        autoTable(doc, {
          head: [['Produit', 'Quantité vendue', 'Chiffre Affaires', '% du CA']],
          body: tableData,
          startY: 22,
        });
        doc.save('rapport_produits.pdf');
      } catch (err) {
        console.error('Erreur export PDF:', err);
        alert('Erreur lors de l\'exportation PDF. Voir la console.');
      }
    };
  const [classement, setClassement] = useState([]);
  const [performanceCategorie, setPerformanceCategorie] = useState({});
  const [rotationStock, setRotationStock] = useState({});

  useEffect(() => {
    getProduitsRapport().then(res => {
      const data = res.data;
      setClassement(data.classement || []);
      setPerformanceCategorie(data.performanceCategorie || {});
      setRotationStock(data.rotationStock || {});
    });
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
                className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <ArrowLeft size={16} />
                Retour
              </Link>

              <Package className="text-purple-600" size={24} />

              <h1 className="text-xl font-semibold text-gray-900">
                Rapports et Analyses
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <select className="border rounded-md px-3 py-2 text-sm">
                <option>Ce mois</option>
              </select>
              <button className="border p-2 rounded-md text-gray-800 bg-white" onClick={handleExportPDF}>
                <Download size={16} />
                Exporter PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* TABS */}
        <div className="flex gap-1 border-b">
          <Link
            to="/admin/rapports/sales"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Ventes
          </Link>
          <Link
            to="/admin/rapports/products"
            className="px-4 py-2 text-sm font-medium border-b-2 border-white hover:bg-gray-50"
          >
            Produits
          </Link>
          <Link
            to="/admin/rapports/clients"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Clients
          </Link>
          <Link
            to="/admin/rapports/financial"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            Financier
          </Link>
        </div>

        {/* PRODUITS BEST-SELLERS */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Produits les plus vendus</h2>
            <p className="text-sm text-gray-500 mt-1">Top 4 des ventes du mois</p>
          </div>

          <div className="p-6 space-y-4">
            {classement.slice(0, 4).map((product, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-600">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.nom}</h3>
                  <p className="text-xs text-gray-500">{product.quantite} unités vendues</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{product.ca?.toLocaleString()} FCFA</p>
                  <p className="text-xs text-gray-500">{product.pourcentageCA}% du CA</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PERFORMANCE ET ROTATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance par catégorie */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-6">Performance par catégorie</h3>
            <div className="space-y-6">
              {Object.entries(performanceCategorie).map(([cat, percent], idx) => (
                <div key={cat}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{cat}</span>
                    <span className="text-sm font-bold text-gray-900">{percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${idx === 0 ? "bg-blue-600" : "bg-green-600"}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rotation des stocks */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-6">Rotation des stocks</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Rotation moyenne</p>
                <p className="text-2xl font-bold text-gray-900">{rotationStock.moyenne ?? '-'} fois/mois</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Produit le plus rapide</p>
                <p className="text-2xl font-bold text-gray-900">{rotationStock.produitRapide ?? '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Stock dormant</p>
                <p className="text-2xl font-bold text-red-600">{rotationStock.stockDormant ? 'Oui' : 'Non'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}