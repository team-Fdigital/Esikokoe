import React from 'react';

export default function AlertCard({ title, alerts }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ul className="space-y-2">
        {alerts && alerts.length > 0 ? alerts.map((alert, i) => (
          <li key={i} className="text-sm text-red-600">
            {alert}
          </li>
        )) : <li className="text-gray-400">Aucune alerte</li>}
      </ul>
    </div>
  );
}
