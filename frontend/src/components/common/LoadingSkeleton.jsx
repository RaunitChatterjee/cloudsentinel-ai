function SkeletonBlock({ className = '' }) {
  return (
    <div className={`bg-gray-700/50 rounded animate-pulse ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5 space-y-3">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-8 w-16" />
      <SkeletonBlock className="h-2 w-32" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl overflow-hidden">
      <div className="border-b border-gray-700/50 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBlock key={i} className="h-3 flex-1" />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="px-4 py-4 flex gap-4 border-b border-gray-700/20 last:border-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBlock
              key={c}
              className={`h-3 flex-1 ${c === 0 ? 'max-w-[80px]' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 240 }) {
  return (
    <div
      className="bg-gray-800/60 border border-gray-700/50 rounded-xl flex items-center justify-center animate-pulse"
      style={{ height }}
    >
      <div className="text-gray-600 text-sm">Loading chart…</div>
    </div>
  );
}