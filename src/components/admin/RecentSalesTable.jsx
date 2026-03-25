import React from 'react';

export default function RecentSalesTable({ title, subtitle, sales }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 p-6 transition-colors duration-300">
      <h2 className="text-lg font-bold mb-1 text-gray-800 dark:text-slate-100">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">{subtitle}</p>}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm">
          <thead className="border-b dark:border-slate-800 text-gray-500 dark:text-slate-400">
            <tr>
              <th className="text-left font-semibold py-3 uppercase tracking-tight text-xs">Client</th>
              <th className="text-left font-semibold uppercase tracking-tight text-xs">Produit</th>
              <th className="text-left font-semibold uppercase tracking-tight text-xs">Date</th>
              <th className="text-right font-semibold uppercase tracking-tight text-xs">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {sales && sales.length > 0 ? sales.map((sale, i) => (
              <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-4 pr-2 font-medium text-gray-900 dark:text-slate-100">{sale.client || '-'}</td>
                <td className="pr-2 text-gray-700 dark:text-slate-300">{sale.product || '-'}</td>
                <td className="pr-2 text-gray-500 dark:text-slate-400 whitespace-nowrap">{sale.date || '-'}</td>
                <td className="text-right font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{sale.amount || '-'}</td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center text-gray-400 dark:text-slate-500 py-8 italic">Aucune vente récente</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
