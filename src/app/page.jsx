import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight">memvigo</span>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign In</Link>
          <Link href="/register" className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <span className="inline-block text-xs font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-full mb-6 border border-blue-200">
          AI Expert System · Python + Java · Real-Time
        </span>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4 max-w-2xl leading-tight">
          Stop Memory Fragmentation <span className="text-blue-600">Before It Crashes Your System</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          memvigo continuously monitors live hardware vitals using a rule-based AI engine and flags impending fragmentation crises before they cause an OOM crash.
        </p>
        <div className="flex gap-4">
          <Link href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Start Monitoring
          </Link>
          <Link href="/login" className="border px-6 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Sign In
          </Link>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="border-t bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🧠",
              title: "Rule-Based AI Engine",
              desc: "Expert system with deterministic heuristics. No ML training required — pure logic that mirrors how a sysadmin thinks.",
            },
            {
              icon: "🔗",
              title: "Cross-Language Bridge",
              desc: "Java daemon calls Python AI via ProcessBuilder. Two languages, one seamless pipeline. Production-grade engineering.",
            },
            {
              icon: "📊",
              title: "Live Dashboard",
              desc: "Real-time fragmentation charts, metric cards, and alert feed. Auto-refreshes every 5 seconds via SWR polling.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* State Table */}
      <section className="px-6 py-16 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-8">AI Decision Matrix</h2>
        <div className="rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">State</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trigger</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              <tr>
                <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">HEALTHY</span></td>
                <td className="px-4 py-3 text-gray-600">All metrics below thresholds</td>
                <td className="px-4 py-3 text-gray-500">Log heartbeat</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-semibold">WARNING</span></td>
                <td className="px-4 py-3 text-gray-600">processes &gt; 200 AND page faults &gt; 30</td>
                <td className="px-4 py-3 text-gray-500">Append to log, push alert</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">CRITICAL</span></td>
                <td className="px-4 py-3 text-gray-600">frag_ratio &gt; 0.80 AND io_wait &gt; 50ms</td>
                <td className="px-4 py-3 text-gray-500">Log + run self-healing defrag</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t px-6 py-6 text-center text-xs text-gray-400">
        memvigo — B.Tech Project · AI Expert Systems · Cross-Language Engineering
      </footer>
    </div>
  );
}
