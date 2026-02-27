import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Package, ShoppingCart } from "lucide-react";

export default function RapportsIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapports</h1>
        <p className="text-gray-600">Consultez les analyses et statistiques</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RapportModule 
          icon={<TrendingUp className="text-blue-500" size={32} />}
          title="Rapport Financier"
          description="Analyses des finances et revenus"
          to="financial"
        />
        <RapportModule 
          icon={<ShoppingCart className="text-green-600" size={32} />}
          title="Rapport Ventes"
          description="Statistiques des ventes"
          to="sales"
        />
        <RapportModule 
          icon={<Package className="text-purple-600" size={32} />}
          title="Rapport Produits"
          description="Analyse des produits"
          to="products"
        />
        <RapportModule 
          icon={<BarChart3 className="text-orange-500" size={32} />}
          title="Rapport Clients"
          description="Statistiques clients"
          to="clients"
        />
      </div>
    </div>
  );
}

function RapportModule({ icon, title, description, to }) {
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
