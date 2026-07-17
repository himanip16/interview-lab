// src/features/bug-hunting/hooks/useSubmitHypothesis.ts
"use client";

import { useState, useCallback } from "react";

export function useSubmitHypothesis(scenarioId: string) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const submit = useCallback(
    async (hypothesis: string) => {
      if (!hypothesis.trim()) return;
      setStatus("saving");
      try {
        const res = await fetch("/api/bug-hunting/hypothesis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarioId, hypothesis }),
        });
        if (!res.ok) throw new Error("Failed to save hypothesis");
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    },
    [scenarioId]
  );

  return { submit, status };
}