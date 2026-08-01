// src/features/library/components/transcript-browser/Sidebar.tsx

"use client";

import type { TranscriptEntry } from "./types";
import "./animations.css";

type Category = keyof typeof CATS | "all";

const CATS = {
  behavioral: { label: "Behavioral", color: "#E8940A" },
  dsa: { label: "Data Structures & Algorithms", color: "#00A87E" },
  hld: { label: "High Level Design", color: "#6A5AE0" },
  lld: { label: "Low Level Design", color: "#FF5A3C" },
  "machine-coding": {
    label: "Machine Coding",
    color: "#6A5AE0",
  },
} as const;

type Props = {
  categories: typeof CATS;
  counts: Record<string, number>;
  selected: Category;
  onCategoryChange: (cat: Category) => void;
};

export default function Sidebar({
  categories,
  counts,
  selected,
  onCategoryChange,
}: Props) {
  return (
    <div
      className="desktop-sidebar relative overflow-y-auto"
      style={{
        flex: "0 0 200px",
        padding: "18px 14px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,217,163,0.16), transparent 70%)",
          filter: "blur(10px)",
          animation: "breathe 7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: "#5A5B66",
          textTransform: "uppercase",
          margin: "14px 0 8px",
        }}
      >
        Category
      </div>

      <button
        onClick={() => onCategoryChange("all")}
        className="w-full text-left"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: "8px 10px",
          borderRadius: "10px",
          border: "none",
          background: selected === "all" ? "#15161C" : "transparent",
          fontSize: "13.75px",
          fontWeight: 600,
          color: selected === "all" ? "#FAF9F6" : "#5A5B66",
          cursor: "pointer",
          marginBottom: "2px",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#15161C",
          }}
        />
        All
        <span style={{ marginLeft: "auto", opacity: 0.6 }}>
          {counts.all}
        </span>
      </button>

      {Object.entries(categories).map(([key, cat]) => (
        <button
          key={key}
          onClick={() => onCategoryChange(key as Category)}
          className="w-full text-left"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "8px 10px",
            borderRadius: "10px",
            border: "none",
            background: selected === key ? "#15161C" : "transparent",
            fontSize: "13.75px",
            fontWeight: 600,
            color: selected === key ? "#FAF9F6" : "#5A5B66",
            cursor: "pointer",
            marginBottom: "2px",
          }}
          onMouseEnter={(e) => {
            if (selected !== key) {
              e.currentTarget.style.background =
                "rgba(21,22,28,0.06)";
            }
          }}
          onMouseLeave={(e) => {
            if (selected !== key) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: cat.color,
            }}
          />
          {cat.label}
          <span style={{ marginLeft: "auto", opacity: 0.6 }}>
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}