import { StatCardSkeleton } from '../common/LoadingSkeleton';

function StatCard({
  label,
  value,
  sub,
  accentClass = 'text-white',
  borderColor,
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Colored accent line */}
      <div className={`h-0.5 w-full ${borderColor}`} />

      <div className="p-5">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-500">
          {label}
        </span>

        <div
          className={`text-3xl font-bold tracking-tight mt-2 tabular-nums ${accentClass}`}
        >
          {value ?? '—'}
        </div>

        {sub && (
          <div className="text-[10px] text-gray-600 mt-1.5">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardStats({
  data,
  loading,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map(
          (_, i) => (
            <StatCardSkeleton key={i} />
          )
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Critical"
        value={data?.critical}
        accentClass="text-red-400"
        borderColor="bg-red-500"
        sub="Immediate action required"
      />

      <StatCard
        label="High"
        value={data?.high}
        accentClass="text-orange-400"
        borderColor="bg-orange-500"
        sub="Resolve within 24h"
      />

      <StatCard
        label="Medium"
        value={data?.medium}
        accentClass="text-yellow-400"
        borderColor="bg-yellow-500"
        sub="Schedule for review"
      />

      <StatCard
        label="Low"
        value={data?.low}
        accentClass="text-green-400"
        borderColor="bg-green-500"
        sub="Monitor and track"
      />
    </div>
  );
}