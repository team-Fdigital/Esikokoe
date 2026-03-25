export default function Card({
  children,
  className = "",
}) {
  return (
    <div className={`bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="flex items-start justify-between p-6 border-b dark:border-slate-800 transition-colors">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}) {
  return (
    <div className={`p-6 border-t dark:border-slate-800 ${className}`}>
      {children}
    </div>
  );
}
