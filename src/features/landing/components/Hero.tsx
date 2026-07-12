"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-[80vh] items-center">
      <div className="max-w-3xl">
        <p className="mb-4 text-blue-400">
          Practice Like Top Tech Companies
        </p>

        <h2 className="text-6xl font-bold leading-tight">
          AI Technical
          <br />
          Interview Platform
        </h2>

        <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
          Practice realistic technical interviews for
          System Design, Backend Engineering, Java,
          Databases and Distributed Systems.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/#interviews"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500"
          >
            Start Interview
          </Link>

          <Link
            href="/#interviews"
            className="rounded-lg border border-zinc-700 px-6 py-3"
          >
            Browse Interviews
          </Link>
        </div>
      </div>
    </section>
  );
}