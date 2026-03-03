import { useState } from 'react'
import { Lock, Mail, AlertCircle, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../apiClient'

export default function Login({ setIsAdmin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Validation avancée du mot de passe
  const passwordChecks = [
    {
      label: 'Au moins 8 caractères',
      valid: password.length >= 8,
    },
    {
      label: 'Une minuscule',
      valid: /[a-z]/.test(password),
    },
    {
      label: 'Une majuscule',
      valid: /[A-Z]/.test(password),
    },
    {
      label: 'Un chiffre',
      valid: /[0-9]/.test(password),
    },
    {
      label: 'Un caractère spécial',
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })
      // Le backend retourne { accessToken, refreshToken } ou { error }
      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken)
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        if (setIsAdmin) setIsAdmin(true)
        navigate('/admin')
      } else if (response.data && response.data.error) {
        setError(response.data.error)
      } else {
        setError('Email ou mot de passe incorrect')
      }
    } catch (err) {
      setError('Erreur de connexion ou identifiants invalides')
    }
    setLoading(false)
  }

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-700">      <div className="w-full max-w-lg max-h-screen overflow-y-auto">
        {/* En-tête déplacé dans la carte */}

        {/* Form Card + Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full shadow mb-3">
              <Lock className="text-blue-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-blue-900 mb-1">Admin Connexion</h1>
            <p className="text-blue-600 text-sm">Accédez au tableau de bord</p>
          </div>
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
            
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Lock className="inline w-4 h-4 mr-1" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none bg-transparent"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1 mt-2">
                {passwordChecks.map((check, idx) => (
                  <span
                    key={idx}
                    className={`flex items-center text-xs ${check.valid ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {check.valid ? (
                      <CheckCircle size={16} className="mr-1" />
                    ) : (
                      <XCircle size={16} className="mr-1" />
                    )}
                    {check.label}
                  </span>
                ))}
              </div>
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