import { Link } from "react-router-dom";
import { ShoppingCart, FileText, Users } from "lucide-react";

export default function VentesIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Module de Vente</h1>
        <p className="text-gray-600">Gérez vos factures et commandes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <VentesModule 
          icon={<ShoppingCart className="text-blue-500" size={32} />}
          title="Ventes"
          description="Consulter les ventes"
          to="ventes"
        />
        <VentesModule 
          icon={<FileText className="text-green-600" size={32} />}
          title="Factures"
          description="Générer et gérer les factures"
          to="factures"
        />
        <VentesModule 
          icon={<Users className="text-purple-600" size={32} />}
          title="Clients"
          description="Gérer les clients"
          to="clients"
        />
      </div>
    </div>
  );
}

function VentesModule({ icon, title, description, to }) {
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
