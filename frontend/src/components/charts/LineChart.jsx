export default function LineChart({ data = [], color = "#0f172a" }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const width = 300;
  const height = 100;
  const step = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - ((d.value - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(" ")}
      />
      {data.map((d, i) => (
        <circle key={d.label} cx={i * step} cy={height - ((d.value - min) / (max - min || 1)) * height} r="3" fill={color} />
      ))}
    </svg>
  );
}