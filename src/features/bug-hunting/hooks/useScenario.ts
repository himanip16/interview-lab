"use client";
import { useEffect, useState } from "react";
import type { BugScenario } from "../types/Scenario";

export function useScenario(scenarioId: string) {
  const [scenario, setScenario] = useState<BugScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/bug-hunting/scenarios/${scenarioId}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load scenario (${res.status})`);
        return res.json();
      })
      .then((data: BugScenario) => setScenario(data))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [scenarioId]);

  return { scenario, loading, error };
}