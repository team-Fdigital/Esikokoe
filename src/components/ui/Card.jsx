export default function Card({
  children,
  className = "",
}) {
  return (
    <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
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
    <div className="flex items-start justify-between p-6 border-b">
      <div>
        <h3 className="font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500">
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
    <div className={`p-6 border-t ${className}`}>
      {children}
    </div>
  );
}