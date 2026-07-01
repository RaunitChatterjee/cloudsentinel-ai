import { useEffect, useMemo, useState } from 'react';
import { findingsService } from '../services/findingsService';
import FindingModal from '../components/dashboard/FindingModal';

const SEVERITY_STYLES = {
  CRITICAL: {
    badge:
      'bg-red-500/20 text-red-400 border border-red-500/30',
    dot: 'bg-red-400',
    // UI IMPROVEMENT: subtle glow ring per-severity used on row hover / left accent bar
    ring: 'ring-red-500/40',
    bar: 'bg-red-500',
  },
  HIGH: {
    badge:
      'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    dot: 'bg-orange-400',
    ring: 'ring-orange-500/40',
    bar: 'bg-orange-500',
  },
  MEDIUM: {
    badge:
      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    dot: 'bg-yellow-400',
    ring: 'ring-yellow-500/40',
    bar: 'bg-yellow-500',
  },
  LOW: {
    badge:
      'bg-green-500/20 text-green-400 border border-green-500/30',
    dot: 'bg-green-400',
    ring: 'ring-green-500/40',
    bar: 'bg-green-500',
  },
};

function SeverityBadge({ severity }) {
  const style =
    SEVERITY_STYLES[severity] ??
    SEVERITY_STYLES.LOW;

  return (
    // UI IMPROVEMENT: added subtle shadow + tighter tracking for a more "instrument panel" feel
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase shadow-sm shadow-black/20 ${style.badge}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${style.dot} shadow-[0_0_6px_currentColor]`}
      />
      {severity}
    </span>
  );
}

function RiskScore({ score }) {
  const color =
    score >= 9
      ? 'text-red-400'
      : score >= 7
      ? 'text-orange-400'
      : score >= 4
      ? 'text-yellow-400'
      : 'text-green-400';

  return (
    <div className="flex items-center gap-2.5">
      {/* UI IMPROVEMENT: taller track + smooth width transition when data/sort changes */}
      <div className="w-16 h-1.5 rounded-full bg-gray-700/70 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            score >= 9
              ? 'bg-red-400'
              : score >= 7
              ? 'bg-orange-400'
              : score >= 4
              ? 'bg-yellow-400'
              : 'bg-green-400'
          }`}
          style={{
            width: `${score * 10}%`,
          }}
        />
      </div>

      <span
        className={`text-sm font-bold tabular-nums font-mono ${color}`}
      >
        {score}
        <span className="text-gray-500 font-normal">/10</span>
      </span>
    </div>
  );
}

