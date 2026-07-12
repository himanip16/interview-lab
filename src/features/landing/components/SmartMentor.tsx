"use client";

import Link from "next/link";

export default function SmartMentor() {
  return (
    <section className="py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Smart Mentor Recommendation
        </h2>
        <p className="text-zinc-400">What should I do next?</p>
      </div>

      <div className="rounded-2xl bg-zinc-900 p-8 border border-zinc-800">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Recommended Session
            </h3>
            <p className="text-zinc-400 text-sm">
              Mentor Assessment
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded-full border border-emerald-500/20">
            Easy • 30 min
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-md">
            Base62 Encoding
          </span>
          <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-md">
            Key Generation Service
          </span>
          <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-md">
            Database Indexing
          </span>
        </div>

        <Link
          href="/interview/setup"
          className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          Enter Session
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
