import { Link } from "react-router-dom";
import { Package, AlertTriangle, Truck } from "lucide-react";

export default function StocksIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Stocks</h1>
        <p className="text-gray-600">Gérez votre inventaire et approvisionnement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StockModule 
          icon={<Package className="text-blue-500" size={32} />}
          title="Produits"
          description="Consulter et gérer les produits"
          to="produits"
        />
        <StockModule 
          icon={<Truck className="text-green-600" size={32} />}
          title="Mouvements"
          description="Entrées et sorties de stock"
          to="mouvements"
        />
        <StockModule 
          icon={<AlertTriangle className="text-orange-500" size={32} />}
          title="Alertes"
          description="Stock faible et notifications"
          to="alertes"
        />
      </div>
    </div>
  );
}

function StockModule({ icon, title, description, to }) {
  return (
    <Link
      to={to}
      className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
}
