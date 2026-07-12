"use client";

import Link from "next/link";

const notebooks = [
  {
    title: "URL Shortener Walkthrough",
    readTime: "15 min read",
  },
  {
    title: "Senior Backend at Uber",
    readTime: "20 min read",
  },
  {
    title: "LLD Parking Lot Walkthrough",
    readTime: "12 min read",
  },
  {
    title: "LRU Cache Implementation",
    readTime: "8 min read",
  },
];

export default function PersonalNotebooks() {
  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Personal Notebooks
          </h2>
          <p className="text-zinc-400">Continue reading</p>
        </div>
        <Link
          href="/library"
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          Open Library
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {notebooks.map((notebook, index) => (
          <div
            key={index}
            className="rounded-xl bg-zinc-900 p-6 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group"
          >
            <h3 className="text-white font-medium mb-2 group-hover:text-zinc-200 transition-colors">
              {notebook.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-sm">{notebook.readTime}</span>
              <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
