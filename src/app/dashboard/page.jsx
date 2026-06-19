"use client";
import { useAuth } from "../../lib/AuthContext";
import { useAlerts, useTelemetry, useTelemetryHistory } from "../../hooks/useData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const STATE_CONFIG = {
  0: { label: "HEALTHY", color: "bg-green-100 text-green-800", dot: "bg-green-500" },
  1: { label: "WARNING", color: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500 animate-pulse" },
  2: { label: "CRITICAL", color: "bg-red-100 text-red-800", dot: "bg-red-500 animate-pulse" },
};

const METRIC_INFO = {
  "Frag Ratio": "Memory fragmentation ratio (0-1). The color shows if this is unusual compared to YOUR PC's normal history.",
  "IO Wait": "Time your CPU waits for disk/memory operations. Color is based on whether this is unusual for your specific PC.",
  "Page Fault Rate": "How often your system fetches data from disk instead of RAM. Color reflects how unusual this is for you.",
  "Active Processes": "Number of running programs. Color shows if this count is unusual compared to your PC's normal range.",
};

function calculateZScore(history, key, current) {
  if (!history || history.length < 10) return 0;
  const values = history.map((h) => h[key]).filter((v) => typeof v === "number" && !isNaN(v));
  if (values.length < 10) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  const std = Math.sqrt(variance);
  if (std === 0) return 0;
  return Math.abs((current - mean) / std);
}

