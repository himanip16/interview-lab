"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-[80vh] items-center">
      <div className="max-w-3xl">
        <p className="mb-4 text-emerald-400 font-mono text-sm">
          Practice Like Top Tech Companies
        </p>

        <h1 className="text-6xl font-bold leading-tight text-white">
          AI Technical
          <br />
          Interview Platform
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
          Practice realistic technical interviews for
          System Design, Backend Engineering, Java,
          Databases and Distributed Systems.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/#interviews"
            className="rounded-lg bg-white px-6 py-3 font-medium text-black hover:bg-zinc-200 transition-colors"
          >
            Start Interview
          </Link>

          <Link
            href="/#interviews"
            className="rounded-lg border border-zinc-700 px-6 py-3 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
          >
            Browse Interviews
          </Link>
        </div>
      </div>
    </section>
  );
}