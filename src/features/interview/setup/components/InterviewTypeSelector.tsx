"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { type InterviewType } from "../types/setup";

type InterviewTemplate = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

type Props = {
  value: InterviewType;
  onChange: (value: InterviewType) => void;
  onTopicChange?: (topic: string) => void;
};

const DEEP_DIVE_TOPICS = [
  "Distributed Systems",
  "Databases",
  "Caching",
  "Message Queues",
  "Microservices",
  "API Design",
  "System Reliability",
  "Performance Optimization",
];

export default function InterviewTypeSelector({
  value,
  onChange,
  onTopicChange,
}: Props) {
  const [templates, setTemplates] = useState<InterviewTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch("/api/interview-templates");
        const data = await response.json();
        setTemplates(data.templates || []);
      } catch (error) {
        console.error("Failed to fetch interview templates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (value !== "deep_dive") {
      setSelectedTopic("");
      onTopicChange?.("");
    }
  }, [value, onTopicChange]);

  function handleTopicChange(topic: string) {
    setSelectedTopic(topic);
    onTopicChange?.(topic);
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="mb-3 font-semibold text-foreground">
          Interview Type
        </h3>
        <p className="text-sm text-muted-foreground">Loading interview types...</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold text-foreground">
        Interview Type
      </h3>

      {templates.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No interview types available.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map((template) => (
            <div key={template.id}>
              <Button
                type="button"
                variant={value === template.slug ? "primary" : "outline"}
                aria-pressed={value === template.slug}
                onClick={() => onChange(template.slug as InterviewType)}
                className="h-auto w-full justify-start p-5 text-left"
              >
                <div>
                  <h3 className="font-semibold">
                    {template.name}
                  </h3>

                  {template.description && (
                    <p className="mt-1 text-sm opacity-80">
                      {template.description}
                    </p>
                  )}
                </div>
              </Button>

              {value === "deep_dive" && template.slug === "deep_dive" && (
                <div className="mt-3 pl-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Select Topic:
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    className="w-full rounded border border-border bg-card px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">Choose a topic...</option>
                    {DEEP_DIVE_TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}