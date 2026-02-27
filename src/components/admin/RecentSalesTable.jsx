import React from 'react';

export default function RecentSalesTable({ title, subtitle, sales }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-2">Client</th>
            <th className="text-left">Produit</th>
            <th className="text-left">Date</th>
            <th className="text-right">Montant</th>
          </tr>
        </thead>
        <tbody>
          {sales && sales.length > 0 ? sales.map((sale, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="py-2">{sale.client || '-'}</td>
              <td>{sale.product || '-'}</td>
              <td>{sale.date || '-'}</td>
              <td className="text-right font-semibold">{sale.amount || '-'} FCFA</td>
            </tr>
          )) : (
            <tr><td colSpan="4" className="text-center text-gray-400 py-4">Aucune vente récente</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
