import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Store, MapPin } from "lucide-react";
import { getAllMagasins, createMagasin, updateMagasin, deleteMagasin } from "../../../apiClient";
import { useTranslation } from "react-i18next";

export default function Magasins({ userRole }) {
  const { t } = useTranslation();
  const [magasins, setMagasins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nom: '', ville: '', adresse: '', telephone: '' });

  const fetchMagasins = async () => {
    setLoading(true);
    try {
      const res = await getAllMagasins();
      // Handle different response structures if necessary
      setMagasins(Array.isArray(res.data) ? res.data : (res.data.magasins || []));
    } catch (error) {
      console.error("Erreur lors du chargement des magasins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagasins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend expects 'adresse' as a string (which might include city info in backend schema but here it's split)
      // Backend schema: idMagasin, nom, adresse
      const payload = {
        nom: formData.nom,
        adresse: `${formData.adresse}, ${formData.ville}`,
        // Note: telephone is not in backend schema yet, but included in frontend mock
      };

      if (formData.idMagasin) {
        await updateMagasin(formData.idMagasin, payload);
      } else {
        await createMagasin(payload);
      }
      fetchMagasins();
      setIsModalOpen(false);
      setFormData({ nom: '', ville: '', adresse: '', telephone: '' });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du magasin:", error);
      alert(t("Save_Error"));
    }
  };

  const handleEdit = (magasin) => {
    // Split back adresse if possible, or just put all in adresse
    const [addr, city] = magasin.adresse.split(", ");
    setFormData({ 
      idMagasin: magasin.idMagasin, 
      nom: magasin.nom, 
      adresse: addr || magasin.adresse, 
      ville: city || '', 
      telephone: '' 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("Confirm_Delete_Store"))) {
      try {
        await deleteMagasin(id);
        fetchMagasins();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert(t("Delete_Store_Error"));
      }
    }
  };

  if (loading) return <div className="text-center py-10">{t("Loading_Stores")}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 inline-block text-gray-800 dark:text-white">{t("Stores_Management")}</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-2">{t("Stores_Desc")}</p>
        </div>
        {userRole === 'SUPERADMIN' && (
          <button
            onClick={() => { setFormData({ nom: '', ville: '', adresse: '', telephone: '' }); setIsModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus size={20} />
            {t("New_Store")}
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {magasins.map((magasin) => (
          <div key={magasin.idMagasin} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Store size={24} />
              </div>
              {userRole === 'SUPERADMIN' && (
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(magasin)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(magasin.idMagasin)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate" title={magasin.nom}>{magasin.nom}</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400 dark:text-slate-500" />
                <span>{magasin.adresse}</span>
              </div>
            </div>
          </div>
        ))}
        {magasins.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800">
                <p className="text-gray-400 dark:text-slate-500">{t("No_Stores_Found")}</p>
            </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up border dark:border-slate-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{formData.idMagasin ? t("Edit_Store") : t("Add_Store")}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t("Store_Name")}</label>
                <input
                   type="text" required
                  value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder={t("Ex_Main_Store")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t("City")}</label>
                  <input
                    type="text" required
                    value={formData.ville} onChange={e => setFormData({...formData, ville: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder={t("Ex_City")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t("Phone")}</label>
                  <input
                    type="text"
                    value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder={t("Ex_Phone")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t("Full_Address")}</label>
                <textarea
                  required rows={2}
                  value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder={t("Neighborhood_Street")}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-sm font-medium">{t("Cancel")}</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md shadow-blue-500/20 text-sm font-medium">
                  {formData.idMagasin ? t("Update") : t("Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