function MetricCard({ label, value, unit, zScore }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const num = parseFloat(value ?? 0);
  const color = zScore >= 3
    ? "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
    : zScore >= 2
      ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800"
      : "border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700";

  const statusLabel = zScore >= 3
    ? "⚠ Unusual for your PC"
    : zScore >= 2
      ? "Slightly unusual"
      : "Normal for your PC";

  const statusColor = zScore >= 3 ? "text-red-500" : zScore >= 2 ? "text-yellow-600" : "text-gray-400 dark:text-gray-500";

  return (
    <div className={`rounded-xl border p-4 ${color} relative`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center"
        >?</button>
      </div>
      {showTooltip && (
        <div className="absolute z-10 top-8 right-0 bg-gray-900 text-white text-xs rounded-lg p-3 w-52 shadow-xl">
          {METRIC_INFO[label]}
        </div>
      )}
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {typeof num === "number" ? num.toFixed(2) : "—"}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
      </p>
      <p className={`text-xs mt-1 ${statusColor}`}>{statusLabel}</p>
    </div>
  );
}

function DownloadModal({ onClose }) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    window.open("https://github.com/Chhavii2712/memvigo/releases/download/v4.1.0/memvigo-v4.1.0.zip");
    setDownloaded(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Download MemVigo Agent</h2>
          <p className="text-sm text-gray-500">To start monitoring your PC, download and run the MemVigo Agent.</p>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600 space-y-2">
          <p className="font-semibold text-gray-700">How it works:</p>
          <p>1. Download and extract <span className="font-mono bg-gray-200 px-1 rounded">MemVigo-v3.0.zip</span></p>
          <p>2. Run <span className="font-mono bg-gray-200 px-1 rounded">MemVigo.exe</span> — enter your email & password once</p>
          <p>3. Agent runs silently in background — no terminal, no hassle</p>
          <p>4. Starts automatically every time you turn on your PC</p>
          <p className="text-xs text-gray-400">✅ No Java installation needed — everything is bundled!</p>
        </div>

        {/* Privacy */}
        <div className="bg-blue-50 rounded-xl p-4 mb-4 text-sm text-blue-800 space-y-1">
          <p className="font-semibold">🔒 100% Safe — Your Privacy is Protected</p>
          <p>MemVigo only reads <strong>4 memory metrics</strong> from your PC — nothing else.</p>
          <p className="text-xs text-blue-700 mt-1">Memory fragmentation · IO wait · Page fault rate · Active process count</p>
          <p className="mt-2 text-xs">Uses <strong>ML anomaly detection</strong> to learn your PC's normal behavior.</p>
          <p className="text-xs text-blue-600 mt-1">❌ No files &nbsp;|&nbsp; ❌ No passwords &nbsp;|&nbsp; ❌ No browsing history &nbsp;|&nbsp; ❌ No personal data</p>
        </div>

        {/* Antivirus warning */}
        <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-sm text-yellow-800 space-y-2">
          <p className="font-semibold">⚠ Your antivirus might get confused!</p>
          <p className="text-xs">Since MemVigo is a new app, your antivirus doesn't recognize it yet and may show a warning. <strong>This is completely normal</strong> — it happens with many new apps.</p>
          <p className="mt-1 font-medium text-xs">If you see a warning, just do this:</p>
          <div className="bg-yellow-100 rounded-lg p-3 space-y-1 text-xs">
            <p>🛡 <strong>Windows says "Unknown app"</strong> → Click <strong>"More info"</strong> → then <strong>"Run anyway"</strong></p>
            <p>🛡 <strong>Avast/AVG blocks it</strong> → Click <strong>"More options"</strong> → then <strong>"Ignore"</strong></p>
            <p>🛡 <strong>Other antivirus</strong> → Look for "Allow" or "Trust" option</p>
          </div>
          <p className="text-xs text-yellow-700 mt-1">✅ MemVigo only reads memory data — it cannot access your files, photos, passwords or anything personal.</p>
        </div>

        <button onClick={handleDownload} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl mb-3 transition">
          ⬇ Download MemVigo Agent
        </button>

        {downloaded && (
          <button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition">
            ✓ Done! Go to Dashboard
          </button>
        )}
        {!downloaded && (
          <button onClick={onClose} className="w-full text-gray-400 hover:text-gray-600 text-sm py-2">
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}

function HelpSection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-200"
      >
        <span>❓ Help — What do these metrics mean?</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">📊 Frag Ratio (0–1)</p>
            <p>How fragmented your memory is. Think of it like a messy desk — the higher the number, the harder it is for your PC to find things. Above 0.8 is critical.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">⏱ IO Wait (ms)</p>
            <p>Time your CPU spends waiting for memory/disk operations. Like waiting in a queue — the longer the wait, the slower your system feels.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">⚡ Page Fault Rate (/s)</p>
            <p>How often your system needs to fetch data from disk instead of RAM. High rates mean your RAM is overwhelmed and your PC will feel sluggish.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">🔢 Active Processes</p>
            <p>Number of programs/tasks running on your PC right now. Too many processes compete for memory and slow everything down.</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300">
            💡 MemVigo uses ML to learn YOUR PC's normal ranges — alerts are personalized to your system, not generic thresholds.
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout, token, loading } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!loading && !token) router.push("/login");
  }, [token, loading]);

  useEffect(() => {
    const downloaded = localStorage.getItem("agent_downloaded");
    if (!downloaded) setShowModal(true);
  }, []);

  const handleModalClose = () => {
    localStorage.setItem("agent_downloaded", "true");
    setShowModal(false);
  };

  const { data: alertData } = useAlerts(8);
  const { data: telData } = useTelemetry();
  const { data: historyData } = useTelemetryHistory(100);

  const latestAlerts = alertData?.alerts ?? [];
  const current = telData?.telemetry ?? {};
  const history = (historyData?.telemetry ?? []).map((t) => ({
      time: new Date(t.createdAt).toLocaleTimeString(),
      fragRatio: parseFloat(t.fragRatio?.toFixed(3)),
      ioWait: parseFloat(t.ioWaitMs?.toFixed(1)),
      pageFaultRate: parseFloat(t.pageFaultRate?.toFixed(2)),
      activeProcesses: t.activeProcesses,
    }));

  const fragRatioValues = history.map(h => h.fragRatio).filter(v => typeof v === "number" && !isNaN(v));
  const fragMean = fragRatioValues.length > 0 ? fragRatioValues.reduce((a, b) => a + b, 0) / fragRatioValues.length : 0;
  const fragStd = fragRatioValues.length > 0
    ? Math.sqrt(fragRatioValues.reduce((a, b) => a + Math.pow(b - fragMean, 2), 0) / fragRatioValues.length)
    : 0;
  const mlThreshold = Math.min(1, fragMean + 2 * fragStd);

  const latestState = latestAlerts[0]?.state ?? 0;
  const stateConfig = STATE_CONFIG[latestState] ?? STATE_CONFIG[0];

  if (loading || !token) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {showModal && <DownloadModal onClose={handleModalClose} />}

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">memvigo</span>
          <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded font-mono">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</span>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            >
              {theme === "dark" ? "🌙" : "🌞"}
            </button>
          )}
          <button onClick={() => router.push("/settings")} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">Settings</button>
          <button onClick={logout} className="text-sm text-red-600 dark:text-red-400 hover:underline">Logout</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* System Status */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-6 flex items-center gap-4">
          <span className={`inline-block w-3 h-3 rounded-full ${stateConfig.dot}`}></span>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">System Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${stateConfig.color}`}>
              {stateConfig.label}
            </span>
          </div>
          <div className="ml-auto text-xs text-gray-400 dark:text-gray-500">Auto-refresh every 5s</div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Frag Ratio" value={current.fragRatio} unit="" zScore={calculateZScore(history, "fragRatio", current.fragRatio)} />

          <MetricCard label="IO Wait" value={current.ioWaitMs} unit="ms" zScore={calculateZScore(history, "ioWait", current.ioWaitMs)} />
          <MetricCard label="Page Fault Rate" value={current.pageFaultRate} unit="/s" zScore={calculateZScore(history, "pageFaultRate", current.pageFaultRate)} />
          <MetricCard label="Active Processes" value={current.activeProcesses} unit="" zScore={calculateZScore(history, "activeProcesses", current.activeProcesses)} />
        </div>

        {/* Chart with sticky y-axis and ML threshold */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Fragmentation Ratio — Live History</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">← Scroll left/right inside the chart to see past data → Orange line = your PC's personalized ML threshold</p>
          <div className="flex">
            <div className="flex-shrink-0">
              <LineChart width={50} height={250} data={history}>
                <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
              </LineChart>
            </div>
            <div className="overflow-x-auto flex-1">
              <div style={{ width: `${Math.max(800, history.length * 15)}px` }}>
                <LineChart width={Math.max(800, history.length * 15)} height={250} data={history} margin={{ left: -50 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} hide />
                  <Tooltip />
                  <ReferenceLine y={mlThreshold} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: `ML Threshold ${mlThreshold.toFixed(2)}`, fill: "#f59e0b", fontSize: 11 }} />
                  <Line type="monotone" dataKey="fragRatio" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Feed */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Alerts</h2>
          {latestAlerts.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No alerts yet. The agent will post alerts here.</p>
          ) : (
            <ul className="space-y-2">
              {latestAlerts.map((alert) => (
                <li key={alert.id} className={`flex items-start gap-3 text-sm p-3 rounded-lg
                  ${alert.state === 2 ? "bg-red-50 dark:bg-red-900/20" : alert.state === 1 ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-gray-50 dark:bg-slate-700/50"}`}>
                  <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0
                    ${alert.state === 2 ? "bg-red-500" : alert.state === 1 ? "bg-yellow-500" : "bg-green-500"}`}></span>
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{alert.message}</span>
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                      {new Date(alert.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Help Section */}
        <HelpSection />
      </main>
    </div>
  );
}