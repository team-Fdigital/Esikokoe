export default function Table({ columns, data }) {
  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl overflow-hidden overflow-x-auto w-full transition-colors duration-300">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-tight text-xs">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-4 text-gray-700 dark:text-slate-300">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
