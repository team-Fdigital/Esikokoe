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
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("My_Profile")}</h2>
          <p className="text-muted-foreground">
            {t("Profile_Desc")}
          </p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white transition-colors ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? t("Save_Changes") : t("Edit_Profile")}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Carte Identité */}
        <div className="md:col-span-1 border rounded-xl shadow-sm bg-white overflow-hidden flex flex-col items-center p-6 space-y-4">
          <div className="relative group" onClick={handlePhotoClick}>
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold border-4 border-white shadow-lg overflow-hidden">
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <>
                  {(formData.firstName?.[0] || user?.nom?.[0] || "?").toUpperCase()}
                  {(formData.lastName?.[0] || user?.prenom?.[0] || "").toUpperCase()}
                </>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-8 h-8" />
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h3>
            <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2 inline-block">
              {user?.role || propRole || t("Administrator")}
            </p>
          </div>
          <hr className="w-full border-gray-100" />
          <div className="w-full space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{user?.email || propEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gray-400" />
              <span>{t("Role")} {user?.role || propRole}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{t("Store")} {user?.magasin?.nom || propStore || t("Main_Store")}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{t("Member_Since")} {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : t("Jan_2024")}</span>
            </div>
          </div>
        </div>

        {/* Détails du formulaire */}
        <div className="md:col-span-2 border rounded-xl shadow-sm bg-white p-6">
          <h3 className="text-lg font-bold mb-6 text-gray-900 border-b pb-4">{t("Personal_Info")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("First_Name")}</label>
              <input 
                type="text" 
                value={formData.firstName} 
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                disabled={!isEditing}
                className="w-full h-10 px-3 py-2 border rounded-md bg-transparent disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("Last_Name")}</label>
              <input 
                type="text" 
                value={formData.lastName} 
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                disabled={!isEditing}
                className="w-full h-10 px-3 py-2 border rounded-md bg-transparent disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("Email")}</label>
              <input 
                type="email" 
                value={user?.email || propEmail} 
                disabled={true}
                className="w-full h-10 px-3 py-2 border rounded-md bg-gray-50 text-gray-500 cursor-not-allowed" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("Phone_Number")}</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
                className="w-full h-10 px-3 py-2 border rounded-md bg-transparent disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <h3 className="text-lg font-bold mt-10 mb-6 text-gray-900 border-b pb-4">{t("App_Preferences")}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div>
                <p className="font-medium text-gray-900">{t("Email_Notifications")}</p>
                <p className="text-sm text-gray-500">{t("Receive_Stock_Alerts")}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.emailNotifications} 
                  onChange={(e) => setFormData({...formData, emailNotifications: e.target.checked})}
                  disabled={!isEditing} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div>
                <p className="font-medium text-gray-900">{t("Account_Activity")}</p>
                <p className="text-sm text-gray-500">{t("Receive_Weekly_Report")}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.accountActivity} 
                  onChange={(e) => setFormData({...formData, accountActivity: e.target.checked})}
                  disabled={!isEditing} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
