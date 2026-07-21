"use client";

import { useState } from "react";
import type { DatabaseFixture } from "@/features/bug-hunting/domain/types/DatabaseFixture";

type Props = {
  scenarioId: string;
  fixture: DatabaseFixture;
};

export default function SqlPanel({
  scenarioId,
  fixture,
}: Props) {
  const [query, setQuery] = useState(
    fixture.initialQueries[0]?.query ?? ""
  );

  const [result, setResult] = useState<{
    columns: string[];
    rows: unknown[][];
  } | null>({
    columns:
      fixture.tables[0]?.columns.map((c) => c.name) ?? [],
    rows:
      fixture.tables[0]?.rows ?? [],
  });

  const [running, setRunning] = useState(false);

  const runQuery = async () => {
    setRunning(true);

    try {
      const res = await fetch("/api/bug-hunting/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenarioId,
          query,
        }),
      });

      const data = await res.json();
      setResult(data);
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <textarea
        className="bh-sql-box mono"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        spellCheck={false}
      />

      <button
        className="bh-run-btn"
        onClick={runQuery}
        disabled={running}
      >
        {running ? "Running…" : "Run query"}
      </button>

      {result && (
        <table>
          <thead>
            <tr>
              {result.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}