import React, { useState } from 'react';
import { Bell, Lock, Globe, Palette, MonitorSmartphone, ShieldCheck } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Général', icon: MonitorSmartphone },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paramètres du système</h2>
        <p className="text-muted-foreground">
          Gérez la configuration globale de votre espace d'administration.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Menu latéral */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={activeTab === tab.id ? 'text-blue-700' : 'text-gray-400'} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Contenu principal */}
        <div className="flex-1 bg-white border rounded-xl shadow-sm overflow-hidden">
          {activeTab === 'general' && (
            <div className="p-6">
              <h3 className="text-lg font-bold mb-6 text-gray-900 border-b pb-4">Paramètres Généraux</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Globe size={16} /> Langue de l'interface
                  </label>
                  <select className="w-full md:w-1/2 h-10 px-3 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Palette size={16} /> Thème de l'interface
                  </label>
                  <select className="w-full md:w-1/2 h-10 px-3 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="system">Système (Auto)</option>
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition">
                    Sauvegarder les préférences
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-6">
              <h3 className="text-lg font-bold mb-6 text-gray-900 border-b pb-4">Sécurité & Connexion</h3>
              <div className="space-y-6">
                
                <div className="p-4 border border-red-100 bg-red-50 rounded-lg flex items-start gap-4">
                  <ShieldCheck className="text-red-600 w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-red-900">Mot de passe</h4>
                    <p className="text-sm text-red-800 mt-1 mb-3">Il est recommandé de changer de mot de passe tous les 3 mois.</p>
                    <button className="px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-medium rounded-md hover:bg-red-50">
                      Modifier le mot de passe
                    </button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">Authentification à deux facteurs (2FA)</h4>
                      <p className="text-sm text-gray-500">Ajoute une couche de sécurité supplémentaire à votre compte.</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">Désactivé</span>
                  </div>
                  <button className="mt-2 text-blue-600 text-sm font-medium hover:underline">
                    Configurer l'authentification
                  </button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Appareils connectés</h4>
                  <ul className="space-y-3 mt-3">
                    <li className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <MonitorSmartphone className="text-gray-400 w-5 h-5" />
                        <div>
                          <p className="font-medium text-gray-900">Windows PC - Chrome</p>
                          <p className="text-gray-500 text-xs">Lomé, Togo • Actif maintenant</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-6">
              <h3 className="text-lg font-bold mb-6 text-gray-900 border-b pb-4">Préférences de Notification</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Alertes de Stock Critique</h4>
                    <p className="text-sm text-gray-500">Recevez un email quand un produit passe sous le seuil d'alerte.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Rapport Financier Journalier</h4>
                    <p className="text-sm text-gray-500">Recevez un résumé des ventes tous les soirs à 20h.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
