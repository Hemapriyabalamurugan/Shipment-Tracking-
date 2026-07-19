export default function BarChart({ data = [] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-3 h-48 px-2">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
          <span className="text-xs text-gray-500">{d.value}</span>
          <div className="w-full bg-gray-100 rounded-t-md flex items-end h-32">
            <div
              className="w-full bg-slate-800 rounded-t-md transition-all duration-500 hover:bg-slate-600"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{d.label}</span>
        </div>
      ))}
    </div>
  );
}