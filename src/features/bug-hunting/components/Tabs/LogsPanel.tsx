// src/features/bug-hunting/components/Tabs/LogsPanel.tsx

"use client";

import type { BugScenarioDetailDTO } from "../../application/dtos/BugScenarioDTO";
import type { LogEntry } from "../../domain/types";

interface Props {
  scenario: BugScenarioDetailDTO;
}

export default function LogsPanel({
  scenario,
}: Props) {
  const logs: LogEntry[] = scenario.logs ?? [];

  return (
    <>
      <div className="log-search">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />
          <path d="M21 21l-4.3-4.3" />
        </svg>

        Filter logs…
      </div>

      <div className="mono">
        {logs.length === 0 && (
          <div
            style={{
              padding: "24px 4px",
              color: "var(--ink-soft)",
              fontSize: "12px",
            }}
          >
            No logs available.
          </div>
        )}

        {logs.map((log) => (
          <div
            key={log.id}
            className={`log-line ${log.level.toLowerCase()}`}
          >
            <span className="ts">
              {log.timestamp}
            </span>

            <span className="lvl">
              {log.level}
            </span>

            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}