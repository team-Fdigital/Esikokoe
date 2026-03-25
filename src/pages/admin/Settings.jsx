import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Lock, Globe, Palette, MonitorSmartphone, ShieldCheck, Loader2, X, Sun, Moon } from 'lucide-react';
import { getUserProfile, updateUserPreferences, changePassword, getUserSessions, revokeSession } from '../../apiClient';

function PasswordModal({ isOpen, onClose, t }) {
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert(t('Passwords_Do_Not_Match'));
      return;
    }
    setLoading(true);
    try {
      await changePassword({
        ancienMotDePasse: passwords.old,
        nouveauMotDePasse: passwords.new
      });
      alert(t('Password_Changed_Success'));
      onClose();
    } catch (err) {
      console.error(err);
      alert(t('Error_Changing_Password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('Change_Password')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">{t('Old_Password')}</label>
            <input 
              type="password" 
              required
              className="w-full h-10 px-3 border dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={passwords.old}
              onChange={e => setPasswords({...passwords, old: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">{t('New_Password')}</label>
            <input 
              type="password" 
              required
              className="w-full h-10 px-3 border dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={passwords.new}
              onChange={e => setPasswords({...passwords, new: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">{t('Confirm_New_Password')}</label>
            <input 
              type="password" 
              required
              className="w-full h-10 px-3 border dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={passwords.confirm}
              onChange={e => setPasswords({...passwords, confirm: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {t('Update_Password')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [sessions, setSessions] = useState([]);

  const [settings, setSettings] = useState({
    language: i18n.language || 'fr',
    theme: localStorage.getItem('theme') || 'light',
    stockAlerts: true,
    dailyReport: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await getUserProfile();
      const pref = res.data.preference;
      if (pref) {
        setSettings({
          language: pref.langue || i18n.language || 'fr',
          theme: pref.theme || localStorage.getItem('theme') || 'light',
          stockAlerts: pref.stockAlerts,
          dailyReport: pref.rapportQuotidien
        });
      }
      
      // Charger les sessions
      const sessionsRes = await getUserSessions();
      setSessions(sessionsRes.data);
    } catch (err) {
      console.error("Erreur chargement paramètres:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (id) => {
    if (!window.confirm(t('Confirm_Revoke_Session'))) return;
    try {
      await revokeSession(id);
      setSessions(sessions.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert(t('Error_Revoking_Session'));
    }
  };

  const getDeviceIcon = (userAgent) => {
    const ua = userAgent?.toLowerCase() || '';
    if (ua.includes('mobi')) return MonitorSmartphone; // Mobile
    return MonitorSmartphone; // Par défaut PC
  };

  const getDeviceName = (userAgent) => {
    const ua = userAgent?.toLowerCase() || '';
    let browser = 'Navigateur';
    if (ua.includes('edg')) browser = 'Edge'; // Edge Chromium
    else if (ua.includes('edge')) browser = 'Edge (Legacy)'; 
    else if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';

    let os = 'Appareil';
    if (ua.includes('windows')) os = 'Windows PC';
    else if (ua.includes('mac os')) os = 'Mac';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS Device';

    return `${os} - ${browser}`;
  };

  const formatLastActive = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const isEn = i18n.language === 'en';
    let value = '';
    let unit = '';

    if (diffInMins < 1) return t('Just_Now');
    
    if (diffInMins < 60) {
      value = diffInMins;
      unit = t('Minutes_Short');
    } else if (diffInHours < 24) {
      value = diffInHours;
      unit = t('Hours_Short');
    } else if (diffInDays < 7) {
      value = diffInDays;
      unit = t('Days_Short');
    } else {
      return date.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'short' });
    }

    if (isEn) return `${value} ${unit} ${t('Ago')}`;
    return `${t('Ago')} ${value} ${unit}`;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Appliquer la langue localement et globalement
      i18n.changeLanguage(settings.language);
      localStorage.setItem('i18nextLng', settings.language);

      // 2. Sauvegarder sur le serveur
      await updateUserPreferences({
        langue: settings.language,
        theme: settings.theme,
        stockAlerts: settings.stockAlerts,
        rapportQuotidien: settings.dailyReport
      });

      alert(t('Preferences_Saved'));
    } catch (err) {
      console.error(err);
      alert(t('Error_Saving_Preferences'));
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: t('General_Settings') || 'Général', icon: MonitorSmartphone },
    { id: 'security', label: t('Security') || 'Sécurité', icon: Lock },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        t={t}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('Settings') || 'Paramètres du système'}</h2>
          <p className="text-muted-foreground">
            {t('Manage_Global_Configuration')}
          </p>
        </div>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon size={18} className={activeTab === tab.id ? 'text-white' : 'text-gray-400 dark:text-slate-500'} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Contenu principal */}
        <div className="flex-1 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[400px] transition-colors">
          {activeTab === 'general' && (
            <div className="p-8 animate-fade-in">
              <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white border-b dark:border-slate-800 pb-4">{t('General_Settings')}</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                    <Globe size={16} /> {t('Interface_Language')}
                  </label>
                  <select 
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    className="w-full md:w-1/2 h-10 px-3 py-2 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                    <Palette size={16} /> {t('Appearance') || 'Apparence'}
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    {/* Carte Mode Clair */}
                    <button
                      type="button"
                      onClick={() => {
                        setSettings({...settings, theme: 'light'});
                        document.documentElement.setAttribute('data-theme', 'light');
                        document.documentElement.classList.remove('dark');
                        localStorage.setItem('theme', 'light');
                      }}
                      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer group
                        ${settings.theme === 'light'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/15'
                          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-gray-300 dark:hover:border-slate-600'
                        }`}
                    >
                      {/* Indicateur sélectionné */}
                      {settings.theme === 'light' && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                      {/* Icône Sun */}
                      <div className={`p-3 rounded-xl transition-all duration-200
                        ${settings.theme === 'light'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 group-hover:text-amber-400 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20'
                        }`}
                      >
                        <Sun size={22} strokeWidth={1.8} />
                      </div>
                      <span className={`text-xs font-semibold transition-colors duration-200
                        ${settings.theme === 'light'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-slate-400'
                        }`}
                      >
                        {t('Light_Mode') || 'Mode Clair'}
                      </span>
                    </button>

                    {/* Carte Mode Sombre */}
                    <button
                      type="button"
                      onClick={() => {
                        setSettings({...settings, theme: 'dark'});
                        document.documentElement.setAttribute('data-theme', 'dark');
                        document.documentElement.classList.add('dark');
                        localStorage.setItem('theme', 'dark');
                      }}
                      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer group
                        ${settings.theme === 'dark'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/15'
                          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-gray-300 dark:hover:border-slate-600'
                        }`}
                    >
                      {/* Indicateur sélectionné */}
                      {settings.theme === 'dark' && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                      {/* Icône Moon */}
                      <div className={`p-3 rounded-xl transition-all duration-200
                        ${settings.theme === 'dark'
                          ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20'
                        }`}
                      >
                        <Moon size={22} strokeWidth={1.8} />
                      </div>
                      <span className={`text-xs font-semibold transition-colors duration-200
                        ${settings.theme === 'dark'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-slate-400'
                        }`}
                      >
                        {t('Dark_Mode') || 'Mode Sombre'}
                      </span>
                    </button>
                  </div>
                </div>
                
                <div className="pt-8">
                  <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b dark:border-slate-800 pb-4">{t('Notification_Preferences')}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-5 border dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white">{t('Critical_Stock_Alerts')}</h4>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{t('Receive_Email_Stock_Alert')}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.stockAlerts}
                          onChange={(e) => setSettings({...settings, stockAlerts: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center gap-4 p-5 border dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white">{t('Daily_Financial_Report')}</h4>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{t('Receive_Daily_Sales_Summary')}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.dailyReport}
                          onChange={(e) => setSettings({...settings, dailyReport: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t dark:border-slate-800">
                  <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50"
                  >
                    {saving && <Loader2 size={18} className="animate-spin" />}
                    {t('Save_Preferences')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-8 animate-fade-in">
              <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white border-b dark:border-slate-800 pb-4">{t('Security_Connection')}</h3>
              <div className="space-y-6">
                
                <div className="p-6 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-start gap-4">
                  <ShieldCheck className="text-red-600 dark:text-red-500 w-8 h-8 shrink-0" />
                  <div>
                    <h4 className="font-bold text-red-900 dark:text-red-400 text-lg">{t('Password')}</h4>
                    <p className="text-sm text-red-800/80 dark:text-red-300/80 mt-1 mb-4">{t('Recommend_Change_Password')}</p>
                    <button 
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="px-6 py-2 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all shadow-sm"
                    >
                      {t('Edit_Password')}
                    </button>
                  </div>
                </div>

                <div className="p-6 border dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 transition-colors">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <MonitorSmartphone size={20} className="text-blue-500" />
                    {t('Connected_Devices')}
                  </h4>
                  <ul className="space-y-2">
                    {sessions.length > 0 ? sessions.map((session) => {
                      const DeviceIcon = getDeviceIcon(session.userAgent);
                      return (
                        <li key={session.id} className="flex items-center justify-between text-sm p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors border dark:border-slate-800">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-xl">
                              <DeviceIcon className="text-gray-500 dark:text-slate-400 w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-slate-200">{getDeviceName(session.userAgent)}</p>
                              <p className="text-gray-500 dark:text-slate-500 text-xs mt-1">
                                {session.ipAddress} • {session.location} • 
                                {session.current ? (
                                  <span className="text-green-600 dark:text-green-400 font-bold ml-1">{t('Active_Now')}</span>
                                ) : (
                                  <span className="ml-1 text-gray-500 dark:text-slate-500">
                                    {t('Last_Active')} {formatLastActive(session.lastActive)}
                                  </span>
                                )}</p>
                            </div>
                          </div>
                          {!session.current && (
                            <button 
                              onClick={() => handleRevokeSession(session.id)}
                              className="text-xs text-red-600 hover:text-red-700 font-medium p-1 hover:bg-red-50 rounded"
                            >
                              {t('Disconnect')}
                            </button>
                          )}
                        </li>
                      );
                    }) : (
                      <p className="text-sm text-gray-500">{t('No_Active_Sessions')}</p>
                    )}
                  </ul>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
