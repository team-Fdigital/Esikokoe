import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Users, Key, Loader2 } from "lucide-react";
import { getAllUsers, createUser, updateUser, deleteUser, getAllMagasins } from "../../../apiClient";
import { useTranslation } from "react-i18next";

export default function Utilisateurs({ userRole, userStore }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [magasinsMap, setMagasinsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({ nom: '', email: '', role: 'VENDEUR', magasinId: userStore || '', motDePasse: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, magasinsRes] = await Promise.all([
        getAllUsers(),
        getAllMagasins()
      ]);
      
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.users || []));
      
      const mArray = Array.isArray(magasinsRes.data) ? magasinsRes.data : (magasinsRes.data?.magasins || []);
      const mMap = {};
      mArray.forEach(m => {
        mMap[m.idMagasin] = m.nom;
      });
      setMagasinsMap(mMap);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = userRole === 'SUPERADMIN' 
    ? users 
    : users.filter(u => u.magasinId === userStore && u.role !== 'SUPERADMIN');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (formData.idUtilisateur) {
        // eslint-disable-next-line no-unused-vars
        const { idUtilisateur, createdAt, magasin, ...updateData } = formData;
        if (!updateData.motDePasse) delete updateData.motDePasse;
        await updateUser(idUtilisateur, updateData);
      } else {
        await createUser(formData);
      }
      await fetchData();
      setIsModalOpen(false);
      setFormData({ nom: '', email: '', role: 'VENDEUR', magasinId: userStore || '', motDePasse: '' });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert(error.response?.data?.message || t("Save_User_Error"));
    } finally {
        setActionLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({ ...user, motDePasse: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("Confirm_Delete_User"))) {
      try {
        await deleteUser(id);
        await fetchData();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert(error.response?.data?.message || t("Delete_User_Error"));
      }
    }
  };

  const roleStyles = {
    'SUPERADMIN': 'bg-purple-100 text-purple-700 border-purple-200',
    'GERANT': 'bg-blue-100 text-blue-700 border-blue-200',
    'VENDEUR': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'MAGASINIER': 'bg-orange-100 text-orange-700 border-orange-200',
    'RESPONSABLE_ACHAT': 'bg-cyan-100 text-cyan-700 border-cyan-200'
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">{t("Loading_Users")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 inline-block text-gray-800">{t("Users_Management")}</h1>
          <p className="text-gray-500 text-sm mt-2">
            {userRole === 'SUPERADMIN' 
              ? t("Users_Desc_Superadmin")
              : t("Users_Desc_Gerant")}
          </p>
        </div>
        <button
          onClick={() => { setFormData({ nom: '', email: '', role: 'VENDEUR', magasinId: userStore || '', motDePasse: '' }); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20"
        >
          <Plus size={20} />
          {t("New_User")}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">{t("User")}</th>
                <th className="px-6 py-4 font-medium">{t("Role_Column")}</th>
                {userRole === 'SUPERADMIN' && <th className="px-6 py-4 font-medium">{t("Store_Column")}</th>}
                <th className="px-6 py-4 font-medium">{t("Creation_Date")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.idUtilisateur} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {(user.nom || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.nom}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${roleStyles[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  {userRole === 'SUPERADMIN' && (
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {magasinsMap[user.magasinId] || user.magasinId || t("None")}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(user)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(user.idUtilisateur)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={userRole === 'SUPERADMIN' ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                    <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    {t("No_Users_Found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">{formData.idUtilisateur ? t("Edit_User") : t("Add_User")}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("Full_Name")}</label>
                <input
                  type="text" required
                  value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder={t("Ex_Name")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("Email")}</label>
                <input
                  type="email" required
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder={t("Ex_Email")}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {userRole === 'SUPERADMIN' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("Role_Column")}</label>
                      <select
                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="VENDEUR">{t("Seller")}</option>
                        <option value="GERANT">{t("Manager_Admin")}</option>
                        <option value="MAGASINIER">{t("Storekeeper")}</option>
                        <option value="RESPONSABLE_ACHAT">{t("Purchasing_Manager")}</option>
                        <option value="SUPERADMIN">{t("Super_Admin")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("Store_Column")}</label>
                      <select
                        value={formData.magasinId || ''} onChange={e => setFormData({...formData, magasinId: e.target.value})}
                        disabled={formData.role === 'SUPERADMIN'}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                      >
                        <option value="">{t("Select_Store")}</option>
                        {Object.entries(magasinsMap).map(([id, nom]) => (
                          <option key={id} value={id}>{nom}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Password")} {formData.idUtilisateur && <span className="text-xs font-normal text-gray-400">{t("Leave_Empty")}</span>}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password" required={!formData.idUtilisateur}
                    value={formData.motDePasse || ''} onChange={e => setFormData({...formData, motDePasse: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" disabled={actionLoading} onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium">{t("Cancel")}</button>
                <button type="submit" disabled={actionLoading} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-md shadow-indigo-500/20 text-sm font-medium flex items-center gap-2">
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {formData.idUtilisateur ? t("Update") : t("Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
