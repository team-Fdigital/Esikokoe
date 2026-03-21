import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createUser } from "../../apiClient"; // Assuming createUser is from apiClient

export default function AjouterAdmin() {
  const { t } = useTranslation();
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
      await createUser({ nom, email, motDePasse, role: "GERANT" });
      setSuccess(t("Admin_Added_Success"));
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || t("Add_Error"));
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 md:px-0">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-md text-center">
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-red-700">{t("Access_Denied")}</h2>
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{t("Must_Be_Admin")}</p>
          <button onClick={() => navigate("/admin/login")}
            className="py-1.5 md:py-2 px-3 md:px-4 text-sm md:text-base bg-blue-600 text-white rounded hover:bg-blue-700">{t("Login_Button")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 md:px-0">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-md">
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-blue-700">{t("Add_Admin")}</h2>
        {error && <div className="mb-2 md:mb-3 text-red-600 text-xs md:text-sm">{error}</div>}
        {success && <div className="mb-2 md:mb-3 text-green-600 text-xs md:text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm mb-1 font-medium">{t("Name_Label")}</label>
            <input type="text" value={nom} onChange={e => setNom(e.target.value)} required className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border rounded" />
          </div>
          <div>
            <label className="block text-xs md:text-sm mb-1 font-medium">{t("Admin_Email")}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border rounded" />
          </div>
          <div>
            <label className="block text-xs md:text-sm mb-1 font-medium">{t("Password")}</label>
            <input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} required minLength={8} className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border rounded" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-1.5 md:py-2 text-sm md:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            {loading ? t("Adding_InProgress") : t("Add_Button")}
          </button>
        </form>
      </div>
    </div>
  );
}
