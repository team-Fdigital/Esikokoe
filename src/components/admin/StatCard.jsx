export default function StatCard({
  title,
  value,
  trend,
  trendUp,
  color = "text-gray-900",
  icon,
}) {
  return (
    <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm h-full flex flex-col justify-center">
      <div className="flex justify-between items-center gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1 truncate">{title}</p>
          <p className={`text-lg xl:text-xl font-bold truncate ${color}`}>{value}</p>
          {trend && (
            <p className={`text-xs mt-1 truncate ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
