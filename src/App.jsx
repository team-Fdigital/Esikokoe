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
import AjouterAdmin from './pages/admin/ajouter-admin'
import Magasins from './pages/admin/magasins/index'
import Utilisateurs from './pages/admin/utilisateurs/index'
import StocksIndex from './pages/admin/stocks/index'
import Produits from './pages/admin/stocks/Produits'
import Mouvements from './pages/admin/stocks/Mouvements'
import Alertes from './pages/admin/stocks/Alertes'
import StockAction from './pages/admin/stocks/StockAction'
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
  const [userRole, setUserRole] = useState(null) // 'SUPERADMIN', 'GERANT', 'VENDEUR', null
  const [userStore, setUserStore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      const mockRole = localStorage.getItem('mockRole')
      const mockStore = localStorage.getItem('mockStore')
      
      const token = localStorage.getItem('token')
      if (token || mockRole) {
        try {
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]))
            setUserEmail(payload.email || "test@admin.com")
          } else {
            setUserEmail("test@admin.com")
          }
          setUserRole(mockRole || 'SUPERADMIN')
          setUserStore(mockStore || 'magasin_1')
        } catch (e) {
          setUserRole(null)
          setUserEmail("")
        }
        setIsLoading(false)
      } else {
        // Tenter de rafraîchir le token si refreshToken existe
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          try {
            const { refreshToken: refreshTokenApi } = await import('./apiClient')
            const res = await refreshTokenApi()
            if (res.data && res.data.accessToken) {
              localStorage.setItem('token', res.data.accessToken)
              const payload = JSON.parse(atob(res.data.accessToken.split('.')[1]))
              setUserRole(mockRole || payload.role || 'SUPERADMIN')
              setUserStore(mockStore || payload.magasinId || 'magasin_1')
              setUserEmail(payload.email || "test@admin.com")
            } else {
              setUserRole(null)
            }
          } catch {
            setUserRole(null)
          }
          setIsLoading(false)
        } else {
          setUserRole(null)
          setIsLoading(false)
        }
      }
    }
    checkAuth()
  }, [])

  const isAdminRoute = location.pathname.startsWith('/admin')
  const isLoginPage = location.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage && isLoading) {
    return <div style={{textAlign:'center',marginTop:'3rem'}}>Chargement...</div>
  }

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
          <Route path="/admin/login" element={<Login setUserRole={setUserRole} />} />

          {/* ADMIN */}
          {userRole ? (
            <Route path="/admin" element={<AdminLayout title="Tableau de bord" userEmail={userEmail} userRole={userRole} userStore={userStore} />}>
              <Route index element={<Dashboard />} />
              {/* Entités Globales */}
              <Route path="magasins" element={<Magasins userRole={userRole} />} />
              <Route path="utilisateurs" element={<Utilisateurs userRole={userRole} userStore={userStore} />} />
              {/* Stocks */}
              <Route path="stocks" element={<StocksIndex />} />
              <Route path="stocks/produits" element={<Produits />} />
              <Route path="stocks/mouvements" element={<Mouvements />} />
              <Route path="stocks/action" element={<StockAction />} />
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
              {/* Ajouter admin */}
              <Route path="ajouter-admin" element={<AjouterAdmin />} />
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
