import { ShoppingCart, ArrowLeft, FileText, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createVente, getAllFactures } from "../../../apiClient";
import { useTranslation } from "react-i18next";

export default function Factures() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllFactures()
      .then((res) => {
        if (res.data && Array.isArray(res.data.factures)) {
          setFactures(res.data.factures);
        } else {
          setFactures([]);
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
                {t("Back")}
              </Link>

              <ShoppingCart className="text-green-600" size={22} />

              <h1 className="text-xl font-semibold text-gray-900">
                {t("Sales_Module_Title")}
              </h1>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 md:gap-2 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-md">
              <Plus size={16} />
              <span className="hidden sm:inline">{t("New_Sale")}</span>
              <span className="inline sm:hidden">{t("Sale")}</span>
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
            {t("Sales")}
          </Link>

          <Link
            to="/admin/ventes/factures"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium border-b-2 border-white hover:bg-gray-50"
          >
            {t("Invoices")}
          </Link>

          <Link
            to="/admin/ventes/clients"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 border-b-2 border-transparent hover:bg-gray-50"
          >
            {t("Customers")}
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold">
              {t("Invoice_Management")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("Create_Manage_Invoices")}
            </p>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center text-center text-gray-500">
              <FileText size={48} className="mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-700">{t("Loading_Invoices")}</h3>
            </div>
          ) : factures.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center text-gray-500">
              <FileText size={48} className="mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-700">{t("No_Invoices_Recorded")}</h3>
            </div>
          ) : (
            <div className="overflow-x-auto p-4 md:p-6">
              <table className="w-full text-xs md:text-sm min-w-[600px]">
                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="text-left py-3">{t("Invoice_No")}</th>
                    <th className="text-left">{t("Date")}</th>
                    <th className="text-left">{t("Amount")}</th>
                    <th className="text-left">{t("Customer")}</th>
                  </tr>
                </thead>
                <tbody>
                  {factures.map((f) => (
                    <tr key={f.idFacture} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{f.numeroFacture}</td>
                      <td>{new Date(f.dateFacture).toLocaleString()}</td>
                      <td className="font-semibold">{f.montant} FCFA</td>
                      <td>
                        {f.client === "Commande non liée" || f.client === "Client inconnu" || f.client === "N/A" || f.client === "Aucun client" || f.client === t("Unlinked_Order") || f.client === t("Unknown_Customer") || f.client === t("No_Customer")
                          ? <span className="text-gray-400 italic">{f.client === "Commande non liée" ? t("Unlinked_Order") : f.client === "Client inconnu" ? t("Unknown_Customer") : f.client === "Aucun client" ? t("No_Customer") : f.client}</span>
                          : f.client}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <h2 className="text-lg font-bold">{t("Create_New_Sale")}</h2>
                <p className="text-xs text-gray-600 mt-1">
                  {t("Sale_Information")}
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
                <h3 className="text-sm font-semibold mb-3">{t("Customer_Info")}</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">{t("Customer_Name")}</label>
                      <input
                        type="text"
                        placeholder={t("Full_Name_or_Company")}
                        value={clientInfo.nom}
                        onChange={(e) => setClientInfo({ ...clientInfo, nom: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">{t("Phone")}</label>
                      <input
                        type="tel"
                        placeholder={t("Phone_Placeholder")}
                        value={clientInfo.telephone}
                        onChange={(e) => setClientInfo({ ...clientInfo, telephone: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">{t("Address")}</label>
                    <textarea
                      placeholder={t("Full_Address")}
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
                  <h3 className="text-sm font-semibold">{t("Products")}</h3>
                  <button
                    onClick={() => setProduits([...produits, { id: Date.now(), produit: "", quantite: 0, prixUnitaire: 0 }])}
                    className="text-white text-sm font-medium flex items-center gap-1"
                  >
                    <Plus size={16} />
                    {t("Add_Product")}
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {produits.map((p, idx) => (
                    <div key={p.id} className="grid grid-cols-5 gap-2 items-end">
                      <div>
                        <label className="block text-xs font-semibold mb-1">{t("Product")}</label>
                        <select
                          value={p.produit}
                          onChange={(e) => {
                            const newProduits = [...produits];
                            newProduits[idx].produit = e.target.value;
                            setProduits(newProduits);
                          }}
                          className="w-full px-2 py-1.5 text-xs border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                        >
                          <option value="">{t("Select")}</option>
                          {listeProduits.map((prod) => (
                            <option key={prod.id} value={prod.nom}>
                              {prod.nom}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">{t("Quantity")}</label>
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
                        <label className="block text-xs font-semibold mb-1">{t("Unit_Price")}</label>
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
                        <label className="block text-xs font-semibold mb-1">{t("Total")}</label>
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
                <h3 className="text-sm font-semibold mb-3">{t("Payment")}</h3>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">{t("Payment_Method")}</label>
                  <select
                    value={modePaiement}
                    onChange={(e) => setModePaiement(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  >
                    <option value="">{t("Select")}</option>
                    <option value="Espèces">{t("Cash")}</option>
                    <option value="Mobile Money">{t("Mobile_Money")}</option>
                    <option value="Chèque">{t("Check")}</option>
                    <option value="Virement">{t("Bank_Transfer")}</option>
                  </select>
                </div>

                {/* TOTALS */}
                <div className="mt-4 space-y-2 border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span>{t("Subtotal_Colon")}</span>
                    <span>{produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("VAT_18")}</span>
                    <span>{(produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0) * 0.18).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>{t("Total")}:</span>
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
                {t("Cancel")}
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
                    alert(t("Create_Sale_Error"));
                  }
                }}
                className="flex-1 px-4 py-2 text-sm bg-black hover:bg-gray-800 text-white rounded-lg font-medium"
              >
                {t("Create_Sale_Button")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
