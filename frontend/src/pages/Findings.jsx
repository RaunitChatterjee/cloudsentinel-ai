import { useEffect, useState } from 'react';
import { findingsService } from '../services/findingsService';

const SEVERITY_STYLES = {
  CRITICAL: {
    badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
    dot: 'bg-red-400',
  },
  HIGH: {
    badge: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    dot: 'bg-orange-400',
  },
  MEDIUM: {
    badge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  LOW: {
    badge: 'bg-green-500/20 text-green-400 border border-green-500/30',
    dot: 'bg-green-400',
  },
};

function SeverityBadge({ severity }) {
  const style = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.LOW;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide uppercase ${style.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {severity}
    </span>
  );
}

function RiskScore({ score }) {
  const color =
    score >= 9 ? 'text-red-400' :
    score >= 7 ? 'text-orange-400' :
    score >= 4 ? 'text-yellow-400' :
    'text-green-400';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            score >= 9 ? 'bg-red-400' :
            score >= 7 ? 'bg-orange-400' :
            score >= 4 ? 'bg-yellow-400' :
            'bg-green-400'
          }`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <span className={`text-sm font-bold tabular-nums ${color}`}>{score}/10</span>
    </div>
  );
}

function SummaryCard({ label, count, colorClass }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">{label}</span>
      <span className={`text-2xl font-bold ${colorClass}`}>{count}</span>
    </div>
  );
}

export default function Findings() {
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    findingsService.getScan()
      .then((data) => { if (!cancelled) setScan(data); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Failed to load findings.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Running security scan…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <span className="text-red-400 text-lg">!</span>
        </div>
        <p className="text-red-400 font-medium">Scan failed</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const { findings = [], total_findings, critical, high, medium, low, timestamp, scan_id } = scan;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Security Findings</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Scan ID: <span className="font-mono text-gray-400">{scan_id}</span>
            {timestamp && (
              <> · {new Date(timestamp).toLocaleString()}</>
            )}
          </p>
        </div>
        <span className="text-sm text-gray-400">
          <span className="font-semibold text-white">{total_findings}</span> finding{total_findings !== 1 ? 's' : ''} detected
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Critical" count={critical} colorClass="text-red-400" />
        <SummaryCard label="High" count={high} colorClass="text-orange-400" />
        <SummaryCard label="Medium" count={medium} colorClass="text-yellow-400" />
        <SummaryCard label="Low" count={low} colorClass="text-green-400" />
      </div>

      {/* Table */}
      <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50">
                {['Severity', 'Resource', 'Finding', 'Risk Score', 'Recommendation'].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/40">
              {findings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    No findings — your environment looks clean.
                  </td>
                </tr>
              ) : (
                findings.map((f, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-700/30 transition-colors group"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <SeverityBadge severity={f.severity} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-gray-300 bg-gray-700/50 px-2 py-0.5 rounded">
                        {f.resource}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-gray-200 font-medium">{f.finding}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-snug max-w-xs">{f.description}</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <RiskScore score={f.risk_score} />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-gray-400 text-xs leading-snug max-w-xs">{f.recommendation}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}