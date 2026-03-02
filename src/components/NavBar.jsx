import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, LogIn } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const active = (p) => (pathname === p ? "active" : "");

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Fermer menu si changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="site-header fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="container-wide h-14 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-10 w-10 object-contain" />
          <span className="font-bold text-sm text-gray-800">
            EAU CONTINENTALE
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className={`nav-link ${active("/")}`}>Accueil</Link>
          <Link to="/about" className={`nav-link ${active("/about")}`}>À propos</Link>
          <Link to="/products" className={`nav-link ${active("/products")}`}>Produits</Link>
          <Link to="/contact" className={`nav-link ${active("/contact")}`}>Contact</Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Desktop Admin */}
          <Link
            to="/admin/login"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm"
          >
            <LogIn size={16} />
            Admin
          </Link>

          {/* Burger */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-14 inset-x-0 bg-white border-b shadow-lg z-50 transform transition-all duration-200 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="container-wide py-4 flex flex-col gap-2 text-sm">
          <Link to="/" className={`mobile-link ${active("/")}`}>Accueil</Link>
          <Link to="/about" className={`mobile-link ${active("/about")}`}>À propos</Link>
          <Link to="/products" className={`mobile-link ${active("/products")}`}>Produits</Link>
          <Link to="/contact" className={`mobile-link ${active("/contact")}`}>Contact</Link>

          <Link
            to="/admin/login"
            className="mt-2 border border-blue-600 text-blue-600 text-center py-2 rounded-md font-medium"
          >
            Admin Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}