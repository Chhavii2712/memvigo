"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useAllAlerts } from "@/hooks/useData";
import Link from "next/link";
import axios from "axios";

const STATE_BADGE = {
  0: "bg-green-100 text-green-700",
  1: "bg-yellow-100 text-yellow-700",
  2: "bg-red-100 text-red-700",
};
const STATE_LABEL = { 0: "HEALTHY", 1: "WARNING", 2: "CRITICAL" };

export default function AlertsPage() {
  const { token, logout } = useAuth();
  const [page, setPage]   = useState(1);
  const { data, mutate }  = useAllAlerts(page);

  const alerts     = data?.alerts ?? [];
  const totalPages = data?.pages  ?? 1;

  const dismiss = async (id) => {
    try {
      // ✅ Relative path
      await axios.delete(`/api/alerts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate();
    } catch (err) {
      console.error("Dismiss failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight">memvigo</Link>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">Alerts</span>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">Dashboard</Link>
          <Link href="/settings"  className="text-sm text-gray-500 hover:text-gray-800">Settings</Link>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Alert History</h1>
          <span className="text-sm text-gray-500">{data?.total ?? 0} total alerts</span>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          {alerts.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">
              No alerts yet. Start the Java engine to generate alerts.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">State</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Message</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Time</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATE_BADGE[alert.state]}`}>
                        {STATE_LABEL[alert.state]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{alert.message}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">
                      {new Date(alert.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => dismiss(alert.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                        Dismiss
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100">
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100">
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
