"use client";
import { useAuth } from "../../lib/AuthContext";
import Link from "next/link";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight">memvigo</Link>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">Settings</span>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">Dashboard</Link>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-xl font-bold">Settings</h1>

        {/* Account */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-mono text-gray-800">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">User ID</span>
              <span className="font-mono text-gray-400 text-xs">{user?.id}</span>
            </div>
          </div>
        </div>

        {/* Engine Config */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Engine Configuration</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Heartbeat Interval", value: "3000 ms" },
              { label: "Critical frag_ratio threshold", value: "> 0.80" },
              { label: "Critical io_wait threshold", value: "> 50 ms" },
              { label: "Warning active_processes", value: "> 200" },
              { label: "Warning page_fault_rate", value: "> 30 / s" },
              { label: "Dashboard poll interval", value: "5000 ms" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1 border-b last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-mono text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Info */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">API Endpoints</h2>
          <div className="space-y-2 text-xs font-mono text-gray-500">
            {[
              "POST /api/auth/register",
              "POST /api/auth/login",
              "POST /api/auth/refresh",
              "POST /api/auth/logout",
              "GET  /api/alerts",
              "GET  /api/alerts/latest",
              "DELETE /api/alerts/:id",
              "GET  /api/telemetry/current",
              "GET  /api/telemetry/history",
              "POST /api/internal/alert",
              "GET  /api/health",
            ].map((ep) => (
              <div key={ep} className="bg-gray-50 px-3 py-1.5 rounded">{ep}</div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-200 p-6">
          <h2 className="font-semibold text-red-700 mb-3">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">Sign out of your memvigo account on this device.</p>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
