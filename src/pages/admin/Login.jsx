import { useState } from 'react'
import { Lock, Mail, AlertCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Login({ setIsAdmin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple authentication check (can be replaced with API call)
    const validEmail = 'admin@continentale.tg'
    const validPassword = 'admin123'

    if (email === validEmail && password === validPassword) {
      localStorage.setItem('adminToken', 'true')
      if (setIsAdmin) setIsAdmin(true)
      navigate('/admin')
    } else {
      setError('Email ou mot de passe incorrect')
    }
    setLoading(false)
  }

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-700">      <div className="w-full max-w-md max-h-screen overflow-y-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg mb-3">
            <Lock className="text-blue-600" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Connexion</h1>
          <p className="text-blue-100 text-sm">Accédez au tableau de bord</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-red-700 text-xs">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Mail className="inline w-4 h-4 mr-1" />
                Email administrateur
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@continentale.tg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-0.5">Demo: admin@continentale.tg</p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Lock className="inline w-4 h-4 mr-1" />
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-0.5">Demo: admin123</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Compte de démonstration:</strong><br />
              Email: admin@continentale.tg<br />
              Mot de passe: admin123
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-4">
          <a href="/" className="text-blue-100 hover:text-white text-xs transition">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  )
}