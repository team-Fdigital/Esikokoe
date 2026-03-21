import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Textes de traduction (pour l'espace Admin)
const resources = {
  fr: {
    translation: {
      "Dashboard": "Tableau de bord",
      "Stores": "Magasins",
      "Users": "Utilisateurs",
      "Inventory": "Gestion des Stocks",
      "Sales": "Module de Vente",
      "Accounting": "Comptabilité",
      "Reports": "Rapports",
      "Profile": "Profil",
      "Settings": "Paramètres",
      "Logout": "Déconnexion",
      // Paramètres
      "General_Settings": "Paramètres Généraux",
      "Interface_Language": "Langue de l'interface",
      "Interface_Theme": "Thème de l'interface",
      "System_Auto": "Système (Auto)",
      "Light": "Clair",
      "Dark": "Sombre",
      "Save_Preferences": "Sauvegarder les préférences",
      "Preferences_Saved": "Préférences sauvegardées avec succès !"
    }
  },
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Stores": "Stores",
      "Users": "Users",
      "Inventory": "Inventory Management",
      "Sales": "Sales Module",
      "Accounting": "Accounting",
      "Reports": "Reports",
      "Profile": "Profile",
      "Settings": "Settings",
      "Logout": "Logout",
      // Paramètres
      "General_Settings": "General Settings",
      "Interface_Language": "Interface Language",
      "Interface_Theme": "Interface Theme",
      "System_Auto": "System (Auto)",
      "Light": "Light",
      "Dark": "Dark",
      "Save_Preferences": "Save Preferences",
      "Preferences_Saved": "Preferences successfully saved!"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
