// src/features/learning/hooks/useScenario.ts

import { useState, useEffect } from "react";

import { Scenario, ScenarioListItem } from "../types/learning";

export function useScenarios() {
  const [scenarios, setScenarios] = useState<ScenarioListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScenarios() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/learning-scenarios");
        if (!response.ok) {
          throw new Error("Failed to fetch scenarios");
        }
        const data = await response.json();
        setScenarios(data.scenarios || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch scenarios");
      } finally {
        setLoading(false);
      }
    }

    fetchScenarios();
  }, []);

  return { scenarios, loading, error };
}

export function useScenario(slug: string) {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScenario() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/learning-scenarios/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch scenario");
        }
        const data = await response.json();
        setScenario(data.scenario || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch scenario");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchScenario();
    }
  }, [slug]);

  return { scenario, loading, error };
}
