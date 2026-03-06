export default function StatCard({
  title,
  value,
  trend,
  trendUp,
  color = "text-gray-900",
  icon,
}) {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <div className="flex justify-between items-center">
        <div>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}