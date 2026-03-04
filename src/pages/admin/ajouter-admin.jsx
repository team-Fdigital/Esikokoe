
import { useEffect } from "react";

export default function AjouterAdmin() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await createUser({ nom, email, motDePasse, role: "ADMIN" });
      setSuccess("Nouvel administrateur ajouté !");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de l'ajout");
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-700">Accès refusé</h2>
          <p className="text-gray-600 mb-4">Vous devez être connecté en tant qu'administrateur pour ajouter un nouvel admin.</p>
          <button onClick={() => navigate("/admin/login")}
            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Se connecter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Ajouter un administrateur</h2>
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        {success && <div className="mb-3 text-green-600 text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Nom</label>
            <input type="text" value={nom} onChange={e => setNom(e.target.value)} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Mot de passe</label>
            <input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} required minLength={8} className="w-full px-3 py-2 border rounded" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            {loading ? "Ajout en cours..." : "Ajouter"}
          </button>
        </form>
      </div>
    </div>
  );
}
