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
  User,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllVentes, createVente, getAllProduits } from "../../../apiClient";
import { getVenteDetail } from "../../../apiClient";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Ventes() {
  const { t } = useTranslation();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
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

  // Export Excel
  const handleExportExcel = () => {
    const data = filteredVentes.map((v) => ({
      Facture: v.numeroFacture || v.id,
      Date: v.date ? new Date(v.date).toLocaleString() : "",
      Client: v.client,
      Montant: v.montant + " FCFA",
      Paiement: v.modePaiement || v.paiement,
      Statut: v.statut || "Payé",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventes");
    XLSX.writeFile(wb, "historique_ventes.xlsx");
  };

  // Export PDF
  const handleExportPDF = () => {
    if (!filteredVentes.length) {
      alert(t("No_Data_To_Export"));
      return;
    }
    try {
      const doc = new jsPDF();
      doc.text(t("Sales_History"), 14, 15);
      autoTable(doc, {
        head: [[t("Invoice_No"), t("Date"), t("Customer"), t("Amount"), t("Payment"), t("Status")]],
        body: filteredVentes.map((v) => [
          v.numeroFacture || v.id,
          v.date ? new Date(v.date).toLocaleString() : "",
          v.client,
          `${v.montant?.toLocaleString()} FCFA`,
          v.modePaiement || v.paiement,
          v.statut || t("Paid")
        ]),
        startY: 20,
      });
      doc.save("historique_ventes.pdf");
    } catch (err) {
      alert('Erreur export PDF: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800 px-2 md:px-3 py-1.5 md:py-2 rounded-md text-gray-700 dark:text-slate-300 transition-colors"
              >
                <ArrowLeft size={16} />
                {t("Back")}
              </Link>

              <ShoppingCart className="text-green-600 dark:text-green-500" size={22} />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("Sales_Module_Title")}
              </h1>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 md:gap-2 text-xs md:text-sm bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md"
            >
              <Plus size={16} className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">{t("New_Sale")}</span>
              <span className="inline sm:hidden">{t("Sale")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
        {loading && (
          <div className="flex justify-center py-10">
            <span>{t("Loading_Sales")}</span>
          </div>
        )}
        {/* TABS */}
        <div className="flex gap-1 border-b dark:border-slate-800">
          <Link
            to="/admin/ventes/ventes"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-lg transition-colors"
          >
            {t("Sales")}
          </Link>

          <Link
            to="/admin/ventes/factures"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 dark:text-slate-400 border-b-2 border-transparent hover:bg-white dark:hover:bg-slate-900 rounded-t-lg transition-colors"
          >
            {t("Invoices")}
          </Link>

          <Link
            to="/admin/ventes/clients"
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 dark:text-slate-400 border-b-2 border-transparent hover:bg-white dark:hover:bg-slate-900 rounded-t-lg transition-colors"
          >
            {t("Customers")}
          </Link>
        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-4 md:p-6 border-b dark:border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-slate-100">{t("Sales_History")}</h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400">
                  {t("All_Transactions")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-3 text-gray-400 dark:text-slate-500"
                    size={16}
                  />
                  <input
                    placeholder={t("Search")}
                    className="border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-slate-100 transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  className="border dark:border-slate-700 p-2 rounded-xl text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                  onClick={() => {
                    const date = prompt(t("Enter_Date_Filter"));
                    if (date) setDateFilter(date);
                  }}
                >
                  <Calendar size={16} />
                  <span className="hidden lg:inline">{t("Filter_By_Date")}</span>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setExportMenuOpen(!exportMenuOpen)}
                    className="flex items-center justify-center gap-1 md:gap-2 border dark:border-slate-700 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
                  >
                    <Download size={16} />
                    {t("Export")}
                  </button>
                  {exportMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-2xl z-50 p-2 animate-fade-in">
                      <button
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 text-gray-700 dark:text-slate-200 transition-colors"
                        onClick={() => { handleExportExcel(); setExportMenuOpen(false); }}
                      >
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                        {t("Export_Excel")}
                      </button>
                      <button
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 text-gray-700 dark:text-slate-200 transition-colors"
                        onClick={() => { handleExportPDF(); setExportMenuOpen(false); }}
                      >
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                        {t("Export_PDF")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-[800px]">
              <thead className="border-b dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase tracking-tighter text-[10px] font-bold">
                <tr>
                  <th className="text-left py-4 px-2">{t("Invoice_No")}</th>
                  <th className="text-left px-2">{t("Date")}</th>
                  <th className="text-left px-2">{t("Customer")}</th>
                  <th className="text-left px-2">{t("Amount")}</th>
                  <th className="text-left px-2">{t("Payment")}</th>
                  <th className="text-left px-2">{t("Status")}</th>
                  <th className="text-left px-2">{t("Actions")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredVentes.map((v) => {
                  const dateObj = v.date ? new Date(v.date) : null;
                  const dateStr = dateObj ? dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-';
                  const montantStr = v.montant ? v.montant.toLocaleString('fr-FR') + ' FCFA' : '-';
                  return (
                    <tr key={v.idVente || v.id || v.numeroFacture} className="border-b dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-2 font-bold text-gray-800 dark:text-slate-200">{v.numeroFacture || v.id}</td>
                      <td className="px-2 text-gray-600 dark:text-slate-400">{dateStr}</td>
                      <td className="px-2 text-gray-700 dark:text-slate-300 font-medium">{v.client}</td>
                      <td className="px-2 font-bold text-indigo-600 dark:text-indigo-400">{montantStr}</td>
                      <td className="px-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                          <CreditCard size={16} className="text-gray-400 dark:text-slate-500" />
                          {v.modePaiement || v.paiement || '-'}
                        </div>
                      </td>
                      <td className="px-2">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {v.statut || t("Paid")}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="border dark:border-slate-700 p-2 rounded-lg text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                            onClick={async () => {
                              setSelectedSale(null);
                              setShowDetailModal(true);
                              setLoadingDetail(true);
                              try {
                                const res = await getVenteDetail(v.idVente || v.id);
                                setSelectedSale(res.data || res);
                              } catch (err) {
                                console.log(t("Cannot_Load_Sale_Detail"), err);
                                alert(t("Cannot_Load_Sale_Detail"));
                              }
                              setLoadingDetail(false);
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="border dark:border-slate-700 p-2 rounded-lg text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                            onClick={async () => {
                              try {
                                const venteId = v.idVente ? v.idVente : v.id;
                                if (!venteId) {
                                  alert(t("Missing_Sale_ID"));
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
                                  alert(t("Print_Error_API"));
                                  return;
                                }
                                // Mapping robuste pour les produits
                                const produitsList = Array.isArray(venteDetail.produits) ? venteDetail.produits : (Array.isArray(venteDetail.items) ? venteDetail.items : (Array.isArray(venteDetail.lignes) ? venteDetail.lignes : (Array.isArray(venteDetail.details) ? venteDetail.details : [])));
                                const printWindow = window.open('', '', 'width=800,height=600');
                                if (!printWindow) {
                                  alert(t("Print_Popup_Blocked"));
                                  return;
                                }
                                printWindow.document.write('<html><head><title>' + t("Print_Sale") + '</title>');
                                printWindow.document.write('<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:8px;} th{background:#f3f3f3;}</style>');
                                printWindow.document.write('</head><body>');
                                printWindow.document.write(`
                                  <h2 style='font-size:1.2em;font-weight:bold;margin-bottom:1em;'>${t("Sale_Detail")} ${venteDetail.numeroFacture || venteDetail.idVente || venteDetail.id || ''}</h2>
                                  <div style='display:flex;justify-content:space-between;margin-bottom:1em;'>
                                    <div>
                                      <h3 style='font-weight:bold;'>${t("Customer_Info")}</h3>
                                      <div>${t("Name_Colon")} <b>${venteDetail.client || '-'}</b></div>
                                      <div>${t("Phone_Colon")} <b>${venteDetail.telephone || '-'}</b></div>
                                      <div>${t("Address_Colon")} <b>${venteDetail.adresse || '-'}</b></div>
                                    </div>
                                    <div style='text-align:right;'>
                                      <h3 style='font-weight:bold;'>${t("Sale_Info")}</h3>
                                      <div>${t("Date_Colon")} <b>${venteDetail.date ? new Date(venteDetail.date).toLocaleString('fr-FR') : '-'}</b></div>
                                      <div>${t("Payment_Colon")} <b>${venteDetail.modePaiement || venteDetail.paiement || '-'}</b></div>
                                      <div>${t("Status_Colon")} <b>${venteDetail.statut || t("Paid")}</b></div>
                                    </div>
                                  </div>
                                  <h3 style='font-weight:bold;margin-bottom:0.5em;'>${t("Products_Sold")}</h3>
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>${t("Product")}</th>
                                        <th>${t("Quantity")}</th>
                                        <th>${t("Unit_Price")}</th>
                                        <th>${t("Total")}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      ${produitsList.length === 0 ? `<tr><td colspan='4' style='text-align:center;color:#888;padding:1em;'>${t("No_Product")}</td></tr>` : produitsList.map((p, idx) => `

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
                                      <div><b>${t("Subtotal_Colon")}</b></div>
                                      <div><b>${t("VAT_Colon")}</b></div>
                                      <div style='font-size:1.1em;font-weight:bold;'>${t("Total")}:</div>
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
                                alert(t("Print_Error") + " " + (err.message || err));
                              }
                            }}
                            title={t("Print_Sale_Tooltip")}
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
                {t("No_Sales_Recorded")}
              </div>
            )}
          </div>
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
                  <div className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{t("Customer_Info")}</div>
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
                    <div className="text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{t("Products")}</div>
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
                            const codeProduit = e.target.value;
                            const produitTrouve = listeProduits.find(lp => lp.codeProduit === codeProduit);
                            const copy = [...produits];
                            copy[idx].produit = codeProduit;
                            if (produitTrouve) {
                              copy[idx].prixUnitaire = produitTrouve.prixUnitaire;
                            } else {
                              copy[idx].prixUnitaire = 0;
                            }
                            setProduits(copy);
                          }}
                          className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                        >
                          <option value="">{t("Select")}</option>
                          {listeProduits.map((lp) => (
                            <option key={lp.codeProduit} value={lp.codeProduit}>
                              {lp.nomProduit}
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
                      <CreditCard className="text-indigo-600 dark:text-indigo-400" size={16} />
                    </div>
                    <div className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{t("Payment")}</div>
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
                    <div className="text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{t("Resume")}</div>
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
                    console.log(t("Create_Sale_Error") + " " + (err?.response?.data?.message || err.message || err));
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


      {/* MODAL DÉTAIL VENTE */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b dark:border-slate-800 gap-2 bg-gray-50/50 dark:bg-slate-800/50 transition-colors">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{t("Sale_Detail")}</h2>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-1 tracking-wider uppercase">#{selectedSale?.numeroFacture || selectedSale?.id || ''}</p>
              </div>
              <button 
                onClick={() => { setShowDetailModal(false); setSelectedSale(null); }} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-sm"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-8">
              {loadingDetail && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-xs">
                    {t("Loading_Sale_Details")}
                  </div>
                </div>
              )}
              {!loadingDetail && selectedSale && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-2xl border dark:border-slate-800/50 transition-colors">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-4">{t("Customer_Info")}</h3>
                      <div className="text-sm space-y-3">
                        <div className="flex flex-col"><span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">{t("Name")}</span> <span className="text-gray-800 dark:text-slate-100 font-medium">{selectedSale.client || '-'}</span></div>
                        <div className="flex flex-col"><span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">{t("Phone")}</span> <span className="text-gray-800 dark:text-slate-100 font-medium">{selectedSale.telephone || '-'}</span></div>
                        <div className="flex flex-col"><span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">{t("Address")}</span> <span className="text-gray-800 dark:text-slate-100 font-medium">{selectedSale.adresse || '-'}</span></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-2xl border dark:border-slate-800/50 transition-colors">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-4">{t("Sale_Info")}</h3>
                      <div className="text-sm space-y-3">
                        <div className="flex flex-col items-end"><span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">{t("Date")}</span> <span className="text-gray-800 dark:text-slate-100 font-medium">{selectedSale.date ? new Date(selectedSale.date).toLocaleString('fr-FR') : '-'}</span></div>
                        <div className="flex flex-col items-end"><span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">{t("Payment")}</span> <span className="text-gray-800 dark:text-slate-100 font-medium">{selectedSale.modePaiement || selectedSale.paiement || '-'}</span></div>
                        <div className="flex flex-col items-end"><span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">{t("Status")}</span> <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1">{selectedSale.statut || t("Paid")}</span></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-4">{t("Products_Sold")}</h3>
                    <div className="overflow-x-auto rounded-xl border dark:border-slate-800">
                      {(() => {
                        // Cherche le bon tableau de produits
                        const produitsList = selectedSale.produits || selectedSale.items || selectedSale.lignes || selectedSale.details || [];
                        return (
                          <table className="w-full min-w-[400px] text-sm">
                            <thead className="bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-800 transition-colors">
                              <tr className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">
                                <th className="text-left px-4 py-3">{t("Product")}</th>
                                <th className="text-right px-4 py-3">{t("Quantity")}</th>
                                <th className="text-right px-4 py-3">{t("Unit_Price")}</th>
                                <th className="text-right px-4 py-3">{t("Total")}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors">
                              {produitsList.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-400 dark:text-slate-500 italic">{t("No_Product")}</td></tr>
                              ) : produitsList.map((p, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                  <td className="px-4 py-3 text-gray-800 dark:text-slate-200 font-medium">{p.nomProduit || p.productName || p.produit || p.name || '-'}</td>
                                  <td className="px-4 py-3 text-right text-gray-600 dark:text-slate-400 italic">x{p.quantite ?? p.qty ?? p.qte ?? '-'}</td>
                                  <td className="px-4 py-3 text-right text-gray-700 dark:text-slate-300">{(p.prixUnitaire ?? p.unitPrice ?? p.price ?? 0)?.toLocaleString()} F</td>
                                  <td className="px-4 py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">{((p.quantite ?? p.qty ?? p.qte ?? 0) * (p.prixUnitaire ?? p.unitPrice ?? p.price ?? 0))?.toLocaleString()} F</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        );
                      })()}
                    </div>
                    <div className="mt-8 bg-indigo-600 dark:bg-indigo-900/40 p-6 rounded-2xl text-white dark:text-indigo-100 shadow-xl shadow-indigo-500/10 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 opacity-80 text-sm">
                          <div className="flex justify-between md:justify-start md:gap-8">
                            <span className="font-medium">{t("Subtotal_Colon")}</span>
                            <span>{selectedSale.sousTotal?.toLocaleString() || selectedSale.montant || '-'} FCFA</span>
                          </div>
                          <div className="flex justify-between md:justify-start md:gap-8">
                            <span className="font-medium">{t("VAT_Colon")}</span>
                            <span>{selectedSale.tva?.toLocaleString() || ((selectedSale.montant || 0) * 0.18)?.toLocaleString()} FCFA</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t("Total")}</span>
                          <div className="text-2xl font-black">{selectedSale.total?.toLocaleString() || selectedSale.montant?.toLocaleString() || '-'} FCFA</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-6 border-t dark:border-slate-800 flex justify-end transition-colors">
              <button 
                onClick={() => { setShowDetailModal(false); setSelectedSale(null); }} 
                className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-8 py-2.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
              >
                {t("Close") || "Fermer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
