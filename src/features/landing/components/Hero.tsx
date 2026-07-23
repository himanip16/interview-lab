// src/features/landing/components/Hero.tsx

"use client";
import { ROUTES } from "@/shared/constants/routes";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-[80vh] items-center">
      <div className="max-w-3xl">
        <p className="mb-4 text-primary font-mono text-sm">
          Practice Like Top Tech Companies
        </p>

        <h1 className="text-6xl font-bold leading-tight text-foreground">
          AI Technical
          <br />
          Interview Platform
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
          Practice realistic technical interviews for
          System Design, Backend Engineering, Java,
          Databases and Distributed Systems.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href={ROUTES.LEARN}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Learn
          </Link>

        

          <Link
            href="/problems"
            className="rounded-lg border border-border px-6 py-3 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
          >
            Browse Interview Library
          </Link>
        </div>
      </div>
    </section>
  );
}