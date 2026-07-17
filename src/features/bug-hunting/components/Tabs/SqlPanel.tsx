"use client";

import { useState } from "react";

import type {
  BugScenario,
} from "../../types/Scenario";

interface Props {
  scenario: BugScenario;
}

export default function SqlPanel({
  scenario,
}: Props) {
  const [query, setQuery] = useState(
    scenario.sql?.initialQuery ?? ""
  );

  const columns = scenario.sql?.columns ?? [];
  const rows = scenario.sql?.rows ?? [];

  return (
    <>
      <textarea
        className="sql-box mono"
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        spellCheck={false}
      />

      <button
        type="button"
        className="run-btn"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>

        Run query
      </button>

      {columns.length > 0 && (
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const isRetry =
                    columns[cellIndex] ===
                    "retry_count";

                  return (
                    <td
                      key={cellIndex}
                      className={
                        isRetry &&
                        Number(cell) >= 3
                          ? "flag"
                          : undefined
                      }
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {columns.length === 0 && (
        <div
          style={{
            paddingTop: 24,
            color: "var(--ink-soft)",
            fontSize: 12,
          }}
        >
          No query results.
        </div>
      )}
    </>
  );
}