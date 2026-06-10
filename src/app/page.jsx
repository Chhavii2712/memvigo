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

  return (
    <div className="min-h-screen bg-[#0a0f1e] dark:bg-[#0a0f1e] light:bg-white text-white dark:text-white">

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0f1e]/90 backdrop-blur-md border-b border-white/10" : ""} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">M</div>
          <span className="text-lg font-bold tracking-tight">memvigo</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">How It Works</Link>
          <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Features</Link>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-white/10 transition"
              title="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "🌞"}
            </button>
          )}
          <Link href="/login" className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors">Sign In</Link>
          <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white/10 rounded-full"
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

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            MemVigo watches your PC's memory health in real-time, learns your system's normal behavior, and alerts you the moment something goes wrong — before it becomes a crash.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
              Start Monitoring →
            </Link>
            <Link href="/login" className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
              Enter Dashboard
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
            {
              step: "01",
              icon: "⬇",
              title: "Download Agent",
              desc: "Download the MemVigo agent — a lightweight app that runs silently in the background on your Windows PC. No setup required.",
            },
            {
              step: "02",
              icon: "▶",
              title: "Run Once",
              desc: "Run the agent once and sign in with your MemVigo account. It auto-starts on every boot — completely silent.",
            },
            {
              step: "03",
              icon: "📊",
              title: "Monitor Anywhere",
              desc: "Open your dashboard from any device — phone, tablet, or PC — and see your memory health updating live.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.08] transition-colors">
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl">{item.icon}</span>
                <span className="text-6xl font-bold text-white/5">{item.step}</span>
              </div>
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Step {item.step}
              </span>
              <h3 className="text-xl font-bold mt-4 mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">Full Toolkit</span>
            <h2 className="text-4xl font-bold mt-3">Everything You Need</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "ML-Based Detection",
                desc: "Our ML engine learns what's normal for your specific PC and flags unusual behavior — not just fixed thresholds.",
              },
              {
                icon: "⚡",
                title: "Instant Alerts",
                desc: "Get real-time alerts the moment memory fragmentation, IO wait, or page fault rates spike beyond normal.",
              },
              {
                icon: "📱",
                title: "Monitor From Anywhere",
                desc: "Your dashboard is accessible from any device. Check your PC's memory health from your phone while away.",
              },
              {
                icon: "🔇",
                title: "Silent Background Agent",
                desc: "Runs completely silently with no terminal windows. Just a small system tray icon — monitoring round the clock.",
              },
              {
                icon: "🔄",
                title: "Auto-Start on Boot",
                desc: "Once installed, the agent starts automatically every time you turn on your PC. Set it and forget it.",
              },
              {
                icon: "📈",
                title: "Historical Data",
                desc: "All telemetry is stored so you can track memory health trends over time and spot patterns before they become problems.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-colors">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
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
          <p className="text-gray-400 mt-3">MemVigo always knows how your system is doing</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              state: "HEALTHY",
              dot: "bg-green-500",
              color: "bg-green-500/20 text-green-400 border-green-500/20",
              desc: "All memory metrics are within normal range. Your system is running fine.",
            },
            {
              state: "WARNING",
              dot: "bg-yellow-500",
              color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
              desc: "Unusual activity detected. Memory pressure is building up — watch closely.",
            },
            {
              state: "CRITICAL",
              dot: "bg-red-500",
              color: "bg-red-500/20 text-red-400 border-red-500/20",
              desc: "High fragmentation or IO stress detected. Immediate attention required.",
            },
          ].map((s) => (
            <div key={s.state} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-3 h-3 rounded-full ${s.dot}`}></span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${s.color}`}>{s.state}</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Monitor Your PC?</h2>
          <p className="text-gray-400 mb-10">Join MemVigo and never be surprised by a memory crash again.</p>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors inline-block">
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-gray-600">
        memvigo — Real-Time Memory Health Monitoring
      </footer>
    </div>
  );
}