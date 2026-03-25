import React from 'react';

export default function AlertCard({ title, alerts }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 p-6 transition-colors duration-300">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-slate-100">{title}</h2>
      <ul className="space-y-3">
        {alerts && alerts.length > 0 ? alerts.map((alert, i) => (
          <li key={i} className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/20">
            {alert}
          </li>
        )) : <li className="text-gray-400 dark:text-slate-500 italic text-sm">Aucune alerte</li>}
      </ul>
    </div>
  );
}
