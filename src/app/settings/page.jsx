"use client";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, logout, token } = useAuth();
  const [apiKey,   setApiKey]   = useState(null);
  const [copied,   setCopied]   = useState(false);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setApiKey(d.user?.apiKey); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight">MemVigo</Link>
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

        {/* API Key — most important section */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">🔑 Your API Key</h2>
          <p className="text-xs text-gray-500 mb-4">
            Paste this key into your Java engine config so it sends data to YOUR dashboard only.
            Keep it private — anyone with this key can post to your dashboard.
          </p>

          {loading ? (
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <div className="flex gap-2">
              <code className="flex-1 bg-gray-50 border rounded-lg px-3 py-2 text-xs font-mono text-gray-800 break-all">
                {apiKey}
              </code>
              <button
                onClick={copyKey}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-medium transition-colors flex-shrink-0"
              >
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>
          )}

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-800 mb-2">How to use:</p>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>Copy your API key above</li>
              <li>Open <code className="bg-blue-100 px-1 rounded">engine/src/main/java/com/memvigo/AlertLogger.java</code></li>
              <li>Replace <code className="bg-blue-100 px-1 rounded">YOUR_API_KEY_HERE</code> with your key</li>
              <li>Rebuild: <code className="bg-blue-100 px-1 rounded">mvn clean package -q</code></li>
              <li>Run: <code className="bg-blue-100 px-1 rounded">java -jar target\memvigo-engine-1.0.0.jar</code></li>
            </ol>
          </div>
        </div>

        {/* Engine Config */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">AI Thresholds</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "CRITICAL frag_ratio",    value: "> 0.80" },
              { label: "CRITICAL io_wait",        value: "> 50 ms" },
              { label: "WARNING active_processes",value: "> 350" },
              { label: "WARNING page_fault_rate", value: "> 50 / s" },
              { label: "Heartbeat interval",      value: "3000 ms" },
              { label: "Dashboard poll",          value: "5000 ms" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1 border-b last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-mono text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-200 p-6">
          <h2 className="font-semibold text-red-700 mb-3">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">Sign out of your MemVigo account on this device.</p>
          <button onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