function SummaryCard({
  label,
  count,
  colorClass,
}) {
  return (
    // UI IMPROVEMENT: gradient card surface, hover lift, and a matching accent bar for quick scanning
    <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-800/40 border border-gray-700/50 rounded-xl p-4 flex flex-col gap-1.5 overflow-hidden transition-all duration-200 hover:border-gray-600 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5">
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${colorClass.replace(
          'text-',
          'bg-'
        )}`}
      />

      <span className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
        {label}
      </span>

      <span
        className={`text-3xl font-bold tabular-nums ${colorClass}`}
      >
        {count}
      </span>
    </div>
  );
}

export default function Findings() {
  const [scan, setScan] = useState(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState(null);

  const [search, setSearch] =
    useState('');
  const [severityFilter, setSeverityFilter] =
    useState('ALL');
  const [sortBy, setSortBy] =
    useState('DESC');

  const [selectedFinding, setSelectedFinding] =
    useState(null);
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    findingsService
      .getScan()
      .then((data) => {
        if (!cancelled) {
          setScan(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.message ||
              'Failed to load findings.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredFindings = useMemo(() => {
    if (!scan) return [];

    let findings = [...(scan.findings || [])];

    findings = findings.filter((f) => {
      const matchesSearch =
        f.finding
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        f.resource
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSeverity =
        severityFilter === 'ALL' ||
        f.severity === severityFilter;

      return (
        matchesSearch &&
        matchesSeverity
      );
    });

    findings.sort((a, b) =>
      sortBy === 'DESC'
        ? b.risk_score -
          a.risk_score
        : a.risk_score -
          b.risk_score
    );

    return findings;
  }, [
    scan,
    search,
    severityFilter,
    sortBy,
  ]);

  if (loading) {
    return (
      // UI IMPROVEMENT: richer loading state — layered pulse rings around the spinner + skeleton hint text
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping" />
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-gray-300 text-sm font-medium">
            Running security scan…
          </p>
          <p className="text-gray-500 text-xs">
            Analyzing your AWS environment for misconfigurations
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      // UI IMPROVEMENT: card-contained error state with clearer hierarchy and bordered icon
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-gray-800/40 border border-red-500/20 rounded-xl mx-auto max-w-md">
        <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <span className="text-red-400 text-lg">
            !
          </span>
        </div>

        <p className="text-red-400 font-semibold">
          Scan failed
        </p>

        <p className="text-gray-500 text-sm text-center px-6">
          {error}
        </p>

        <button
          onClick={() =>
            window.location.reload()
          }
          className="mt-2 px-4 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-150 active:scale-95"
        >
          Retry
        </button>
      </div>
    );
  }

  const {
    total_findings,
    critical,
    high,
    medium,
    low,
    timestamp,
    scan_id,
  } = scan;

  return (
    // UI IMPROVEMENT: consistent dark canvas + max-width container + generous vertical rhythm
    <div className="min-h-screen bg-gray-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div>
          {/* UI IMPROVEMENT: accent dot + tighter title for a "security console" header feel */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Security Findings
            </h1>
          </div>

          <p className="text-xs text-gray-500 mt-1 pl-4">
            Scan ID:{' '}
            <span className="font-mono text-gray-400">
              {scan_id}
            </span>

            {timestamp && (
              <>
                {' '}
                ·{' '}
                {new Date(
                  timestamp
                ).toLocaleString()}
              </>
            )}
          </p>
        </div>

        {/* UI IMPROVEMENT: pill-style count badge instead of plain text */}
        <span className="text-sm text-gray-300 bg-gray-800/70 border border-gray-700/50 rounded-full px-4 py-1.5 w-fit">
          <span className="font-semibold text-white">
            {total_findings}
          </span>{' '}
          finding
          {total_findings !== 1
            ? 's'
            : ''}{' '}
          detected
        </span>
      </div>

      {/* Filters */}
      {/* UI IMPROVEMENT: added icons, focus rings, and finer border/spacing treatment */}
      <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 grid md:grid-cols-3 gap-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search findings or resources..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-colors duration-150 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) =>
            setSeverityFilter(
              e.target.value
            )
          }
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none transition-colors duration-150 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 cursor-pointer"
        >
          <option value="ALL">
            All Severities
          </option>
          <option value="CRITICAL">
            Critical
          </option>
          <option value="HIGH">
            High
          </option>
          <option value="MEDIUM">
            Medium
          </option>
          <option value="LOW">
            Low
          </option>
        </select>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value
            )
          }
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none transition-colors duration-150 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 cursor-pointer"
        >
          <option value="DESC">
            Highest Risk
          </option>
          <option value="ASC">
            Lowest Risk
          </option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard
          label="Critical"
          count={critical}
          colorClass="text-red-400"
        />

        <SummaryCard
          label="High"
          count={high}
          colorClass="text-orange-400"
        />

        <SummaryCard
          label="Medium"
          count={medium}
          colorClass="text-yellow-400"
        />

        <SummaryCard
          label="Low"
          count={low}
          colorClass="text-green-400"
        />
      </div>

      {/* Table */}
      {/* UI IMPROVEMENT: added max-height + sticky header so long finding lists stay scannable */}
      <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
          <table className="w-full text-sm border-collapse">
            {/* UI IMPROVEMENT: sticky, backdrop-blurred header stays visible while scrolling */}
            <thead className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
              <tr className="border-b border-gray-700/50">
                {[
                  'Severity',
                  'Resource',
                  'Finding',
                  'Risk Score',
                  'Recommendation',
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700/40">
              {filteredFindings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16"
                  >
                    {/* UI IMPROVEMENT: distinguishes "no results from filters" vs "no findings at all" */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                        <span className="text-3xl">
                          🛡️
                        </span>
                      </div>

                      {scan.findings && scan.findings.length > 0 ? (
                        <>
                          <h3 className="text-lg font-semibold text-white">
                            No matching findings
                          </h3>
                          <p className="text-gray-500 text-sm mt-2">
                            Try adjusting your search or severity filter.
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-white">
                            No Security Findings
                          </h3>
                          <p className="text-gray-500 text-sm mt-2">
                            Your AWS environment
                            looks healthy.
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFindings.map(
                  (f, i) => {
                    const rowStyle =
                      SEVERITY_STYLES[f.severity] ??
                      SEVERITY_STYLES.LOW;

                    return (
                      // UI IMPROVEMENT: left severity accent bar + smoother hover treatment + subtle scale on click affordance
                      <tr
                        key={i}
                        onClick={() => {
                          setSelectedFinding(
                            f
                          );
                          setIsModalOpen(
                            true
                          );
                        }}
                        className={`
                          relative
                          hover:bg-gray-700/30
                          transition-colors
                          duration-150
                          cursor-pointer
                          group
                          border-l-2
                          border-l-transparent
                          hover:border-l-gray-500
                        `}
                      >
                        <td className="px-4 py-3.5 relative">
                          {/* UI IMPROVEMENT: colored severity indicator bar on the left edge of the row */}
                          <span
                            className={`absolute left-0 top-0 bottom-0 w-0.5 ${rowStyle.bar} opacity-70`}
                          />
                          <SeverityBadge
                            severity={
                              f.severity
                            }
                          />
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs text-gray-300 bg-gray-700/50 px-2 py-0.5 rounded group-hover:bg-gray-700 transition-colors duration-150">
                            {f.resource}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="text-gray-200 font-medium group-hover:text-white transition-colors duration-150">
                            {f.finding}
                          </p>

                          <p className="text-gray-500 text-xs mt-0.5 leading-snug max-w-xs">
                            {
                              f.description
                            }
                          </p>
                        </td>

                        <td className="px-4 py-3.5">
                          <RiskScore
                            score={
                              f.risk_score
                            }
                          />
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="text-gray-400 text-xs leading-snug max-w-xs">
                            {
                              f.recommendation
                            }
                          </p>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FindingModal
        finding={selectedFinding}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFinding(null);
        }}
      />
    </div>
  );
}
