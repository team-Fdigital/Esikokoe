import { User, Mail, Shield, MapPin, Calendar, Camera, Loader2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserProfile, updateUserProfile, uploadProfilePhoto, updateUserPreferences } from '../../apiClient';

export default function Profile({ userEmail: propEmail, userRole: propRole, userStore: propStore }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    emailNotifications: true,
    accountActivity: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getUserProfile();
      const userData = res.data;
      setUser(userData);
      setFormData({
        firstName: userData.prenom || "",
        lastName: userData.nom || "",
        phone: userData.telephone || "",
        emailNotifications: userData.preference?.emailNotifications ?? true,
        accountActivity: userData.preference?.rapportQuotidien ?? false
      });
    } catch (err) {
      console.error("Erreur chargement profil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Mise à jour du profil (Nom, Prénom, Téléphone)
      await updateUserProfile({
        prenom: formData.firstName,
        nom: formData.lastName,
        telephone: formData.phone
      });

      // 2. Mise à jour des préférences
      await updateUserPreferences({
        emailNotifications: formData.emailNotifications,
        rapportQuotidien: formData.accountActivity
      });

      setIsEditing(false);
      alert(t("Profile_Updated"));
      fetchProfile(); // Recharger pour être sûr
    } catch (err) {
      console.error("Erreur sauvegarde profil:", err);
      alert(t("Error_Saving_Profile"));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      setSaving(true);
      await uploadProfilePhoto(uploadData);
      alert(t("Photo_Updated"));
      fetchProfile();
    } catch (err) {
      console.error("Erreur upload photo:", err);
      alert(t("Error_Uploading_Photo"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t("My_Profile")}</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 font-medium">
            {t("Profile_Desc")}
          </p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={saving}
          className={`group flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg ${
            isEditing 
              ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
          }`}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : isEditing ? <Shield size={18} /> : <User size={18} />}
          {isEditing ? t("Save_Changes") : t("Edit_Profile")}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Carte Identité */}
        <div className="md:col-span-1 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm bg-white dark:bg-slate-900 overflow-hidden flex flex-col items-center p-8 space-y-6 transition-colors">
          <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
            <div className={`w-36 h-36 rounded-full flex items-center justify-center text-4xl font-black border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden transition-all ${
              !user?.photoUrl ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : ''
            }`}>
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="uppercase">
                  {(formData.firstName?.[0] || user?.nom?.[0] || "?").toUpperCase()}
                  {(formData.lastName?.[0] || user?.prenom?.[0] || "").toUpperCase()}
                </div>
              )}
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <Camera className="text-white w-8 h-8 transform group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{formData.firstName} {formData.lastName}</h3>
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full mt-2 inline-block uppercase tracking-widest border border-indigo-100 dark:border-indigo-800/50">
              {user?.role || propRole || t("Administrator")}
            </p>
          </div>
          <div className="w-full h-px bg-gray-100 dark:bg-slate-800" />
          <div className="w-full space-y-4 text-xs md:text-sm">
            <div className="flex items-center gap-4 group">
              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-gray-600 dark:text-slate-400 font-medium truncate">{user?.email || propEmail}</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-gray-600 dark:text-slate-400 font-medium">{t("Role")} : <span className="text-gray-900 dark:text-slate-200">{user?.role || propRole}</span></span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-gray-600 dark:text-slate-400 font-medium truncate">{t("Store")} : <span className="text-gray-900 dark:text-slate-200">{user?.magasin?.nom || propStore || t("Main_Store")}</span></span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-gray-600 dark:text-slate-400 font-medium">{t("Member_Since")} : <span className="text-gray-900 dark:text-slate-200">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : t("Jan_2024")}</span></span>
            </div>
          </div>
        </div>

        {/* Détails du formulaire */}
        <div className="md:col-span-2 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm bg-white dark:bg-slate-900 p-8 transition-colors">
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 border-b dark:border-slate-800 pb-4 uppercase tracking-tight">{t("Personal_Info")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("First_Name")}</label>
              <input 
                type="text" 
                value={formData.firstName} 
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                disabled={!isEditing}
                className="w-full h-11 px-4 py-2 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                placeholder={t("First_Name")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Last_Name")}</label>
              <input 
                type="text" 
                value={formData.lastName} 
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                disabled={!isEditing}
                className="w-full h-11 px-4 py-2 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                placeholder={t("Last_Name")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Email")}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  value={user?.email || propEmail} 
                  disabled={true}
                  className="w-full h-11 pl-11 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-gray-500 dark:text-slate-500 cursor-not-allowed font-medium" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{t("Phone_Number")}</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
                className="w-full h-11 px-4 py-2 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                placeholder={t("Phone_Number")}
              />
            </div>
          </div>

          <h3 className="text-xl font-black mt-12 mb-8 text-gray-900 dark:text-white border-b dark:border-slate-800 pb-4 uppercase tracking-tight">{t("App_Preferences")}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all group">
              <div>
                <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight text-sm">{t("Email_Notifications")}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{t("Receive_Stock_Alerts")}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.emailNotifications} 
                  onChange={(e) => setFormData({...formData, emailNotifications: e.target.checked})}
                  disabled={!isEditing} 
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all group">
              <div>
                <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight text-sm">{t("Account_Activity")}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{t("Receive_Weekly_Report")}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.accountActivity} 
                  onChange={(e) => setFormData({...formData, accountActivity: e.target.checked})}
                  disabled={!isEditing} 
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
