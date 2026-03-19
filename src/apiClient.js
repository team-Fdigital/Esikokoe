import axios from 'axios';

// Crée une instance Axios configurée pour le backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Utilise la variable d'environnement VITE_API_URL
  headers: {
    'Content-Type': 'application/json',
  },
});


// Intercepteur pour ajouter le token JWT si besoin
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});


// AUTH
export const login = (email, password) => apiClient.post('/auth/login', { email, password });
export const registerAdmin = (data) => apiClient.post('/auth/register', data);
export const refreshToken = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  return apiClient.post('/auth/refresh', {}, {
    headers: {
      Authorization: `Bearer ${refreshToken}`
    }
  });
};

// USERS
export const createUser = (data) => apiClient.post('/users', data);
export const getAllUsers = () => apiClient.get('/users');
export const updateUser = (id, data) => apiClient.patch(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);

// CLIENTS
export const createClient = (data) => apiClient.post('/clients', data);
export const getAllClients = () => apiClient.get('/clients');
export const updateClient = (id, data) => apiClient.put(`/clients/${id}`, data);
export const deleteClient = (id) => apiClient.delete(`/clients/${id}`);
export const getClientById = (id) => apiClient.get(`/clients/${id}`);
export const getClientStats = () => apiClient.get('/clients/stats/dashboard');

// MAGASINS
export const createMagasin = (data) => apiClient.post('/magasins', data);
export const getAllMagasins = () => apiClient.get('/magasins');
export const updateMagasin = (id, data) => apiClient.patch(`/magasins/${id}`, data);
export const deleteMagasin = (id) => apiClient.delete(`/magasins/${id}`);
export const getMagasinById = (id) => apiClient.get(`/magasins/${id}`);

// VENTES
export const createVente = (data) => apiClient.post('/ventes', data);
export const getAllVentes = () => apiClient.get('/ventes');
export const searchVentes = (q) => apiClient.get('/ventes/search/query', { params: { q } });
export const getVentesByDateRange = (debut, fin) => apiClient.get('/ventes/filter/date', { params: { debut, fin } });
export const getVentesStats = () => apiClient.get('/ventes/stats/dashboard');
export const getVenteDetail = (idVente) => apiClient.get(`/ventes/${idVente}`);
export const updateVente = (idVente, data) => apiClient.patch(`/ventes/${idVente}`, data);
export const deleteVente = (idVente) => apiClient.delete(`/ventes/${idVente}`);


// STOCK

// RAPPORTS

// PRODUITS
export const searchProduits = (q, magasinId) => apiClient.get('/produits/search/query', { params: { q, magasinId } });
export const getProduitsByFormat = (format) => apiClient.get('/produits/filter/format', { params: { format } });
export const getStatsProduitsByFormat = () => apiClient.get('/produits/stats/by-format');
export const getProduitsDashboardMetrics = (magasinId) => apiClient.get('/produits/dashboard/metrics', { params: { magasinId } });
export const createProduit = (data) => apiClient.post('/produits', data);
export const getAllProduits = (magasinId) => apiClient.get('/produits', { params: { magasinId } });
export const getProduitByCode = (codeProduit) => apiClient.get(`/produits/${codeProduit}`);
export const updateProduit = (codeProduit, data) => apiClient.put(`/produits/${codeProduit}`, data);
export const deleteProduit = (codeProduit) => apiClient.delete(`/produits/${codeProduit}`);

// STOCK
export const registerStockEntry = (data) => apiClient.post('/stock/entry', data);
export const deductStock = (data) => apiClient.post('/stock/deduct', data);
export const transferStock = (data) => apiClient.post('/stock/transfer', data);
export const getInventory = () => apiClient.get('/stock/inventory');
export const getStockByFormat = () => apiClient.get('/stock/by-format');
export const getCriticalStocks = () => apiClient.get('/stock/critical');
export const getStockDashboardMetrics = () => apiClient.get('/stock/dashboard');
export const getStockHistory = (limit) => apiClient.get('/stock/history', { params: { limit } });
export const getTransferHistory = () => apiClient.get('/stock/transfers');

// COMPTABILITE
export const createTransaction = (data) => apiClient.post('/comptabilite/transactions', data);
export const getTransactions = (type) => apiClient.get('/comptabilite/transactions', { params: { type } });
export const getTransactionById = (id) => apiClient.get(`/comptabilite/transactions/${id}`);
export const getDistribution = () => apiClient.get('/comptabilite/distribution');
export const createRapport = (data) => apiClient.post('/comptabilite/rapports', data);
export const getRapports = () => apiClient.get('/comptabilite/rapports');
export const getRapportById = (id) => apiClient.get(`/comptabilite/rapports/${id}`);
export const createBilan = (data) => apiClient.post('/comptabilite/bilans', data);
export const getBilans = () => apiClient.get('/comptabilite/bilans');
export const getBilanSummary = () => apiClient.get('/comptabilite/bilan/summary');
export const getBilanById = (id) => apiClient.get(`/comptabilite/bilans/${id}`);
export const getAuditLogs = () => apiClient.get('/comptabilite/audit/logs');
export const getAuditStatus = () => apiClient.get('/comptabilite/audit/status');
export const getAuditEquilibration = () => apiClient.get('/comptabilite/audit/equilibration');
export const getAuditTrend = () => apiClient.get('/comptabilite/audit/trend');

// RAPPORTS
export const getProduitsRapport = () => apiClient.get('/rapports/produits');
export const getVentesRapport = () => apiClient.get('/rapports/ventes');

// Factures (exemple, à compléter selon besoins)

// FACTURES
export const getAllFactures = () => apiClient.get('/factures');
export const searchFactures = (q) => apiClient.get('/factures/search/query', { params: { q } });
export const updateFacture = (id, data) => apiClient.put(`/factures/${id}`, data);
export const getFactureById = (id) => apiClient.get(`/factures/${id}`);

export default apiClient;
