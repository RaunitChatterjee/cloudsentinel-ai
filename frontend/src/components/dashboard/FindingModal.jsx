export default function FindingModal({
  finding,
  isOpen,
  onClose,
}) {
  if (!isOpen || !finding) {
    return null;
  }

  const colors = {
    CRITICAL: 'text-red-400',
    HIGH: 'text-orange-400',
    MEDIUM: 'text-yellow-400',
    LOW: 'text-green-400',
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            Finding Details
          </h2>
        </div>

        <div className="p-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-1">
                Finding
              </p>

              <p className="text-sm text-gray-200 font-medium">
                {finding.finding}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-1">
                Resource
              </p>

              <p className="text-xs font-mono text-gray-400 bg-gray-800 border border-gray-700 rounded px-2 py-1 inline-block break-all">
                {finding.resource}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-1">
                Severity
              </p>

              <p
                className={`text-sm font-bold ${
                  colors[finding.severity]
                }`}
              >
                {finding.severity}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-1">
                Risk Score
              </p>

              <p className="text-sm font-bold text-orange-400">
                {finding.risk_score} / 10
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-2">
              Description
            </p>

            <p className="text-gray-200 leading-relaxed">
              {finding.description}
            </p>
          </div>

          {/* Recommendation */}
          <div className="mb-6">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-2">
              Recommendation
            </p>

            <p className="text-gray-200 leading-relaxed">
              {finding.recommendation}
            </p>
          </div>

          {/* AI Recommendations */}
          {finding.ai_suggestions?.length > 0 && (
            <div className="mt-6">
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 shrink-0">
                  <span className="text-violet-400 text-sm">
                    ✨
                  </span>
                </div>

                <span className="text-sm font-semibold text-violet-300 tracking-wide uppercase">
                  AI Remediation
                </span>

                <span className="ml-auto text-[10px] font-mono text-violet-500/70 border border-violet-500/20 bg-violet-500/5 px-2 py-0.5 rounded">
                  Powered by Claude
                </span>
              </div>

              {/* Cards */}
              <ol className="space-y-3">
                {finding.ai_suggestions.map(
                  (suggestion, index) => (
                    <li
                      key={index}
                      className="
                        group relative flex gap-3.5
                        rounded-xl p-4
                        border border-gray-700/50
                        hover:border-violet-500/30
                        bg-gray-800/40
                        hover:bg-gray-800/70
                        transition-all duration-200
                      "
                    >
                      <div
                        className="
                          shrink-0 w-6 h-6 mt-0.5
                          rounded-full
                          border border-violet-500/30
                          bg-violet-500/10
                          flex items-center justify-center
                          text-[11px]
                          font-bold
                          text-violet-400
                          group-hover:bg-violet-500/20
                          group-hover:border-violet-500/50
                          transition-colors duration-200
                        "
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-gray-200 leading-relaxed">
                          {suggestion}
                        </p>
                      </div>

                      <div
                        className="
                          absolute left-0 top-3 bottom-3
                          w-[2px] rounded-full
                          bg-violet-500/0
                          group-hover:bg-violet-500/60
                          transition-all duration-200
                        "
                      />
                    </li>
                  )
                )}
              </ol>

              <p className="mt-3 text-[11px] text-gray-600 text-right">
                Suggestions are AI-generated.
                Verify before applying.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>

          <a
            href="https://console.aws.amazon.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
          >
            View in AWS Console ↗
          </a>
        </div>
      </div>
    </div>
  );
}