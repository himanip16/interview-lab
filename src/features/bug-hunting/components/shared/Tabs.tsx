"use client";
import type { TabId } from "../../hooks/useInvestigation";

const TABS: { id: TabId; label: string }[] = [
  { id: "logs", label: "Logs" },
  { id: "sql", label: "SQL runner" },
  { id: "code", label: "Code" },
  { id: "docs", label: "Tech docs" },
  { id: "deployments", label: "Deployments" },
];

export default function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <div className="tabbar">
      {TABS.map((t) => (
        <div
          key={t.id}
          className={`tab${active === t.id ? " active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}