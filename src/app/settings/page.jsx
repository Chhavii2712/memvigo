"use client";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [clearDone, setClearDone] = useState(false);
  const [agentReset, setAgentReset] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) router.push("/login");
  }, [token]);

  const isDark = theme === "dark";

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    setDeleteLoading(true);
    try {
      await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      router.push("/login");
    } catch {
      setDeleteLoading(false);
    }
  };

  const handleClearData = async () => {
    setClearLoading(true);
    try {
      await fetch("/api/user/telemetry", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setClearDone(true);
      setTimeout(() => setClearDone(false), 3000);
    } catch {}
    setClearLoading(false);
  };

  const handleAgentReset = () => {
    localStorage.removeItem("agent_downloaded");
    setAgentReset(true);
    setTimeout(() => setAgentReset(false), 3000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      
      {/* Header */}
      <header className={`border-b px-6 py-4 flex items-center justify-between ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>memvigo</Link>
          <span className={`text-xs px-2 py-0.5 rounded font-mono ${isDark ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-700"}`}>Settings</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className={`text-sm ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>Dashboard</Link>
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-full transition ${isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
            >
              {isDark ? "🌙" : "🌞"}
            </button>
          )}
          <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Account Info */}
        <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
          <h2 className="font-semibold mb-4 flex items-center gap-2">👤 Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>Email</span>
              <span className={`font-mono ${isDark ? "text-gray-200" : "text-gray-800"}`}>{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>Member since</span>
              <span className={isDark ? "text-gray-200" : "text-gray-800"}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>Plan</span>
              <span className="text-green-500 font-medium">Free</span>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
          <h2 className="font-semibold mb-4 flex items-center gap-2">🎨 Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Switch between dark and light mode</p>
            </div>
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
              >
                {isDark ? "🌙 Dark Mode" : "🌞 Light Mode"}
              </button>
            )}
          </div>
        </div>

        {/* Agent */}
        <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
          <h2 className="font-semibold mb-4 flex items-center gap-2">⚙️ MemVigo Agent</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Download Agent</p>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Get the latest version of MemVigo Agent for Windows</p>
              </div>
              
                href="https://github.com/Chhavii2712/memvigo/releases/download/v3.0.0/MemVigo-v3.0.zip"
                target="_blank"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition flex-shrink-0"
              >
                ⬇ Download
              </a>
            </div>
            <div className={`border-t ${isDark ? "border-slate-700" : "border-gray-100"}`} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Reset Download Prompt</p>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Show the agent download popup again on next visit</p>
              </div>
              <button
                onClick={handleAgentReset}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition flex-shrink-0 ${isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
              >
                {agentReset ? "✓ Reset!" : "Reset"}
              </button>
            </div>
          </div>
        </div>

        {/* AI Thresholds */}
        <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
          <h2 className="font-semibold mb-1 flex items-center gap-2">🧠 ML Alert Thresholds</h2>
          <p className={`text-xs mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>These are the values your ML engine uses to detect problems</p>
          <div className="space-y-2 text-sm">
            {[
              { label: "Critical — Frag Ratio", value: "> 0.80", color: "text-red-500" },
              { label: "Critical — IO Wait", value: "> 50 ms", color: "text-red-500" },
              { label: "Warning — Active Processes", value: "> 350", color: "text-yellow-500" },
              { label: "Warning — Page Fault Rate", value: "> 50 /s", color: "text-yellow-500" },
              { label: "Data refresh interval", value: "every 3s", color: "text-blue-500" },
              { label: "Dashboard auto-refresh", value: "every 5s", color: "text-blue-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`flex justify-between py-2 border-b last:border-0 ${isDark ? "border-slate-700" : "border-gray-100"}`}>
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>{label}</span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded ${color} ${isDark ? "bg-slate-700" : "bg-gray-50"}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
          <h2 className="font-semibold mb-4 flex items-center gap-2">🗄️ Data Management</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Clear Telemetry History</p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Delete all your stored memory readings and chart history</p>
            </div>
            <button
              onClick={handleClearData}
              disabled={clearLoading}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm rounded-lg font-medium transition flex-shrink-0"
            >
              {clearLoading ? "Clearing..." : clearDone ? "✓ Cleared!" : "Clear Data"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-300 dark:border-red-800 p-6">
          <h2 className="font-semibold text-red-600 mb-4 flex items-center gap-2">⚠️ Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Permanently delete your account and all data. This cannot be undone.</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm rounded-lg font-medium transition flex-shrink-0"
            >
              {deleteLoading ? "Deleting..." : deleteConfirm ? "Confirm Delete" : "Delete Account"}
            </button>
          </div>
          {deleteConfirm && (
            <p className="text-xs text-red-500 mt-3">⚠ Click again to permanently delete your account and all data!</p>
          )}
        </div>

      </main>
    </div>
  );
}