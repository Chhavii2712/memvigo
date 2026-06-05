"use client";
import { useAuth } from "../../lib/AuthContext";
import { useAlerts, useTelemetry, useTelemetryHistory } from "../../hooks/useData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

export default function DashboardPage() {
  const { user, logout, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

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

  // Derive current state from latest alert
  const latestState = latestAlerts[0]?.state ?? 0;
  const stateConfig = STATE_CONFIG[latestState] ?? STATE_CONFIG[0];

  return (
    <div className="min-h-screen bg-gray-50">
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
