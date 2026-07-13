"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/Button";

type InterviewTemplate = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function InterviewTypeSelector({
  value,
  onChange,
}: Props) {
  const [templates, setTemplates] = useState<InterviewTemplate[]>([]);
  const [loading, setLoading] = useState(true);

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
            <Button
              key={template.id}
              type="button"
              variant={value === template.slug ? "primary" : "outline"}
              aria-pressed={value === template.slug}
              onClick={() => onChange(template.slug)}
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
          ))}
        </div>
      )}
    </div>
  );
}