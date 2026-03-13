import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B1120] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Grid Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">

          {/* Colonne 1 - Logo et description (Description cachée sur mobile) */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
              </div>
              <h3 className="hidden md:block font-bold text-white text-lg">Intercontinental Eau</h3>
            </div>
            <p className="hidden md:block text-gray-400 text-sm leading-relaxed">
              Votre partenaire de confiance pour une eau pure et de qualité au Togo. Nous nous engageons à vous fournir le meilleur service.
            </p>
          </div>

          {/* Colonne 2 - Liens Rapides (Cachée sur mobile) */}
          <div className="hidden md:block">
            <h4 className="font-semibold text-white mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-blue-400 transition">Accueil</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-blue-400 transition">À propos</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-blue-400 transition">Produits</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-blue-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Colonne 3 - Nos Produits */}
          <div>
            <h4 className="font-semibold text-white mb-4">Nos Produits</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/products" className="text-gray-400 hover:text-blue-400 transition">Sachets 500ml</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-blue-400 transition">Bonbonnes 22L</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-blue-400 transition">Pack Entreprise</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-blue-400 transition">Abonnement</a></li>
            </ul>
          </div>

          {/* Colonne 4 - Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone size={16} />
                <span>+228 91 29 99 99</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} />
                <span>Intercontinentaleau@gmail.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin size={16} />
                <span>Hedranawoé, Lomé, Togo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright - exactement comme l'image */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © 2024 Intercontinental Eau. Tous droits réservés. | Eau pure du Togo
        </div>
      </div>
    </footer>
  );
}
