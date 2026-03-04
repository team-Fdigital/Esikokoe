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
    <>
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

            {/* Burger Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50 text-gray-700 dark:text-gray-200"
              aria-label="Menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Side Drawer */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMenu}
        />

        {/* Drawer Content */}
        <div
          className={`absolute top-0 left-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <img src="/logo.svg" alt="Logo" className="h-8 w-8 object-contain" />
              <span className="font-bold text-xs text-gray-800 uppercase tracking-tight">
                EAU CONTINENTALE
              </span>
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col p-4 gap-1">
            <Link
              to="/"
              className={`flex items-center px-4 py-3 rounded-lg font-bold text-gray-700 ${pathname === "/" ? "bg-red-50 text-red-600" : "hover:bg-gray-100"}`}
              onClick={closeMenu}
            >
              Accueil
            </Link>
            <Link
              to="/about"
              className={`flex items-center px-4 py-3 rounded-lg font-bold text-gray-700 ${pathname === "/about" ? "bg-red-50 text-red-600" : "hover:bg-gray-100"}`}
              onClick={closeMenu}
            >
              À propos
            </Link>
            <Link
              to="/products"
              className={`flex items-center px-4 py-3 rounded-lg font-bold text-gray-700 ${pathname === "/products" ? "bg-red-50 text-red-600" : "hover:bg-gray-100"}`}
              onClick={closeMenu}
            >
              Produits
            </Link>
            <Link
              to="/contact"
              className={`flex items-center px-4 py-3 rounded-lg font-bold text-gray-700 ${pathname === "/contact" ? "bg-red-50 text-red-600" : "hover:bg-gray-100"}`}
              onClick={closeMenu}
            >
              Contact
            </Link>

            <div className="h-px bg-gray-100 my-4 mx-4"></div>

            <Link
              to="/admin/login"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 m-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              <LogIn size={20} />
              Connexion Admin
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}