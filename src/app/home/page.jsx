"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-[#0a0f1e] text-white" : "bg-white text-gray-900"}`}>

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-[#0a0f1e]/90 backdrop-blur-md border-b border-white/10"
            : "bg-white/90 backdrop-blur-md border-b border-gray-200"
          : ""
      } px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">M</div>
          <span className="text-lg font-bold tracking-tight">memvigo</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="#how-it-works" className={`text-sm transition-colors hidden md:block ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>How It Works</Link>
          <Link href="#features" className={`text-sm transition-colors hidden md:block ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>Features</Link>
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-full transition ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
              title="Toggle theme"
            >
              {isDark ? "🌙" : "🌞"}
            </button>
          )}
          <Link href="/dashboard" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Enter Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div key={i} className={`absolute w-1 h-1 rounded-full ${isDark ? "bg-white/10" : "bg-gray-900/5"}`}
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block text-xs font-mono bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full mb-8 border border-blue-500/20">
            ML-Powered · Real-Time · Java + Next.js
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Monitor. Detect.
            <br />
            Prevent.
            <br />
            <span className="text-blue-500">Before Your System Crashes.</span>
          </h1>

          <p className={`text-lg max-w-2xl mx-auto mb-10 leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            MemVigo watches your PC's memory health in real-time, learns your system's normal behavior, and alerts you the moment something goes wrong — before it becomes a crash.
          </p>

          <div className="flex justify-center">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
              Enter Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">Simple Process</span>
          <h2 className="text-4xl font-bold mt-3">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: "⬇", title: "Download Agent", desc: "Download the MemVigo agent — a lightweight app that runs silently in the background on your Windows PC. No setup required." },
            { step: "02", icon: "▶", title: "Run Once", desc: "Run the agent once and sign in with your MemVigo account. It auto-starts on every boot — completely silent." },
            { step: "03", icon: "📊", title: "Monitor Anywhere", desc: "Open your dashboard from any device — phone, tablet, or PC — and see your memory health updating live." },
          ].map((item) => (
            <div key={item.step} className={`border rounded-2xl p-8 transition-colors ${isDark ? "bg-white/5 border-white/10 hover:bg-white/[0.08]" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl">{item.icon}</span>
                <span className={`text-6xl font-bold ${isDark ? "text-white/5" : "text-gray-200"}`}>{item.step}</span>
              </div>
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Step {item.step}
              </span>
              <h3 className="text-xl font-bold mt-4 mb-3">{item.title}</h3>
              <p className={`leading-relaxed text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">What We Offer</span>
            <h2 className="text-4xl font-bold mt-3">Features</h2>          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🧠", title: "ML-Based Detection", desc: "Our ML engine learns what's normal for your specific PC and flags unusual behavior — not just fixed thresholds." },
              { icon: "⚡", title: "Instant Alerts", desc: "Get real-time alerts the moment memory fragmentation, IO wait, or page fault rates spike beyond normal." },
              { icon: "📱", title: "Monitor From Anywhere", desc: "Your dashboard is accessible from any device. Check your PC's memory health from your phone while away." },
              { icon: "🔇", title: "Silent Background Agent", desc: "Runs completely silently with no terminal windows. Just a small system tray icon — monitoring round the clock." },
              { icon: "🔄", title: "Auto-Start on Boot", desc: "Once installed, the agent starts automatically every time you turn on your PC. Set it and forget it." },
              { icon: "📈", title: "Historical Data", desc: "All telemetry is stored so you can track memory health trends over time and spot patterns before they become problems." },
            ].map((f) => (
              <div key={f.title} className={`border rounded-2xl p-6 transition-colors ${isDark ? "bg-white/5 border-white/10 hover:bg-white/[0.08]" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alert States */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">Intelligence</span>
          <h2 className="text-4xl font-bold mt-3">3 Levels of Awareness</h2>
          <p className={`mt-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>MemVigo always knows how your system is doing</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { state: "HEALTHY", dot: "bg-green-500", color: "bg-green-500/20 text-green-400 border-green-500/20", desc: "All memory metrics are within normal range. Your system is running fine." },
            { state: "WARNING", dot: "bg-yellow-500", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20", desc: "Unusual activity detected. Memory pressure is building up — watch closely." },
            { state: "CRITICAL", dot: "bg-red-500", color: "bg-red-500/20 text-red-400 border-red-500/20", desc: "High fragmentation or IO stress detected. Immediate attention required." },
          ].map((s) => (
            <div key={s.state} className={`border rounded-2xl p-6 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-3 h-3 rounded-full ${s.dot}`}></span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${s.color}`}>{s.state}</span>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t px-6 py-8 text-center text-xs ${isDark ? "border-white/10 text-gray-600" : "border-gray-200 text-gray-400"}`}>
        memvigo — Real-Time Memory Health Monitoring
      </footer>
    </div>
  );
}