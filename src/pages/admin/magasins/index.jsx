import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Store, MapPin } from "lucide-react";

export default function Magasins() {
  const [magasins, setMagasins] = useState([
    { id: 'magasin_1', nom: 'Magasin Principal Lome', ville: 'Lomé', adresse: 'Quartier Administratif', telephone: '228 90 00 00 01' },
    { id: 'magasin_2', nom: 'Magasin Kara', ville: 'Kara', adresse: 'Centre Ville', telephone: '228 90 00 00 02' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nom: '', ville: '', adresse: '', telephone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setMagasins(magasins.map(m => m.id === formData.id ? formData : m));
    } else {
      setMagasins([...magasins, { ...formData, id: `magasin_${Date.now()}` }]);
    }
    setIsModalOpen(false);
    setFormData({ nom: '', ville: '', adresse: '', telephone: '' });
  };

  const handleEdit = (magasin) => {
    setFormData(magasin);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce magasin ?')) {
      setMagasins(magasins.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 inline-block text-gray-800">Gestion des Magasins</h1>
          <p className="text-gray-500 text-sm mt-2">Gérez vos différentes succursales et points de vente.</p>
        </div>
        <button
          onClick={() => { setFormData({ nom: '', ville: '', adresse: '', telephone: '' }); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus size={20} />
          Nouveau Magasin
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {magasins.map((magasin) => (
          <div key={magasin.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Store size={24} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(magasin)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(magasin.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 truncate" title={magasin.nom}>{magasin.nom}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span>{magasin.ville}</span>
              </div>
              <div className="text-gray-500 pl-6 text-xs">{magasin.adresse}</div>
              <div className="text-gray-500 pl-6 text-xs font-medium">{magasin.telephone}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">{formData.id ? 'Modifier' : 'Ajouter'} un Magasin</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du magasin</label>
                <input
                  type="text" required
                  value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: Magasin Principal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text" required
                    value={formData.ville} onChange={e => setFormData({...formData, ville: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: Lomé"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="text" required
                    value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: 228 90..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                <textarea
                  required rows={2}
                  value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Quartier, Rue..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium">Annuler</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md shadow-blue-500/20 text-sm font-medium">
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
