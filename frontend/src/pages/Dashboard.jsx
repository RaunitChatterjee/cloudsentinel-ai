import { useEffect, useState } from 'react';

import DashboardStats from '../components/dashboard/DashboardStats';
import SeverityPieChart from '../components/dashboard/SeverityPieChart';
import SeverityBarChart from '../components/dashboard/SeverityBarChart';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import RecentFindings from '../components/dashboard/RecentFindings';
import ScanHistory from '../components/dashboard/ScanHistory';
import FindingModal from '../components/dashboard/FindingModal';
import Toast from '../components/common/Toast';

import { dashboardService } from '../services/dashboardService';
import { scanService } from '../services/scanService';
import { exportFindingsToPdf } from '../utils/exportPdf';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [scan, setScan] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [scanning, setScanning] = useState(false);

  const [selectedFinding, setSelectedFinding] =
    useState(null);
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const dashboardData =
        await dashboardService.getDashboard();

      const scanData =
        await scanService.getScan();

      setDashboard(dashboardData);
      setScan(scanData);

      setScanHistory((prev) => {
        if (!scanData) {
          return prev;
        }

        const exists = prev.some(
          (s) => s.scan_id === scanData.scan_id
        );

        if (exists) {
          return prev;
        }

        return [scanData, ...prev];
      });
    } catch (error) {
      console.error(error);

      setToast({
        message: 'Failed to load dashboard',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleRunScan() {
    try {
      setScanning(true);

      await scanService.runScan();
      await loadDashboard();

      setToast({
        message: 'Scan completed successfully.',
        type: 'success',
      });
    } catch (error) {
      console.error(error);

      setToast({
        message: 'Scan failed.',
        type: 'error',
      });
    } finally {
      setScanning(false);
    }
  }

  function handleExport() {
    if (!scan) {
      setToast({
        message: 'No scan data available.',
        type: 'error',
      });

      return;
    }

    const blob = new Blob(
      [JSON.stringify(scan, null, 2)],
      {
        type: 'application/json',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;
    a.download = `cloudsentinel-scan-${scan.scan_id}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    setToast({
      message:
        'Report exported successfully.',
      type: 'success',
    });
  }

  function handlePdfExport() {
    if (!scan?.findings?.length) {
      setToast({
        message:
          'No scan data available.',
        type: 'error',
      });

      return;
    }

    exportFindingsToPdf(
      scan.findings,
      {
        scan_id: scan.scan_id,
        timestamp: scan.timestamp,
      }
    );

    setToast({
      message:
        'PDF report exported successfully.',
      type: 'success',
    });
  }

  function handleFindingClick(finding) {
    setSelectedFinding(finding);
    setIsModalOpen(true);
  }

  const statsData =
    dashboard || scan || {};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Cloud Security Dashboard
          </h1>

          {scan?.timestamp && (
            <p className="text-gray-500 text-sm mt-2">
              Last Scan:{' '}
              {new Date(
                scan.timestamp
              ).toLocaleString(
                'en-IN',
                {
                  timeZone:
                    'Asia/Kolkata',
                }
              )}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export PDF */}
          <button
            onClick={
              handlePdfExport
            }
            disabled={
              loading || scanning
            }
            className="
              group inline-flex items-center gap-2
              px-4 py-2 rounded-lg
              border border-cyan-500/30
              bg-cyan-500/10
              hover:bg-cyan-500/20
              text-cyan-300
              text-sm font-medium
              transition-all duration-150
              disabled:opacity-40
              disabled:cursor-not-allowed
              active:scale-[0.97]
            "
          >
            <span>📄</span>
            Export PDF
          </button>

          {/* Export JSON */}
          <button
            onClick={
              handleExport
            }
            disabled={
              loading || scanning
            }
            className="
              group inline-flex items-center gap-2
              px-4 py-2 rounded-lg
              border border-gray-600/70
              bg-gray-800/80
              hover:bg-gray-700/80
              text-gray-300 hover:text-white
              text-sm font-medium
              transition-all duration-150
              disabled:opacity-40
              disabled:cursor-not-allowed
              active:scale-[0.97]
            "
          >
            <span>⬇</span>
            Export Report
          </button>

          {/* Run Scan */}
          <button
            onClick={
              handleRunScan
            }
            disabled={
              scanning || loading
            }
            className="
              group relative
              inline-flex items-center gap-2
              px-4 py-2 rounded-lg
              bg-cyan-600 hover:bg-cyan-500
              text-white text-sm font-semibold
              transition-all duration-150
              disabled:opacity-50
              disabled:cursor-not-allowed
              active:scale-[0.97]
              hover:shadow-[0_0_16px_2px_rgba(6,182,212,0.25)]
            "
          >
            {scanning ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                <span>
                  Scanning...
                </span>

                <span className="absolute inset-0 rounded-lg animate-ping bg-cyan-500/20 pointer-events-none" />
              </>
            ) : (
              <>
                <span
                  className="
                    text-base
                    transition-transform duration-300
                    group-hover:rotate-12
                  "
                >
                  🛡️
                </span>

                Run New Scan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats
        data={{
          critical:
            statsData.critical ?? 0,
          high:
            statsData.high ?? 0,
          medium:
            statsData.medium ?? 0,
          low:
            statsData.low ?? 0,
        }}
        loading={loading}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SeverityPieChart
          data={{
            critical:
              statsData.critical ?? 0,
            high:
              statsData.high ?? 0,
            medium:
              statsData.medium ?? 0,
            low:
              statsData.low ?? 0,
          }}
          loading={loading}
        />

        <SeverityBarChart
          data={{
            critical:
              statsData.critical ?? 0,
            high:
              statsData.high ?? 0,
            medium:
              statsData.medium ?? 0,
            low:
              statsData.low ?? 0,
          }}
          loading={loading}
        />

        <RiskScoreCard
          data={scan}
          loading={loading}
        />
      </div>

      {/* Findings */}
      <RecentFindings
        data={scan}
        loading={loading}
        onFindingClick={
          handleFindingClick
        }
      />

      {/* Scan History */}
      <ScanHistory
        history={scanHistory}
      />

      {/* Modal */}
      <FindingModal
        finding={
          selectedFinding
        }
        isOpen={
          isModalOpen
        }
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFinding(
            null
          );
        }}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={
            toast.message
          }
          type={
            toast.type
          }
          onDismiss={() =>
            setToast(null)
          }
        />
      )}
    </div>
  );
}