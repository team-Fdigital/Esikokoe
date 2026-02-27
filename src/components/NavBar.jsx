import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, LogIn } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function NavBar() {
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const active = (p) => (pathname === p ? 'active' : '')

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="site-header bg-white shadow-md fixed inset-x-0 top-0 z-40">
      <div className="container-wide py-2 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Logo Intercontinental Eau" className="h-14 w-14 object-contain" />
          <div>
            <Link to="/" className="text-base font-bold text-gray-800">EAU CONTINENTALE</Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center space-x-6 text-xs">
          <Link to="/" className={`nav-link ${active('/')}`}>Accueil</Link>
          <Link to="/about" className={`nav-link ${active('/about')}`}>À propos</Link>
          <Link to="/products" className={`nav-link ${active('/products')}`}>Produits</Link>
          <Link to="/contact" className={`nav-link ${active('/contact')}`}>Contact</Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="tel:+22800000000" className="hidden md:inline-flex items-center gap-2 px-4 py-2 btn-primary rounded-md" aria-label="Contactez-nous">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92V21a1 1 0 0 1-1.09 1A19 19 0 0 1 3 4.09 1 1 0 0 1 4 3h4.09a1 1 0 0 1 1 .75c.12.81.37 1.6.73 2.33a1 1 0 0 1-.24 1.09L8.91 9.91a16 16 0 0 0 6.2 6.2l1.74-1.66a1 1 0 0 1 1.09-.24c.73.36 1.52.61 2.33.73a1 1 0 0 1 .75 1V21z" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Contact</span>
          </a>

          {/* Admin Login Button */}
          <Link to="/admin/login" className="hidden md:inline-flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition font-medium">
            <LogIn size={16} />
            <span>Admin</span>
          </Link>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden p-2 text-gray-800 hover:bg-gray-100 rounded-md transition">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="container-wide py-4 space-y-3">
            <Link to="/" onClick={closeMenu} className={`block px-4 py-2 rounded-md transition ${active('/') ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`}>
              Accueil
            </Link>
            <Link to="/about" onClick={closeMenu} className={`block px-4 py-2 rounded-md transition ${active('/about') ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`}>
              À propos
            </Link>
            <Link to="/products" onClick={closeMenu} className={`block px-4 py-2 rounded-md transition ${active('/products') ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`}>
              Produits
            </Link>
            <Link to="/contact" onClick={closeMenu} className={`block px-4 py-2 rounded-md transition ${active('/contact') ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`}>
              Contact
            </Link>
            <a href="tel:+22800000000" onClick={closeMenu} className="block px-4 py-2 bg-blue-600 text-white rounded-md text-center font-semibold hover:bg-blue-700 transition">
              Appeler maintenant
            </a>
            <Link to="/admin/login" onClick={closeMenu} className="block px-4 py-2 border-2 border-blue-600 text-blue-600 text-center rounded-md font-semibold hover:bg-blue-50 transition">
              Admin Connexion
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
