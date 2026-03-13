export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-md w-fit">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 text-sm rounded-md ${
            active === tab
              ? "bg-white shadow text-gray-900"
              : "text-gray-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
