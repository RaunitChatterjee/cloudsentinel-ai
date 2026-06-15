export default function ScanHistory({ history = [] }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
          Recent Scans
        </h3>
      </div>

      {history.length === 0 ? (
        <div className="px-5 py-10 text-center text-gray-600 text-sm">
          No scans yet.
        </div>
      ) : (
        <div className="divide-y divide-gray-700/30">
          {history.map((scan) => (
            <div
              key={scan.scan_id}
              className="px-5 py-4 hover:bg-gray-700/20 transition-colors"
            >
              <p className="text-gray-200 font-mono text-sm">
                {scan.scan_id}
              </p>

              <p className="text-gray-500 text-xs mt-1">
                {new Date(scan.timestamp).toLocaleString()}
              </p>

              <p className="text-cyan-400 text-xs mt-2">
                {scan.total_findings} findings
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}