export default function StatCard({
  title,
  value,
  trend,
  trendUp,
  color = "text-gray-900",
  icon,
}) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <p className="text-xs text-gray-500 mb-3">{title}</p>
      <div className="flex items-end justify-between mb-2">
        <p className={`text-1xl font-bold ${color}`}>{value}</p>
        {icon && <span>{icon}</span>}
      </div>
      {trend && (
        <p className={`text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </p>
      )}
    </div>
  );
}