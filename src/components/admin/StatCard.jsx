export default function StatCard({
  title,
  value,
  trend,
  trendUp,
  color = "text-gray-900 dark:text-slate-100",
  icon,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm h-full flex flex-col justify-center transition-all duration-300">
      <div className="flex justify-between items-center gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1 truncate uppercase tracking-wider">{title}</p>
          <p className={`text-xl xl:text-2xl font-bold truncate ${color}`}>{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium truncate ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
