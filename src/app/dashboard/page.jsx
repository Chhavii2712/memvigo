"use client";
import { useAuth } from "../../lib/AuthContext";
import { useAlerts, useTelemetry, useTelemetryHistory } from "../../hooks/useData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STATE_CONFIG = {
  0: { label: "HEALTHY",  color: "bg-green-100 text-green-800",  dot: "bg-green-500" },
  1: { label: "WARNING",  color: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500 animate-pulse" },
  2: { label: "CRITICAL", color: "bg-red-100 text-red-800",       dot: "bg-red-500 animate-pulse" },
};

function MetricCard({ label, value, unit, warn, critical }) {
  const num = parseFloat(value ?? 0);
  const color = num >= critical ? "border-red-300 bg-red-50"
              : num >= warn     ? "border-yellow-300 bg-yellow-50"
              : "border-gray-200 bg-white";
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">
        {typeof num === "number" ? num.toFixed(2) : "—"}
        <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </p>
    </div>
  );
}

function DownloadModal({ onClose }) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    window.open("https://github.com/Chhavii2712/memvigo/releases/download/v1.0.0/memvigo.exe", "_blank");
    setDownloaded(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Download MemVigo Agent</h2>
          <p className="text-sm text-gray-500">
            To start monitoring your PC, you need to download and run the MemVigo Agent on your computer.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600 space-y-2">
          <p className="font-semibold text-gray-700">How it works:</p>
          <p>1. Download and run <span className="font-mono bg-gray-200 px-1 rounded">memvigo.exe</span></p>
          <p>2. Enter your email and password once</p>
          <p>3. Agent runs in background and sends data here</p>
          <p className="text-xs text-gray-400 mt-2">⚠ Requires Java 17 or higher</p>
        </div>

        <button
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl mb-3 transition"
        >
          ⬇ Download memvigo.exe
        </button>

        {downloaded && (
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
          >
            ✓ Done! Go to Dashboard
          </button>
        )}

        {!downloaded && (
          <button
            onClick={onClose}
            className="w-full text-gray-400 hover:text-gray-600 text-sm py-2"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

  useEffect(() => {
    const downloaded = localStorage.getItem("agent_downloaded");
    if (!downloaded) setShowModal(true);
  }, []);

  const handleModalClose = () => {
    localStorage.setItem("agent_downloaded", "true");
    setShowModal(false);
  };

  const { data: alertData }     = useAlerts(8);
  const { data: telData }       = useTelemetry();
  const { data: historyData }   = useTelemetryHistory(40);

  const latestAlerts  = alertData?.alerts  ?? [];
  const current       = telData?.telemetry ?? {};
  const history       = (historyData?.telemetry ?? []).map((t) => ({
    time:      new Date(t.createdAt).toLocaleTimeString(),
    fragRatio: parseFloat(t.fragRatio?.toFixed(3)),
    ioWait:    parseFloat(t.ioWaitMs?.toFixed(1)),
  }));

  const latestState = latestAlerts[0]?.state ?? 0;
  const stateConfig = STATE_CONFIG[latestState] ?? STATE_CONFIG[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {showModal && <DownloadModal onClose={handleModalClose} />}

      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">memvigo</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* System Status */}
        <div className="bg-white rounded-2xl border p-6 flex items-center gap-4">
          <span className={`inline-block w-3 h-3 rounded-full ${stateConfig.dot}`}></span>
          <div>
            <p className="text-xs text-gray-500">System Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${stateConfig.color}`}>
              {stateConfig.label}
            </span>
          </div>
          <div className="ml-auto text-xs text-gray-400">Auto-refresh every 5s</div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Frag Ratio"       value={current.fragRatio}       unit=""    warn={0.5} critical={0.8} />
          <MetricCard label="IO Wait"          value={current.ioWaitMs}        unit="ms"  warn={30}  critical={50}  />
          <MetricCard label="Page Fault Rate"  value={current.pageFaultRate}   unit="/s"  warn={20}  critical={30}  />
          <MetricCard label="Active Processes" value={current.activeProcesses} unit=""    warn={150} critical={200} />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Fragmentation Ratio — Live History</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <ReferenceLine y={0.8} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "CRITICAL 0.8", fill: "#ef4444", fontSize: 11 }} />
              <Line type="monotone" dataKey="fragRatio" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alert Feed */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Alerts</h2>
          {latestAlerts.length === 0 ? (
            <p className="text-sm text-gray-400">No alerts yet. The Java engine will post alerts here.</p>
          ) : (
            <ul className="space-y-2">
              {latestAlerts.map((alert) => (
                <li key={alert.id} className={`flex items-start gap-3 text-sm p-3 rounded-lg
                  ${alert.state === 2 ? "bg-red-50" : alert.state === 1 ? "bg-yellow-50" : "bg-gray-50"}`}>
                  <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0
                    ${alert.state === 2 ? "bg-red-500" : alert.state === 1 ? "bg-yellow-500" : "bg-green-500"}`}></span>
                  <div className="flex-1">
                    <span className="font-medium">{alert.message}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {new Date(alert.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}