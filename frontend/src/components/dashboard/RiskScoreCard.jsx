import { ChartSkeleton } from '../common/LoadingSkeleton';

function Arc({ score }) {
  const pct = score / 10;
  const r = 64;
  const cx = 80;
  const cy = 80;
  const startAngle = Math.PI;
  const endAngle = 0;
  const totalAngle = endAngle - startAngle; // negative = clockwise in SVG

  const toXY = (angle) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  });

  const start = toXY(startAngle);
  const full  = toXY(endAngle);
  const scoreAngle = startAngle + totalAngle * pct; // totalAngle is negative
  const scoreEnd = toXY(scoreAngle);
  const largeArc = Math.abs(totalAngle * pct) > Math.PI ? 1 : 0;

  const trackD = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${full.x} ${full.y}`;
  const fillD  = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${scoreEnd.x} ${scoreEnd.y}`;

  const color =
    score >= 9 ? '#f87171' :
    score >= 7 ? '#fb923c' :
    score >= 4 ? '#facc15' :
    '#4ade80';

  return (
    <svg viewBox="0 0 160 100" className="w-full max-w-[200px]">
      <path d={trackD} fill="none" stroke="#374151" strokeWidth="12" strokeLinecap="round" />
      <path d={fillD}  fill="none" stroke={color}   strokeWidth="12" strokeLinecap="round" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="26" fontWeight="700">
        {score.toFixed(1)}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#6b7280" fontSize="10">
        avg risk score
      </text>
    </svg>
  );
}

export default function RiskScoreCard({ data, loading }) {
  if (loading) return <ChartSkeleton height={200} />;

  const findings = data?.findings ?? [];
  const avg = findings.length
    ? findings.reduce((s, f) => s + (f.risk_score ?? 0), 0) / findings.length
    : 0;

  const label =
    avg >= 9 ? 'Critical Risk'   :
    avg >= 7 ? 'High Risk'       :
    avg >= 4 ? 'Moderate Risk'   :
    'Low Risk';

  const labelColor =
    avg >= 9 ? 'text-red-400'    :
    avg >= 7 ? 'text-orange-400' :
    avg >= 4 ? 'text-yellow-400' :
    'text-green-400';

  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5 flex flex-col items-center gap-2">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest self-start">
        Average Risk Score
      </h3>
      <Arc score={avg} />
      <span className={`text-xs font-semibold uppercase tracking-widest ${labelColor}`}>
        {label}
      </span>
    </div>
  );
}