import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Login from './pages/admin/Login'
import StocksIndex from './pages/admin/stocks/index'
import Produits from './pages/admin/stocks/Produits'
import Mouvements from './pages/admin/stocks/Mouvements'
import Alertes from './pages/admin/stocks/Alertes'
import VentesIndex from './pages/admin/ventes/index'
import Ventes from './pages/admin/ventes/Ventes'
import Factures from './pages/admin/ventes/Factures'
import Clients from './pages/admin/ventes/Clients'
import ComptabiliteIndex from './pages/admin/comptabilite/index'
import Transactions from './pages/admin/comptabilite/Transactions'
import Bilan from './pages/admin/comptabilite/Bilan'
import Rapports from './pages/admin/comptabilite/Rapports'
import Audit from './pages/admin/comptabilite/Audit'
import RapportsIndex from './pages/admin/rapports/index'
import FinancialReport from './pages/admin/rapports/FinancialReport'
import SalesReport from './pages/admin/rapports/SalesReport'
import ProductsReport from './pages/admin/rapports/ProductsReport'
import ClientsReport from './pages/admin/rapports/ClientsReport'

function AppContent() {
  const [isAdmin, setIsAdmin] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) setIsAdmin(true)
  }, [])

  const isAdminRoute = location.pathname.startsWith('/admin')
  const isLoginPage = location.pathname === '/admin/login'

  return (
    <>
      {/* NAVBAR PUBLIC */}
      {!isAdminRoute && <NavBar />}

      <main className={!isAdminRoute ? 'pt-12' : ''}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />

          {/* LOGIN */}
          <Route path="/admin/login" element={<Login setIsAdmin={setIsAdmin} />} />

          {/* ADMIN */}
          {isAdmin ? (
            <Route path="/admin" element={<AdminLayout title="Tableau de bord" />}>
              <Route index element={<Dashboard />} />
              
              {/* Stocks */}
              <Route path="stocks" element={<StocksIndex />} />
              <Route path="stocks/produits" element={<Produits />} />
              <Route path="stocks/mouvements" element={<Mouvements />} />
              <Route path="stocks/alertes" element={<Alertes />} />
              
              {/* Ventes */}
              <Route path="ventes" element={<VentesIndex />} />
              <Route path="ventes/ventes" element={<Ventes />} />
              <Route path="ventes/factures" element={<Factures />} />
              <Route path="ventes/clients" element={<Clients />} />
              
              {/* Comptabilité */}
              <Route path="comptabilite" element={<ComptabiliteIndex />} />
              <Route path="comptabilite/transactions" element={<Transactions />} />
              <Route path="comptabilite/bilan" element={<Bilan />} />
              <Route path="comptabilite/rapports" element={<Rapports />} />
              <Route path="comptabilite/audit" element={<Audit />} />
              
              {/* Rapports */}
              <Route path="rapports" element={<RapportsIndex />} />
              <Route path="rapports/financial" element={<FinancialReport />} />
              <Route path="rapports/sales" element={<SalesReport />} />
              <Route path="rapports/products" element={<ProductsReport />} />
              <Route path="rapports/clients" element={<ClientsReport />} />
            </Route>
          ) : (
            <Route path="/admin/*" element={<Navigate to="/admin/login" />} />
          )}
        </Routes>
      </main>

      {/* FOOTER PUBLIC */}
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}