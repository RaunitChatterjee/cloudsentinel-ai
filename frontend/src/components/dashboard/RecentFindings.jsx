const SEVERITY_STYLES = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  LOW: 'bg-green-500/20 text-green-400 border-green-500/30',
};

function SeverityBadge({ severity }) {
  const style = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.LOW;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase border ${style}`}
    >
      {severity}
    </span>
  );
}

export default function RecentFindings({
  data,
  loading,
  onFindingClick,
}) {
  if (loading) {
    return (
      <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-8 text-center text-gray-500">
        Loading findings...
      </div>
    );
  }

  const findings = (data?.findings ?? [])
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
          Top Findings
        </h3>
      </div>

      {findings.length === 0 ? (
        <div className="px-5 py-10 text-center text-gray-600 text-sm">
          No findings to display.
        </div>
      ) : (
        <div className="divide-y divide-gray-700/30">
          {findings.map((f, i) => (
            <button
              key={i}
              onClick={() => onFindingClick?.(f)}
              className="w-full text-left flex items-center gap-4 px-5 py-3.5 hover:bg-gray-700/20 transition-colors"
            >
              <SeverityBadge severity={f.severity} />

              <div className="flex-1 min-w-0">
                <p className="text-gray-200 text-sm font-medium truncate">
                  {f.finding}
                </p>

                <p className="text-gray-500 text-xs font-mono truncate">
                  {f.resource}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-sm font-bold tabular-nums ${
                    f.risk_score >= 9
                      ? 'text-red-400'
                      : f.risk_score >= 7
                      ? 'text-orange-400'
                      : f.risk_score >= 4
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}
                >
                  {f.risk_score}/10
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}