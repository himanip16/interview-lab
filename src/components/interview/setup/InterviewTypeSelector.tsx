import { Button } from "@/src/components/ui/Button";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const INTERVIEW_TYPES = [
  {
    id: "system-design",
    title: "Standard System Design",
    description:
      "General architecture, APIs, and database design.",
  },
  {
    id: "high-scale",
    title: "High Scale / Distributed",
    description:
      "Focus on sharding, caching, scalability, and throughput.",
  },
  {
    id: "api-design",
    title: "API & Integration",
    description:
      "Focus on API contracts, integrations, and developer experience.",
  },
] as const;

export default function InterviewTypeSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {INTERVIEW_TYPES.map((type) => (
        <Button
          key={type.id}
          type="button"
          variant={value === type.id ? "primary" : "outline"}
          aria-pressed={value === type.id}
          onClick={() => onChange(type.id)}
          className="h-auto w-full justify-start p-5 text-left"
        >
          <div>
            <h3 className="font-semibold">
              {type.title}
            </h3>

            <p className="mt-1 text-sm opacity-80">
              {type.description}
            </p>
          </div>
        </Button>
      ))}
    </div>
  );
}