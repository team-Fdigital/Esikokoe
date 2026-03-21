import { User, Mail, Shield, MapPin, Calendar, Camera } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Profile({ userEmail, userRole, userStore }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "Principal",
    phone: "+228 99 00 11 22",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Logique de sauvegarde fictive ou API à ajouter
    alert(t("Profile_Updated"));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("My_Profile")}</h2>
          <p className="text-muted-foreground">
            {t("Profile_Desc")}
          </p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isEditing ? t("Save_Changes") : t("Edit_Profile")}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Carte Identité */}
        <div className="md:col-span-1 border rounded-xl shadow-sm bg-white overflow-hidden flex flex-col items-center p-6 space-y-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold border-4 border-white shadow-lg overflow-hidden">
              {formData.firstName[0]}{formData.lastName[0]}
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
              {userRole || t("Administrator")}
            </p>
          </div>
          <hr className="w-full border-gray-100" />
          <div className="w-full space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{userEmail || 'admin@continentale-eau.com'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gray-400" />
              <span>{t("Role")} {userRole || t("Administrator")}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{t("Store")} {userStore || t("Main_Store")}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{t("Member_Since")}{t("Jan_2024")}</span>
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
                value={userEmail || 'admin@continentale-eau.com'} 
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
                <input type="checkbox" className="sr-only peer" defaultChecked disabled={!isEditing} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div>
                <p className="font-medium text-gray-900">{t("Account_Activity")}</p>
                <p className="text-sm text-gray-500">{t("Receive_Weekly_Report")}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" disabled={!isEditing} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
