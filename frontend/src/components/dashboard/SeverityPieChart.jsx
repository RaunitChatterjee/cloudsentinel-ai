import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartSkeleton } from '../common/LoadingSkeleton';

const COLORS = {
  CRITICAL: '#f87171',
  HIGH:     '#fb923c',
  MEDIUM:   '#facc15',
  LOW:      '#4ade80',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <span className="text-gray-400">{name}: </span>
      <span className="text-white font-bold">{value}</span>
    </div>
  );
};

export default function SeverityPieChart({ data, loading }) {
  if (loading) return <ChartSkeleton height={280} />;

  const chartData = [
    { name: 'Critical', value: data?.critical ?? 0 },
    { name: 'High',     value: data?.high     ?? 0 },
    { name: 'Medium',   value: data?.medium   ?? 0 },
    { name: 'Low',      value: data?.low      ?? 0 },
  ].filter(d => d.value > 0);

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-widest">
        Severity Distribution
      </h3>
      {total === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No findings</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name.toUpperCase()]}
                  opacity={0.85}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-gray-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}