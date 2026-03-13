import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Users, Shield, Briefcase, Key } from "lucide-react";

export default function Utilisateurs({ userRole, userStore }) {
  const [users, setUsers] = useState([
    { id: 'usr_1', nom: 'Gérant Lomé', email: 'gerant.lome@test.com', role: 'ADMIN', magasin_id: 'magasin_1', statut: 'Actif' },
    { id: 'usr_2', nom: 'Vendeur A (Lomé)', email: 'vendeur.lome1@test.com', role: 'VENDEUR', magasin_id: 'magasin_1', statut: 'Actif' },
    { id: 'usr_3', nom: 'Gérant Kara', email: 'gerant.kara@test.com', role: 'ADMIN', magasin_id: 'magasin_2', statut: 'Actif' },
    { id: 'usr_4', nom: 'Vendeur B (Kara)', email: 'vendeur.kara1@test.com', role: 'VENDEUR', magasin_id: 'magasin_2', statut: 'Inactif' }
  ]);
  
  const [magasinsMap, setMagasinsMap] = useState({
    'magasin_1': 'Magasin Principal Lome',
    'magasin_2': 'Magasin Kara'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nom: '', email: '', role: 'VENDEUR', magasin_id: userStore || 'magasin_1', password: '' });

  // Filter users based on role
  const filteredUsers = userRole === 'SUPERADMIN' 
    ? users 
    : users.filter(u => u.magasin_id === userStore && u.role === 'VENDEUR');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setUsers(users.map(u => u.id === formData.id ? formData : u));
    } else {
      setUsers([...users, { ...formData, id: `usr_${Date.now()}`, statut: 'Actif' }]);
    }
    setIsModalOpen(false);
    setFormData({ nom: '', email: '', role: 'VENDEUR', magasin_id: userStore || 'magasin_1', password: '' });
  };

  const handleEdit = (user) => {
    setFormData({ ...user, password: '' });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment désactiver/supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const roleStyles = {
    'SUPERADMIN': 'bg-purple-100 text-purple-700 border-purple-200',
    'ADMIN': 'bg-blue-100 text-blue-700 border-blue-200',
    'VENDEUR': 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 inline-block text-gray-800">Gestion des Utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-2">
            {userRole === 'SUPERADMIN' 
              ? "Gérez l'ensemble du personnel, gérants et vendeurs de tous les magasins."
              : "Gérez les vendeurs assignés à votre magasin."}
          </p>
        </div>
        <button
          onClick={() => { setFormData({ nom: '', email: '', role: 'VENDEUR', magasin_id: userStore || 'magasin_1', password: '' }); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20"
        >
          <Plus size={20} />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Utilisateur</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
                {userRole === 'SUPERADMIN' && <th className="px-6 py-4 font-medium">Magasin</th>}
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {user.nom.charAt(0).toUpperCase()}
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
                      {magasinsMap[user.magasin_id] || 'Inconnu'}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.statut === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.statut === 'Actif' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {user.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(user)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">{formData.id ? 'Modifier' : 'Ajouter'} un Utilisateur</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text" required
                  value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email" required
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="jean.dupont@exemple.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {userRole === 'SUPERADMIN' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                      <select
                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="VENDEUR">Vendeur</option>
                        <option value="ADMIN">Admin (Gérant)</option>
                        <option value="SUPERADMIN">Super Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Magasin</label>
                      <select
                        value={formData.magasin_id} onChange={e => setFormData({...formData, magasin_id: e.target.value})}
                        disabled={formData.role === 'SUPERADMIN'}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                      >
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
                  Mot de passe {formData.id && <span className="text-xs font-normal text-gray-400">(Laisser vide pour ne pas modifier)</span>}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password" required={!formData.id}
                    value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium">Annuler</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-md shadow-indigo-500/20 text-sm font-medium">
                  {formData.id ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
