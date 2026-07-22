"use client";

import { WHITEBOARD_SYSTEMS } from "../data/whiteboardSystems";
import Link from "next/link";

export default function WhiteboardCatalogue() {
  const systems = Object.values(WHITEBOARD_SYSTEMS);

  return (
    <>
      <style jsx global>{`
        :root {
          --paper: #FAF9F6;
          --ink: #15161C;
          --ink-soft: #5A5B66;
          --mint: #00D9A3;
          --mint-deep: #00A87E;
          --coral: #FF5A3C;
          --violet: #6A5AE0;
          --amber: #E8940A;
        }
      `}</style>
      <div
        style={{ fontFamily: "'Inter', sans-serif", color: "#15161C", background: "#FAF9F6" }}
        className="min-h-screen px-4 pb-20 sm:px-6"
      >
        <div className="mx-auto max-w-[1000px]">
          {/* Navigation */}
          <nav className="flex items-center justify-between py-5 sm:py-[30px]">
            <div className="flex gap-4 overflow-x-auto text-[12.5px] font-medium sm:gap-[30px] sm:text-[13.5px]" style={{ color: "#5A5B66" }}>
              <span className="whitespace-nowrap">About Learn</span>
              <span
                className="whitespace-nowrap pb-0.5 font-semibold"
                style={{ color: "#15161C", borderBottom: "2px solid #15161C" }}
              >
                Whiteboarding
              </span>
              <span className="whitespace-nowrap">Deep Dives</span>
              <span className="whitespace-nowrap">Library</span>
            </div>
            <button
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
              style={{ borderColor: "rgba(21,22,28,0.14)", background: "none", color: "#15161C" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </nav>

          {/* Header */}
          <div className="py-4 pb-6 sm:py-5 sm:pb-[30px]">
            <div className="text-[11.5px] font-bold tracking-[.1em] sm:text-[12.5px]" style={{ color: "#00A87E" }}>
              LEARN WHITEBOARDING
            </div>
            <h1
              style={{ fontFamily: "'Poppins', sans-serif" }}
              className="mt-2.5 max-w-[520px] text-[28px] font-extrabold leading-tight tracking-tight sm:text-[38px]"
            >
              Pick a system to explore
            </h1>
            <p className="mt-3 max-w-[460px] text-[13.5px] leading-relaxed sm:text-[14.5px]" style={{ color: "#5A5B66" }}>
              Click into any component to see its role, who calls it, what it fails to, and how it stays resilient — or walk through a real user flow step by step.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {systems.map((system) => (
              <Link
                key={system.slug}
                href={`/learn/whiteboard/${system.slug}`}
                className="rounded-[22px] border p-5 no-underline transition-transform duration-300 hover:-translate-y-1.5 sm:p-[22px]"
                style={{
                  background: "#fff",
                  borderColor: "rgba(21,22,28,0.07)",
                  color: "inherit",
                  transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(21,22,28,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg
                  className="mb-3.5 h-14 w-14 sm:h-16 sm:w-16"
                  viewBox="0 0 64 64"
                  fill="none"
                  dangerouslySetInnerHTML={{ __html: system.mark }}
                />
                <h3
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  className="text-[15px] font-semibold tracking-tight sm:text-[16px]"
                >
                  {system.title}
                </h3>
                <div className="mt-1.5 min-h-[38px] text-[12.5px] leading-relaxed" style={{ color: "#5A5B66" }}>
                  {system.oneLiner}
                </div>
                <div
                  className="mt-4 flex items-center justify-between border-t pt-3.5"
                  style={{ borderColor: "rgba(21,22,28,0.06)" }}
                >
                  <span
                    className="rounded-full px-2 py-[3px] text-[9.5px] font-bold uppercase"
                    style={{ background: "#FAF9F6", color: "#5A5B66" }}
                  >
                    HLD
                  </span>
                  <span className="text-[11px]" style={{ color: "#5A5B66" }}>
                    {system.comps} components · {system.flows} flows
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}