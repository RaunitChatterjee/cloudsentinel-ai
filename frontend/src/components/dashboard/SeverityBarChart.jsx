import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { ChartSkeleton } from '../common/LoadingSkeleton';

const COLORS = {
  Critical: '#f87171',
  High:     '#fb923c',
  Medium:   '#facc15',
  Low:      '#4ade80',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <span className="text-gray-400">{label}: </span>
      <span className="text-white font-bold">{payload[0].value}</span>
    </div>
  );
};

export default function SeverityBarChart({ data, loading }) {
  if (loading) return <ChartSkeleton height={280} />;

  const chartData = [
    { name: 'Critical', count: data?.critical ?? 0 },
    { name: 'High',     count: data?.high     ?? 0 },
    { name: 'Medium',   count: data?.medium   ?? 0 },
    { name: 'Low',      count: data?.low      ?? 0 },
  ];

  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-widest">
        Findings by Severity
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barSize={32}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}