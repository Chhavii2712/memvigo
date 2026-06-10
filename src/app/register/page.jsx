"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("All fields required"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register",
        { email: form.email, password: form.password },
        { withCredentials: true }
      );
      login(data.user, data.accessToken);
      router.push("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${isDark ? "bg-[#0a0f1e]" : "bg-gray-50"}`}>
      {/* Theme toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`fixed top-4 right-4 p-2 rounded-full transition ${isDark ? "hover:bg-white/10" : "hover:bg-gray-200"}`}
        >
          {isDark ? "🌙" : "🌞"}
        </button>
      )}
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white mx-auto mb-4">M</div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>memvigo</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Create your account</p>
        </div>
        <div className={`border rounded-2xl p-6 space-y-4 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Email</label>
            <input type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-gray-600" : "bg-white border-gray-300 text-gray-900"}`}
              placeholder="you@example.com" />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Password</label>
            <input type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-gray-600" : "bg-white border-gray-300 text-gray-900"}`}
              placeholder="Min. 8 characters" />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Confirm Password</label>
            <input type="password" value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-gray-600" : "bg-white border-gray-300 text-gray-900"}`}
              placeholder="Repeat password" />
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors">
            {loading ? "Creating account…" : "Create Account"}
          </button>
          <p className={`text-center text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            Already registered? <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}