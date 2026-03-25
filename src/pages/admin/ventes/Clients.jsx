import { ShoppingCart, ArrowLeft, User, Plus, X, Download, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createVente, getAllClients, createClient, getAllProduits } from "../../../apiClient";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Clients() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [newClient, setNewClient] = useState({ nomClient: "", telephone: "", adresse: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // States pour la modale de création de vente (partagés avec Ventes.jsx)
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

  useEffect(() => {
    getAllClients()
      .then((res) => {
        if (res.data && Array.isArray(res.data.clients)) {
          setClients(res.data.clients);
        } else {
          setClients([]);
        }
      })
      .finally(() => setLoading(false));

    // Charger la liste des produits pour la modale
    getAllProduits().then((res) => {
      if (res.data && Array.isArray(res.data.produits)) {
        setListeProduits(res.data.produits);
      }
    });
  }, []);

  // Export Excel
  const handleExportExcel = () => {
    const data = clients.map((c) => ({
      Nom: c.nomClient,
      Téléphone: c.telephone,
      Adresse: c.adresse,
      Commandes: c.nombreCommandes || 0,
      "Total Dépensé": (c.totalDepense || 0) + " FCFA",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clients");
    XLSX.writeFile(wb, "liste_clients.xlsx");
  };

  // Export PDF
  const handleExportPDF = () => {
    if (!clients.length) {
      alert(t("No_Data_To_Export"));
      return;
    }
    try {
      const doc = new jsPDF();
      doc.text(t("Customer_Database"), 14, 15);
      autoTable(doc, {
        head: [[t("Name"), t("Phone"), t("Address"), t("Orders"), t("Total_Spent")]],
        body: clients.map((c) => [
          c.nomClient,
          c.telephone,
          c.adresse,
          c.nombreCommandes || 0,
          `${(c.totalDepense || 0).toLocaleString()} FCFA`
        ]),
        startY: 20,
      });
      doc.save("liste_clients.pdf");
    } catch (err) {
      alert('Erreur export PDF: ' + err.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800 sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-6">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-800 px-4 py-2 rounded-xl transition-all"
              >
                <ArrowLeft size={18} />
                <span className="hidden md:inline">{t("Back")}</span>
              </Link>

              <div className="h-8 w-px bg-gray-200 dark:bg-slate-800 hidden md:block" />

              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <ShoppingCart className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  {t("Sales_Module_Title")}
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
              <Plus size={20} />
              <span className="hidden sm:inline">{t("New_Sale")}</span>
              <span className="inline sm:hidden">{t("Sale")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8 animate-fade-in">
        {/* TABS */}
        <div className="flex gap-2 p-1 bg-gray-200/50 dark:bg-slate-900/50 rounded-2xl w-fit">
          <Link
            to="/admin/ventes/ventes"
            className="px-6 py-2.5 text-sm font-bold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all"
          >
            {t("Sales")}
          </Link>

          <Link
            to="/admin/ventes/factures"
            className="px-6 py-2.5 text-sm font-bold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all"
          >
            {t("Invoices")}
          </Link>

          <Link
            to="/admin/ventes/clients"
            className="px-6 py-2.5 text-sm font-bold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-sm transition-all"
          >
            {t("Customers")}
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-6 md:p-8 border-b dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {t("Customer_Database")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mt-1">
                {t("Manage_Customers_History")}
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <button 
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  <Download size={18} />
                  {t("Export")}
                </button>
                {exportMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-xl z-10 p-2 animate-slide-up">
                    <button
                      className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl flex items-center gap-3 transition-colors"
                      onClick={() => { handleExportExcel(); setExportMenuOpen(false); }}
                    >
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      {t("Export_Excel")}
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl flex items-center gap-3 transition-colors"
                      onClick={() => { handleExportPDF(); setExportMenuOpen(false); }}
                    >
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                      {t("Export_PDF")}
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowAddClient(true)}
                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                <Plus size={20} />
                {t("Add_Customer")}
              </button>
            </div>
          </div>
          {loading ? (
            <div className="py-24 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <User size={36} className="text-gray-400 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Loading_Customers")}</h3>
              <div className="mt-4 flex gap-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            </div>
          ) : clients.length === 0 ? (
            <div className="py-24 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <User size={36} className="text-gray-400 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("No_Customers_Recorded")}</h3>
              <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">{t("No_Data_Desc")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-500">
                    <th className="px-8 py-5">{t("Name")}</th>
                    <th className="px-6 py-5">{t("Phone")}</th>
                    <th className="px-6 py-5">{t("Address")}</th>
                    <th className="px-6 py-5 text-right">{t("Orders")}</th>
                    <th className="px-8 py-5 text-right">{t("Total_Spent")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {clients.map((c) => (
                    <tr key={c.idClient} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 font-bold border border-gray-200 dark:border-slate-700 transition-transform group-hover:scale-110">
                            {c.nomClient.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm">{c.nomClient}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-600 dark:text-slate-300">{c.telephone}</td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-600 dark:text-slate-300 max-w-xs truncate">{c.adresse}</td>
                      <td className="px-6 py-5 text-right">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700">
                          {c.nombreCommandes || 0}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black">
                            <TrendingUp size={16} />
                            <span>{(c.totalDepense || 0).toLocaleString()}</span>
                            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold">FCFA</span>
                          </div>
                          <div className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Total_Accumulated")}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MODAL AJOUT CLIENT */}
          {showAddClient && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-gray-100 dark:border-slate-800">
                <div className="px-8 py-6 border-b dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/30">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t("Add_Customer")}</h2>
                  <button onClick={() => setShowAddClient(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-white transition-all">
                    <X size={20} />
                  </button>
                </div>

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
                      alert(t("Customer_Creation_Error"));
                    }
                    setAddLoading(false);
                  }}
                  className="p-8 space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Name")}</label>
                    <input
                      type="text"
                      required
                      value={newClient.nomClient}
                      onChange={(e) => setNewClient({ ...newClient, nomClient: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      placeholder={t("Full_Name")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Phone")}</label>
                    <input
                      type="text"
                      required
                      value={newClient.telephone}
                      onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      placeholder={t("Phone_Placeholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Address")}</label>
                    <input
                      type="text"
                      required
                      value={newClient.adresse}
                      onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      placeholder={t("Full_Address")}
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddClient(false)}
                      className="flex-1 px-6 py-3 border dark:border-slate-800 rounded-xl font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={addLoading}
                      className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                    >
                      {addLoading ? t("Adding") : t("Add")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL COMPLET (NOUVELLE VENTE) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up border border-gray-100 dark:border-slate-800">
            {/* HEADER */}
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                  <Plus className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t("Create_New_Sale")}</h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-0.5">
                    {t("Sale_Information")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-2xl text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-white transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            {/* FORM BODY */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* INFORMATIONS CLIENT */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                    <User className="text-indigo-600 dark:text-indigo-400" size={16} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{t("Customer_Info")}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Customer_Name")}</label>
                    <input
                      type="text"
                      placeholder={t("Full_Name_or_Company")}
                      value={clientInfo.nom}
                      onChange={(e) => setClientInfo({ ...clientInfo, nom: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Phone")}</label>
                    <input
                      type="tel"
                      placeholder={t("Phone_Placeholder")}
                      value={clientInfo.telephone}
                      onChange={(e) => setClientInfo({ ...clientInfo, telephone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Address")}</label>
                  <textarea
                    placeholder={t("Full_Address")}
                    value={clientInfo.adresse}
                    onChange={(e) => setClientInfo({ ...clientInfo, adresse: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none"
                    rows="2"
                  />
                </div>
              </section>

              {/* PRODUITS */}
              <section className="space-y-6">
                <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/30 p-4 rounded-2xl border dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                      <ShoppingCart className="text-emerald-600 dark:text-emerald-400" size={16} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{t("Products")}</h3>
                  </div>
                  <button
                    onClick={() => setProduits([...produits, { id: Date.now(), produit: "", quantite: 0, prixUnitaire: 0 }])}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                  >
                    <Plus size={16} />
                    {t("Add_Product")}
                  </button>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar border dark:border-slate-800 rounded-2xl p-4 bg-gray-50/30 dark:bg-slate-900/20">
                  {produits.map((p, idx) => (
                    <div key={p.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 shadow-sm transition-all hover:shadow-md animate-slide-up">
                      <div className="md:col-span-4 space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Product")}</label>
                        <select
                          value={p.produit}
                          onChange={(e) => {
                            const newProduits = [...produits];
                            newProduits[idx].produit = e.target.value;
                            setProduits(newProduits);
                          }}
                          className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                        >
                          <option value="">{t("Select")}</option>
                          {listeProduits.map((prod) => (
                            <option key={prod.id} value={prod.nom}>
                              {prod.nom}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Quantity")}</label>
                        <input
                          type="number"
                          min="0"
                          value={p.quantite}
                          onChange={(e) => {
                            const newProduits = [...produits];
                            newProduits[idx].quantite = parseFloat(e.target.value) || 0;
                            setProduits(newProduits);
                          }}
                          className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Unit_Price")}</label>
                        <input
                          type="number"
                          min="0"
                          value={p.prixUnitaire}
                          onChange={(e) => {
                            const newProduits = [...produits];
                            newProduits[idx].prixUnitaire = parseFloat(e.target.value) || 0;
                            setProduits(newProduits);
                          }}
                          className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Total")}</label>
                        <div className="text-sm font-bold text-gray-900 dark:text-white py-2 px-3 bg-gray-100 dark:bg-slate-900 rounded-lg border dark:border-slate-700 flex justify-between items-center">
                          <span>{(p.quantite * p.prixUnitaire).toLocaleString()}</span>
                          <span className="text-[8px] text-gray-400">FCFA</span>
                        </div>
                      </div>
                      <div className="md:col-span-1 flex justify-center pb-1">
                        <button
                          onClick={() => setProduits(produits.filter((_, i) => i !== idx))}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {produits.length === 0 && (
                    <div className="py-12 text-center bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed dark:border-slate-700">
                      <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-700 mb-2" />
                      <p className="text-gray-500 dark:text-slate-500 font-medium">{t("No_Product_Added")}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* PAIEMENT & RÉSUMÉ */}
              <section className="grid md:grid-cols-2 gap-10 bg-indigo-50/30 dark:bg-indigo-900/10 p-8 rounded-3xl border dark:border-indigo-900/30">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Shield className="text-indigo-600 dark:text-indigo-400" size={16} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{t("Payment")}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Payment_Method")}</label>
                    <select
                      value={modePaiement}
                      onChange={(e) => setModePaiement(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                    >
                      <option value="">{t("Select")}</option>
                      <option value="Espèces">{t("Cash")}</option>
                      <option value="Mobile Money">{t("Mobile_Money")}</option>
                      <option value="Chèque">{t("Check")}</option>
                      <option value="Virement">{t("Bank_Transfer")}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={16} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{t("Resume")}</h3>
                  </div>

                  <div className="space-y-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">
                      <span>{t("Subtotal")}</span>
                      <span>{produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0).toLocaleString()} <span className="text-[10px] opacity-70">FCFA</span></span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">
                      <span>{t("VAT_18")}</span>
                      <span>{(produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0) * 0.18).toLocaleString()} <span className="text-[10px] opacity-70">FCFA</span></span>
                    </div>
                    <div className="pt-3 border-t dark:border-slate-700 flex justify-between items-center">
                      <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{t("Total")}</span>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {(produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0) * 1.18).toLocaleString()}
                        <span className="text-xs ml-1 font-bold">FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-8 border-t dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-8 py-4 border dark:border-slate-700 rounded-2xl font-black text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 uppercase tracking-widest text-xs transition-all"
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
                className="flex-[2] px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-slate-100 transition-all shadow-xl active:scale-[0.98]"
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
